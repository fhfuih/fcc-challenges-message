'use strict';

const Threads = require('../models/threads');

async function getBoard(req, res) {
  const { board } = req.params;
  
  try {
    const data = await Threads.find({
      board
    }, {
      replies: { $slice: -3 },
    }, {
      sort: { $natural: -1 },
      limit: 10,
    }).populate('replies');

    return res.send(data);
  } catch (error) {
    res.status(500).json({ error });
  }
}

module.exports = getBoard;
