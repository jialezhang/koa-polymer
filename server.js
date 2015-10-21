"use strict";
/**
 * Dependencies
 */
let path = require("path");
let fs = require('fs');
let koa = require("koa");
let passport = require("koa-passport");
/**
 * Config
 */
const CONFIG = require("./jianxun/server/config");
const SERVER_PATH = path.resolve(__dirname, "./jianxun/server"); 


/**
 * Load the models
 */
const modelsPath = CONFIG.app.root + "/model";
fs.readdirSync(modelsPath).forEach(function(file) {
  if (~file.indexOf("js")) {
    require(modelsPath + "/" + file);
  }
});

/**
 * Server
 */
let app = module.exports = koa();
// passport
require(SERVER_PATH + "/passport")(passport, CONFIG);
// app
require(SERVER_PATH + "/jianxun")(app, CONFIG, passport);
// route
require(SERVER_PATH + "/route")(app, passport);

// Start app
if (!module.parent) {
  app.listen(CONFIG.app.port);
  console.log("Environment: " + CONFIG.app.env);
  console.log("Server started, listening on port: " + CONFIG.app.port);
}
