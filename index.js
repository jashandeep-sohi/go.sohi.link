import config from "./config.yaml"

/**
 * Respond with a HTML page with <meta go-* ....> tags or index listing all
 * repos.
 * @param {Request} request
 */
async function handleRequest(request) {
  if (request.method != "GET")
    return MethodNotAllowed(request, "GET")

  const url = new URL(request.url)

  const bestPath = config.paths.filter(p => url.pathname.startsWith(p.path)).sort(
    (a, b) => b.path.length - a.path.length
  ).shift()


  if (url.pathname == "/" && bestPath === undefined) {
    return HTMLResponse(indexTemplate(config.paths))
  } else if (bestPath !== undefined) {
    return HTMLResponse(metaTemplate({
      importPrefix: `${config.hostname}${bestPath.path}`,
      vcs: bestPath.vcs,
      repoRoot: bestPath.repoRoot,
      home: bestPath.home,
      directory: bestPath.directory,
      file: bestPath.file,
      redirectURL: bestPath.home
    }))
  } else {
    return new Response("404 Not Found", {status: 404})
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})


function indexTemplate(paths) {
  return `<!DOCTYPE html>
<html>
  <body>
    <h1>Index</h1>
    <ul>
      ${paths.map(p => `<li><a href="${p.path}">${p.path}</a></li>`).join("\n")}
    </ul>
  </body>
</html>
`
}

function metaTemplate({importPrefix, vcs, repoRoot, home, directory, file, redirectURL} = {}) {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta name="go-import" content="${importPrefix} ${vcs} ${repoRoot}">
    <meta name="go-source" content="${importPrefix} ${home} ${directory} ${file}">
    <meta http-equiv="refresh" content="0; url=${redirectURL}">
  </head>
</html>
`
}

const DEFAULT_HTML_HEADERS = {
  "content-type": "text/html;charset=utf-8"
}

function MethodNotAllowed(request, allowed) {
  return new Response(
    `Method ${request.method} not allowed.`,
    {status: 405, headers: { "Allow": allowed}}
  )
}

function HTMLResponse(data) {
  return new Response(data, {headers: DEFAULT_HTML_HEADERS})
}
