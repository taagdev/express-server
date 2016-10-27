'use strict';

module.exports = function(app) {

  var core = require('../controllers/core.controller');

  app.route('/').get(core.index);
  app.route('/api/v1/auth/signin').post(core.signIn);
  app.route('/api/v1/auth/signout').get(core.signOut);
  app.route('/api/v1/auth/register').post(core.signup);
};
