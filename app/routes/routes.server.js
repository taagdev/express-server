'use strict';

module.exports = function(app){
var index = require('../controllers/index.controller.server');

	app.route('/').get(index.renderIndex);

};
