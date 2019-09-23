/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

// var expect = require('chai').expect;
const createPost = require('../controllers/createPost');
const createThread = require('../controllers/createThread');
const deletePost = require('../controllers/deletePost');
const deleteThread = require('../controllers/deleteThread');
const getThread = require('../controllers/getThread');
const getBoard = require('../controllers/getBoard');
const reportPost = require('../controllers/reportPost');
const reportThread = require('../controllers/reportThread');

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .get(getBoard)
    .post(createThread)
    .delete(deleteThread)
    .put(reportThread);
    
  app.route('/api/replies/:board')
    .get(getThread)
    .post(createPost)
    .delete(deletePost)
    .put(reportPost);

};
