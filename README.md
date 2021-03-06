[![Go Reference](https://pkg.go.dev/badge/go.sohi.link/demo.svg)](https://pkg.go.dev/go.sohi.link/demo)
[![Deploy](https://github.com/jashandeep-sohi/go.sohi.link/actions/workflows/deploy-prod.yml/badge.svg)](https://github.com/jashandeep-sohi/go.sohi.link/actions/workflows/deploy-prod.yml)

# What?

Vanity/custom Go `import "example.com/foo/pkg/bar"` paths using Cloudflare Workers.

# Where?

https://go.sohi.link/

# Why?

- Own your import paths.
- Avoid vendor lock-in (Github, Gitlab, etc).
- Do it without managing any servers or paying anything
  (Cloudflare Workers are basically a version of Serverlessâ„˘ w/ 100K requests/day on free tier).

# How?

When you `go get go.sohi.link/go-project/pkg` it makes a `GET` request to `https://go.sohi.link/go-project/pkg?go-get=1`.
If it finds a `<meta name="go-import" content="go.sohi.link/library git github.com/jashandeep-sohi/go-project">`
on that page, it knows to fetch the actual code from `github.com/jashandeep-sohi/go-project`
using `git` as the VCS.

More details at https://pkg.go.dev/cmd/go#hdr-Remote_import_paths

This Worker just generates those `<meta go-* ...>` tag pages based 
on`config.yaml`.

# Cookbook

Install `wrangler` CF Workers CLI:

```
$ npm install -g @cloudflare/wrangler
# OR
$ cargo install wrangler
```

Login:

```
$ wrangler login
```

Set required env vars:

```
$ export CF_ACCOUNT_ID=xxxx

# For prod deployment only
$ export CF_ZONE_ID=xxxxx
```

Local deploy:

```
$ wrangler dev
```

Remote deploy:

```
$ wrangler publish
```

Prod deploy:

```
$ wrangler publish --env prod
```
