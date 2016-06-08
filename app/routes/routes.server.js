'use strict';

module.exports = function(app){
var chat = require('../controllers/index.controller.server');

	app.route('/').get(chat.renderIndex);

};
