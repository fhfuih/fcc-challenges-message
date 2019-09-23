'use strict';

const Posts = require('../models/posts');
const Threads = require('../models/threads');

async function reportPost(req, res) {
  const { board } = req.params;
  const { thread_id, reply_id } = req.body;
  
  try {
    const doc = await Threads.findOne({
      _id: thread_id,
      board,
    });
    
    if (!doc) {
      return res.status(400).send('invalid thread_id');
    }
    
    await Posts.updateOne({
      _id: reply_id,
    }, {
      reported: true
    });
    
    res.send('success');
  } catch (error) {
    res.status(500).json({ error });
  }
}

module.exports = reportPost;
