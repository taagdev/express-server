'use strict';

/**
 * Module dependencies
 */
var users = require('../controllers/users.controller'),
 passport = require('passport'),

 initPassportWare = require('../../config/passport')(passport); 

module.exports = function(app) {
  
  app.route('/users')
    .get(users.list);

  app.route('/users/:userId')
    .get(users.me)
    .put(users.update);

  app.route('/auth/facebook').get(passport.authenticate('facebook', {
    scope: ['email']
  }));
  app.route('/auth/facebook/callback').get(users.oauthCallback('facebook'));

  app.route('/auth/twitter').get(passport.authenticate('twitter'));
  app.route('/auth/twitter/callback').get(users.oauthCallback('twitter'));

  app.route('/auth/google').get(passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }));
  app.route('/auth/google/callback').get(users.oauthCallback('google'));

  app.param('userId', users.userByID);
};
