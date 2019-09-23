'use strict';

const Threads = require('../models/threads');

async function createThread(req, res) {
  const { board } = req.params;
  const { text, delete_password } = req.body;
  const date = Date.now();
  
  try {    
    const doc = new Threads({
      board,
      text,
      created_on: date,
      bumped_on: date,
      delete_password,
      replies: [],
    });
    
    await doc.save();
    
    return res.redirect(`/b/${board}`);
  } catch (error) {
    return res.status(500).json({ error });
  }
}

module.exports = createThread;
