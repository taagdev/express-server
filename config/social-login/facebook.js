'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  url = require('url'),
  FacebookStrategy = require('passport-facebook').Strategy,
  config = require('../config'),
  users = require('../../app/controllers/users.controller');

module.exports = function() {
  // Use facebook strategy
  passport.use(new FacebookStrategy({
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      callbackURL: config.facebook.callbackURL,
      profileFields: ['id', 'displayName', 'photos', 'email', 'first_name', 'last_name'],
    },
    function(req, accessToken, refreshToken, profile, done) {
      	var username = profile.username || ((profile.emails[0].value) ? profile.emails[0].value.split('@')[0] : '');          
        var userProfile = {
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          username: username,
          provider: profile.provider,
          picture: profile.photos[0].value,
          providerData: profile._json

        };
        return users.saveOAuthUserProfile(req, userProfile, done);
    }
  ));
};
