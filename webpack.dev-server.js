var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");
var config = require('./webpack.config');

var server = new WebpackDevServer(webpack(config), {

  contentBase: "http://localhost:4000",

  publicPath: config.output.publicPath,
  hot: true,
  colors: true,
  process: true,
  historyApiFallback: true,

  proxy: {
    "*": "http://localhost:4000"
  }
});
server.listen(9222, "0.0.0.0", function(err) {
  if(err) {
    console.log(err);
  }
  console.log('webpack listening at localhost:9000');
});
