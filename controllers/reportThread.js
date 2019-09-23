'use strict';

const Threads = require('../models/threads');

async function reportThread(req, res) {
  const { board } = req.params;
  const { thread_id } = req.body;
  
  try {
    await Threads.updateOne({
      board,
      _id: thread_id,
    }, {
      reported: true
    });
    
    res.send('success');
  } catch (error) {
    res.status(500).json({ error });
  }
}

module.exports = reportThread;
