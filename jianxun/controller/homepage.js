'use strict';

exports.homepage = function *() {
  yield this.render("homepage", {
    sitename: '简寻',
    scripts_url: ['/static/js/dist/common.js', '/static/js/dist/homepage.js'],
    styles_url: ['/static/css/cc-homepage.css'],
  });
};
