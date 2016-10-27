'use strict'

var User = require('../models/user.model'),
  mongoose = require('mongoose'),
  superSecret = require('../../config/config').secret,
  utils = require('../../config/jwt-utils'),
  errorHandler = require('./errors.controller'),
  config = require('../../config/config');

exports.signOut = function(req, res) {
  utils.expire(req, function() {
    res.status(200).json({ message: 'successfully logged out' });
  });
};

exports.index = function(req, res) {
  res.status(200).json({ message: 'Welcome to sunCrowd server' });
};


exports.signIn = function(req, res) {
  console.log('we are here signin:', req.body);
  User.findOne({
    email: req.body.email
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.status(401).json({ message: 'Authentication failed. User not found.' });
    } else if (user) {
      if (!user.authenticate(req.body.password)) {
        res.status(401).json({ message: 'Authentication failed. Wrong password.' });
      } else {
        utils.create(user, req, res);
      }

    }

  });
};

exports.signup = function(req, res) {
  delete req.body.roles;
  var email = req.body.email;
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.displayName = newUser.firstName + ' ' + newUser.lastName;

  // Then save the user
  newUser.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      newUser.password = undefined;
      newUser.salt = undefined;

      // login the user;
      utils.create(newUser, req, res);
    }
  });
};

