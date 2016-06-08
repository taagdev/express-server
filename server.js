'use strict';

var express = require('express'),
  app = express();

var port = process.env.PORT || 2000;

app.set('view engine', 'html');

// Initialize the ejs template engine
app.engine('html', require('ejs').renderFile);

// Tell express where it can find the templates
app.set('views', __dirname + '/app/views');

// Make the files in the public folder available to the world
app.use(express.static(__dirname + '/public'));

require('./app/routes/routes.server')(app);

app.listen(port);

console.log('chat app running on http://localhost:' + port);
