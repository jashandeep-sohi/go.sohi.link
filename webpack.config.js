module.exports = {
  target: "webworker",
  entry: "./index.js",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.yaml$/,
        type: "json",
        use: "yaml-loader"
      }
    ]
  }
}
