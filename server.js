'use strict'

var mongoose = require('mongoose'),
  config = require('./config/config'),
  express = require('express'),
  path = require('path'),
  port = config.port;

mongoose.Promise = global.Promise;
mongoose.connect(config.database);

var app = require('./config/express')();

app.listen(port);
console.log('server starting on Port: ' + port);