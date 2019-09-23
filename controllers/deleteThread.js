'use strict';

const Posts = require('../models/posts');
const Threads = require('../models/threads');

async function deleteThread(req, res) {
  const { board } = req.params;
  const { thread_id, delete_password = '', reply_id } = req.body;
  
  try {
    const doc = await Threads.findOne({
      _id: thread_id,
      board,
      delete_password,
    });
    
    if (!doc) {
      return res.status(401).send('incorrect password');
    }
    
    const postIds = doc.replies.map(r => r._id);

    await Threads.deleteOne({
      _id: thread_id,
      board,
      delete_password,
    });

    await Posts.deleteMany({
      _id: { $in: postIds }
    })

    return res.send('success');
  } catch (error) {
    console.warn(error);
    return res.status(500).json({ error });
  }
}

module.exports = deleteThread;
