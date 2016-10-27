'use strict'

/**
  Config
*/

module.exports = {

  'secret': process.env.secret || 'generalgmt',
  'database': process.env.MONGOHQ_URL || process.env.MONGODB_URI || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/artisansforwork',
  // 'database': 'mongodb://localhost/artisansforwork',
  'port': process.env.PORT || 3000,
  google: {
    clientID: process.env.GOOGLE_ID || '359357606205-30h0shut1869pbnvn399ikfh4l0ul6v1.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || 'mh4ZF47e79QPyYI8OkDKIwsQ',
    callbackURL: '/auth/google/callback'
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || '113967815743279',
    clientSecret: process.env.FACEBOOK_SECRET || '27ec2a48702b3e3a55c49ea92257395c',
    callbackURL: '/auth/facebook/callback'
  },
  twitter: {
    clientID: process.env.TWITTER_KEY || 'K487hKpY2YwvduS9PsTN3RbOt',
    clientSecret: process.env.TWITTER_SECRET || 'FH4Uta8TxdBskqdquKGtrBAuMYB7gqLOdhCxHQMCQwZUtxf1vC',
    callbackURL: '/auth/twitter/callback'
  },
  mailer: {
    from: process.env.MAILER_FROM || 'notifier07@gmail.com',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'GMAIL',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'notifier07@gmail.com',
        pass: process.env.MAILER_PASSWORD || 'notifier007'
      }
    }
  },
  'models': './app/models/*.js',
  'routes': './app/routes/*.js',
  'controllers': './app/controllers/**/*.js'

};
