'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const threadSchema = new Schema({
  board: {
    type: String,
    index: true,
    select: false,
  },
  text: {
    type: String,
    default: '',
  },
  // make password optional
  delete_password: {
    type: String,
    select: false,
    default: '',
  },
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'Posts',
  }],
  created_on: {
    type: Date,
    required: true,
  },
  bumped_on: {
    type: Date,
    required: true,
  },
  reported: {
    type: Boolean,
    select: false,
    default: false,
  },
}, {
  collection: 'threads'
});

const threads = mongoose.model('Threads', threadSchema);

module.exports = threads;
