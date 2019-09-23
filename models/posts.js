'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  text: {
    type: String,
    default: '',
  },
  created_on: {
    type: Date,
    required: true,
  },
  // make password optional
  delete_password: {
    type: String,
    select: false,
    default: '',
  },
  reported: {
    type: Boolean,
    select: false,
    default: false,
  },
}, {
  collection: 'threadPosts'
});

const posts = mongoose.model('Posts', postSchema);

module.exports = posts;
