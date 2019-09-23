'use strict';

const Posts = require('../models/posts');
const Threads = require('../models/threads');

async function deletePost(req, res) {
  const { board } = req.params;
  const { thread_id, delete_password = '', reply_id } = req.body;
  
  try {
    const doc = await Threads.findOne({
      _id: thread_id,
      board,
    });
    
    if (!doc) {
      return res.status(400).send('invalid thread id');
    }
    
    const post = await Posts.findOne({
      _id: reply_id,
      delete_password
    });
    
    if (!post) {
      return res.status(401).send('incorrect password');
    }
    
    if (!doc.replies.includes(post._id)) {
      return res.status(400).send('invalid reply id');
    }
    
    post.text = '[deleted]';
    await post.save();
    return res.send('success');
    
    return res.status(400).send('invalid reply id');
  } catch (error) {
    return res.status(500).json({ error });
  }
}

module.exports = deletePost;
