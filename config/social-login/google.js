'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  url = require('url'),
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  config = require('../config'),
  users = require('../../app/controllers/users.controller');

module.exports = function() {
  // Use google strategy
  passport.use(new GoogleStrategy({
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL,
      passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
      // Create the user OAuth profile
      var username = profile.username || ((profile.emails[0].value) ? profile.emails[0].value.split('@')[0] : '');
      var userProfile = {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        username: username,
        provider: 'google',
        picture: profile.photos[0].value,
        providerData: profile._json

      };
      users.saveOAuthUserProfile(req, userProfile, done);
    }
  ));
};
