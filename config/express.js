'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
  bodyParser = require('body-parser'),
  compress = require('compression'),
  methodOverride = require('method-override'),
  helmet = require('helmet'),
  utils = require('./jwt-utils'),
  path = require('path'),
  unless = require('express-unless'),
  passport = require('passport'),
  User = require(path.resolve('./app/models/user.model')),
  config = require('./config');

module.exports = function() {
  var app = express();

  app.use(compress());

  app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, UPDATE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
  });

  app.use(utils.middleware().unless({ path: ['/', '/auth/google', '/auth/google/callback', '/auth/facebook', '/auth/facebook/callback', '/api/v1/auth/signin', '/api/v1/auth/register'] }));

  app.set('superSecret', config.secret); 
  app.set('showStackError', true);
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(methodOverride());
  app.enable('jsonp callback');
  app.use(helmet.xframe());
  app.use(helmet.xssFilter());
  app.use(helmet.nosniff());
  app.use(helmet.ienoopen());
  app.use(helmet.hsts({
    maxAge: 15778476000,
    includeSubdomains: true,
    force: true
  }));
  app.disable('x-powered-by');

  require(path.resolve('./app/routes/index.routes'))(app);

  app.use(function(err, req, res, next) {
    if (!err) return next();

    console.error(err.stack);
    res.status(500).json({ message: 'Server error' });
  });
  app.use(function(req, res) {
    return res.status(404).json({ message: 'not found' });
  });

  return app;
};