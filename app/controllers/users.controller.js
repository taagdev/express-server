'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  passport = require('passport'),
  utils = require('../../config/jwt-utils'),
  errorHandler = require('./errors.controller');


/**
 * Show current User
 */
exports.me = function(req, res) {
  res.json(req.profile);
};


/**
 * Update user details
 */
exports.update = function(req, res) {
  // Init Variables
  var user = req.profile;

  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  if (user) {
    // Merge existing user
    user = _.extend(user, req.body);
    user.updated = Date.now();
    user.displayName = user.firstName + ' ' + user.lastName;

    user.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.status(200).send({
          message: 'User updated'
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * List of Users
 */
exports.list = function(req, res) {
  User.find().sort('-created').exec(function(err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(users);
    }
  });
};

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findOne({
    _id: id
  }).exec(function(err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load User ' + id));
    }

    req.profile = user;
    next();
  });
};

exports.saveOAuthUserProfile = function(err, profile, done) {
  User.findOne({ email: profile.email }, function(err, user) {
    if (err) {
      return done(err);
    } else {
      if (!user) {
        user = new User({
          firstName: profile.firstName,
          lastName: profile.lastName,
          username: profile.username,
          displayName: profile.displayName,
          email: profile.email,
          provider: profile.provider,
          profileImageURL: profile.picture,
          providerData: profile.providerData
        });
        user.save(function(err) {
        return done(err, user);
        });
      } else {
        return done(err, user);
      }
    }
  });
};

exports.oauthCallback = function(strategy) {
  return function(req, res, next) {
    passport.authenticate(strategy, { session: false}, function(err, user, redirectURL) {
      if (err) {
        return res.json({ message: err });
      } else if (!user) {
        return res.json({ message: 'user not found' });
      } else {
        return utils.create(user, req, res);
      }

    })(req, res, next);
  };
};
