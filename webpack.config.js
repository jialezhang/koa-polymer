/* eslint-disable no-var */
var path = require('path');
var webpack = require('webpack');
var node_modules_dir = path.resolve(__dirname, 'node_modules');
var CommonsChunkPlugin = require(node_modules_dir + "/webpack/lib/optimize/CommonsChunkPlugin");
var ProvidePlugin = require(node_modules_dir + "/webpack/lib/ProvidePlugin");
var paths = {
  static: path.resolve(__dirname, 'jianxun/static'),
  jsSrc: path.resolve(__dirname, 'jianxun/static/js/src'),
  jsEntry: path.resolve(__dirname, 'jianxun/static/js/src/entry'),
  webapck: 'http://localhost:9222/static'
};

module.exports = {
  // If you pass an array: All modules are loaded upon startup. The last one is exported.
  entry: {
    account:  paths.jsEntry + '/account/account.index.js',
    faq: paths.jsEntry + '/faq/faq.index.js',
    fillin:  paths.jsEntry + '/fillin/fillin.index.js',
    homepage:  paths.jsEntry + '/homepage/homepage.index.js',
    loginRegister:  paths.jsEntry + '/login_register/login-register.index.js',
    position:  paths.jsEntry + '/position/position.index.js',
    resume:  paths.jsEntry + '/resume/resume.index.js',
    share:  paths.jsEntry + '/share/share.index.js',
  },
  output: {
    path: path.resolve(paths.static, 'js/dist'),
    publicPath: 'http://localhost:9222/static/js/dist/',
    filename: '[name].js',
    chunkFileName: '[id].chunk.js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin("common.js"),
    new webpack.ProvidePlugin({
      $: "jquery",
      "window.jquery": "jquery",
      "jQuery": "jquery",
      "window.jQuery": "jquery",
      'Chart': 'Chart'
    })
  ],
  // Options affecting the resolving of modules.
  resolve: {
    root: paths.static,
    alias: {
      "UI": paths.jsSrc + "/ui",
      "Helper": paths.jsSrc + "/helper",
      "Vendor": paths.jsSrc + "/vendor",
      "Constant": paths.jsSrc + "/constant",
      "Data": paths.jsSrc + "/data",
      "Setting": paths.jsSrc + "/setting",
    },
    // An array of extensions that should be used to resolve modules. For example, in order to discover CoffeeScript files, your array should contain the string ".coffee".
    extensions: [ '', '.js' ]
  },
  module: {
    loaders:[
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        include: path.join(paths.static, 'js/')},
      {
        test: /\.scss$/,
        loader: 'style!css!sass'},
      {
        test: /\.css$/,
        loader: 'style!css'},
      {
        test: /\.(png|jpg)$/,
        loader: 'url?limit=10000000' },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&minetype=application/font-woff" },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader" }
    ]
  }
};
