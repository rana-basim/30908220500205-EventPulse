const message = require('../models/message');
const asynchandler = require('../utils/asynchandler');

const geteventmessages = asynchandler(async (req, res, next) => {
  const { eventid } = req.params;

  const messages = await message
    .find({ event: eventid })
    .populate('sender', 'name email role')
    .sort({ createdat: 1 });

  res.status(200).json({
    status: 'success',
    results: messages.length,
    data: messages,
  });
});

module.exports = { geteventmessages };