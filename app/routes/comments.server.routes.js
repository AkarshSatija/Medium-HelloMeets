'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	articles = require('../../app/controllers/articles.server.controller'),
	comments = require('../../app/controllers/comments.server.controller');

module.exports = function(app) {
	
	app.route('/articles/:articleId/comments')
		.get(comments.list)
		.post(users.requiresLogin, articles.hasAuthorization, comments.create)
		//.delete(users.requiresLogin, articles.hasAuthorization, articles.delete);
		;

	// Finish by binding the article middleware
	app.param('articleId', articles.articleByID);
};
