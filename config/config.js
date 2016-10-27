'use strict'

/**
  Config
*/

module.exports = {

  'secret': process.env.secret || 'generalgmt',
  'database': process.env.MONGOHQ_URL || process.env.MONGODB_URI || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/db',
  // 'database': 'mongodb://localhost/artisansforwork',
  'port': process.env.PORT || 3000,
  google: {
    clientID: process.env.GOOGLE_ID || '',
    clientSecret: process.env.GOOGLE_SECRET || '',
    callbackURL: '/auth/google/callback'
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || '',
    clientSecret: process.env.FACEBOOK_SECRET || '',
    callbackURL: '/auth/facebook/callback'
  },
  twitter: {
    clientID: process.env.TWITTER_KEY || '',
    clientSecret: process.env.TWITTER_SECRET || '',
    callbackURL: '/auth/twitter/callback'
  },
  mailer: {
    from: process.env.MAILER_FROM || '',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || '',
      auth: {
        user: process.env.MAILER_EMAIL_ID || '',
        pass: process.env.MAILER_PASSWORD || '',
      }
    }
  }

};
