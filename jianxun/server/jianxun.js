"use strict";

let path = require("path");
let serve = require("koa-static-cache");
let session = require("koa-generic-session");
let MongoStore = require("koa-sess-mongo-store");
let responseTime = require("koa-response-time");
let logger = require("koa-logger");
// let views = require("koa-views");
let compress = require("koa-compress");
let errorHandler = require("koa-error");
let bodyParser = require("koa-bodyparser");
let handlebars = require("koa-handlebars");

const STATIC_FILES_MAP = {};
const SERVE_OPTIONS = { maxAge: 365 * 24 * 60 * 60 };

module.exports = function(app, config, passport) {
  if (!config.app.keys) { throw new Error("Please add session secret key in the config file!"); }
  app.keys = config.app.keys;

  if (config.app.env !== "test") {
    app.use(logger());
  }

  app.use(errorHandler());

  if (config.app.env === "production") {
    // 静态资源处理
    app.use(serve(path.join(config.app.root, "build", "public"), SERVE_OPTIONS, STATIC_FILES_MAP));
  } else {
    app.use(require("koa-proxy")({
      host: "http://localhost:9222",
      match: /^\/static\/js\/dist/
    }));
    app.use(serve(path.join(config.app.root), SERVE_OPTIONS, STATIC_FILES_MAP));
  }

  app.use(session({
    key: "koareactfullexample.sid",
    store: new MongoStore({ url: config.mongo.url })
  }));

  app.use(bodyParser());
  app.use(passport.initialize());
  app.use(passport.session());

  // app.use(function *(next) {
  //   this.render = views(config.app.root + "/src/views", {
  //     map: { html: "handlebars" },
  //     cache: config.app.env === "development" ? "true" : false
  //   });
  //   yield next;
  // });

  app.use(handlebars({
    root: config.app.root + "/template/",
    extension: ["html", "hbs", "tpl"],
    cache: false,
    viewsDir: 'entry',
    defaultLayout: 'main',
    layoutsDir: 'layout',
    partialsDir: 'module'
  }));
  app.use(compress());
  app.use(responseTime());
};
