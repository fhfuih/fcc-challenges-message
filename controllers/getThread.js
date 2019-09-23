'use strict';

const Threads = require('../models/threads');

async function getThread(req, res) {
  const { board } = req.params;
  const { thread_id } = req.query;
  
  try {
    const data = await Threads.findOne({
      board,
      _id: thread_id,
    }).populate('replies');
    
    return res.json(data);
  } catch (error) {
    console.warn(error);
    return res.status(500).json({ error });
  }
}

module.exports = getThread;
