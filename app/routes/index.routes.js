'use strict';

var core = require('./core.routes.js');
var users = require('./user.routes');

module.exports = function(app) {
  core(app);
  users(app);
};