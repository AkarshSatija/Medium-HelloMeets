'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Comment = mongoose.model('Comment'),
	_ = require('lodash');

/**
 * Create a comment
 */
exports.create = function(req, res) {
	var comment = new Comment(req.body);
	comment.user = req.user;
	comment.parent.Article=req.article

	//res.json(req.article);

	comment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(comment);
		}
	});
};

/**
 * Show the current comment
 */
exports.read = function(req, res) {
	res.json(req.comment);
};

/**
 * Update a comment
 */
exports.update = function(req, res) {
	var comment = req.comment;

	comment = _.extend(comment, req.body);

	comment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(comment);
		}
	});
};

/**
 * Delete an comment
 */
exports.delete = function(req, res) {
	var comment = req.comment;

	comment.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(comment);
		}
	});
};

/**
 * List of Comments
 */
 


exports.list = function(req, res) {

	var filter = {
	    $or: [{
	            status: 'public'
	        }, 
	        {
	            user: req.user
	        }

	    ]
	};


	if (req.user) {
		if(req.article.user.id === req.user.id)
		filter={};
	}


	Comment.find(filter)
	.sort('-created')
	//.where()
	.populate('user', 'displayName')
	.exec(function(err, comments) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(comments);
		}
	});
};

/**
 * Comment middleware
 */
exports.commentByID = function(req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Comment is invalid'
		});
	}

	Comment.findById(id).populate('user', 'displayName').exec(function(err, comment) {
		if (err) return next(err);
		if (!comment) {
			return res.status(404).send({
				message: 'Comment not found'
			});
		}
		req.comment = comment;
		next();
	});
};

/**
 * Comment authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if ((req.comment.user.id !== req.user.id)||(req.article.user.id !== req.user.id)) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};

