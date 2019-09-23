'use strict'

const Threads = require('../models/threads');
const Posts = require('../models/posts');

async function createPost(req, res) {
  const { board } = req.params;
  const { text, delete_password, thread_id } = req.body;
  const date = new Date();
  
  try {
    const thread = await Threads.findOne({
      board,
      _id: thread_id,
    });
    
    if (!thread) {
      return res.status(400).send('invalid thread id');
    }
    
    const post = new Posts({
      text,
      created_on: date,
      delete_password,
    });
    await post.save();
    
    thread.replies.push(post._id);
    thread.bumped_on = date;
    await thread.save();
    
    return res.redirect(`/b/${board}/${thread_id}`);
  } catch (error) {
    return res.status(500).json({ error });
  }
}

module.exports = createPost;
