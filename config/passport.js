'use strict';

var passport = require('passport'),
facebook = require('./social-login/facebook'),
	google = require('./social-login/google');

module.exports = function(){
    facebook(passport);
    google(passport);
};