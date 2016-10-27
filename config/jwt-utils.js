"use strict";

var path = require('path'),
  redis = require("redis"),
  REDIS_URL = process.env.REDISCLOUD_URL || null,
  client = redis.createClient(REDIS_URL),
  _ = require("lodash"),
  config = require("./config"),
  jsonwebtoken = require("jsonwebtoken"),
  TOKEN_EXPIRATION_SEC = 24 * 60 * 60;

client.on('error', function(err) {
  console.log(err);
});

client.on('connect', function() {
  console.log("Redis successfully connected");
});

exports.getTokenFromClientRequest = function(req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  } else {
    return null;
  }
};
exports.create = function(user, req, res) {

  if (_.isEmpty(user)) {
    return next(new Error('User data cannot be empty.'));
  }
  var data = {
    _id: user._id,
    username: user.username,
    email: user.email,
    displayName: user.displayName,
    profileImageURL: user.profileImageURL,
    provider: user.provider,
    created: user.created,
    role: user.roles,
    token: jsonwebtoken.sign({ _id: user._id, username: user.username, email: user.email, displayName: user.displayName, role: user.roles, profileImageURL: user.profileImageURL, provider: user.provider, created: user.created}, config.secret, {
      expiresIn: TOKEN_EXPIRATION_SEC
    })
  };

  var decoded = jsonwebtoken.decode(data.token);

  data.token_exp = decoded.exp;
  data.token_iat = decoded.iat;

  // save in redis
  client.set(data.token, JSON.stringify(data), function(err, response) {
    if (err) {
      return res.json({ message: new Error(err) });
    }

    if (response) {
      client.expire(data.token, TOKEN_EXPIRATION_SEC, function(err, response1) {
        if (err) {
          return res.json({ message: new Error("Can not set the expire value for the token key") });
        }
        if (response1) {
          req.user = data;
          res.json(data);
        } else {
          return res.json({ message: new Error('Expiration not set on redis') });
        }
      });
    } else {
      return res.json({ message: new Error('Token not set in redis') });
    }
  });

};

exports.retrieve = function(id, done) {

  if (_.isNull(id)) {
    return done(new Error("token_invalid"), {
      "message": "Invalid token"
    });
  }

  client.get(id, function(err, response) {
    if (err) {
      return done(err, {
        "message": err
      });
    }

    if (_.isNull(response)) {
      return done(new Error("token_invalid"), {
        "message": "Token doesn't exists, are you sure it hasn't expired or been revoked?"
      });
    } else {
      var data = JSON.parse(response);

      if (_.isEqual(data.token, id)) {
        return done(null, data);
      } else {
        return done(new Error("token_doesnt_exist"), {
          "message": "Token doesn't exists, login into the system so it can generate new token."
        });
      }

    }

  });

};

exports.verify = function(token, done) {
    var _this = this;
  jsonwebtoken.verify(token, config.secret, function(err, decode) {

    if (err) {
      return done(new Error("invalid_token"));
    }

    _this.retrieve(token, function(err, data) {

      if (err) {
        return done({ 'message': Error("invalid_token in database", data) });
      }
      done(null, data);

    });

  });
};

exports.expire = function(req, done) {
  var _this = this;
  var token = _this.getTokenFromClientRequest(req);
  if (token !== null) {
    done(client.expire(token, 0));
  }

};

exports.middleware = function() {
  var _this = this;
  var func = function(req, res, next) {

    var token = _this.getTokenFromClientRequest(req);

    if (token == (null || undefined)) return res.status(401).json({ message: 'unauthorised user' });
    _this.verify(token, function(err, data) {
      if (err) {
        req.user = undefined;
        return res.status(401).json({ message: 'invalid_token' });
      } else {
        req.user = _.merge(req.user, data);
        next();
      }

    });
  };

  func.unless = require("express-unless");

  return func;

};
