'use strict';

exports.register = function *() {
  yield this.render("account", {
    sitename: '简寻',
    component: { register: true },
    scripts_url: ['/static/js/dist/common.js', '/static/js/dist/loginRegister.js'],
    styles_url: ['/static/css/login-register.css'],
  });
};

exports.login =  function *() {
  yield this.render("account", {
    sitename: '简寻',
    component: { login: true },
    scripts_url: ['/static/js/dist/common.js', '/static/js/dist/loginRegister.js'],
    styles_url: ['/static/css/login-register.css'],
  }) 
}
