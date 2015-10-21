"use strict";

let Router = require("koa-router");
let homepageController = require("../controller/homepage");
let accountController = require("../controller/account");

let secured = function *(next) {
  if (this.isAuthenticated()) {
    yield next;
  } else {
    this.status = 401;
  }
};

module.exports = function(app, passport) {
  // register functions
  var router = new Router();

  router.use(function *(next) {
    this.type = "json";
    yield next;
  });

  router.get("/", homepageController.homepage);
  router.get("/account/register", accountController.register);
  router.get("/account/login", accountController.login);

  app.use(router.routes());
};
