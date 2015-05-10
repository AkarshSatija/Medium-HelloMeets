'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Comment Schema
 */
var CommentSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    parent: {
        Article: {
            type: Schema.ObjectId,
            ref: 'Article'
        },
        header: {
            type: String,
            default: '',
            trim: true
        }
    },
    content: {
        type: String,
        default: '',
        trim: true
    },
    status: {
        type: String,
        enum: [
        'public',
        'private', // only to me and author
        'protected'
        ],
        default:'private'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Comment', CommentSchema);
