const message = require('../models/message');
const asynchandler = require('../utils/asynchandler');
const apperror = require('../utils/apperror');

// GET /api/events/:eventid/messages - Get all messages for an event
const geteventmessages = asynchandler(async (req, res, next) => {
  const { eventid } = req.params;

  const messages = await message
    .find({ event: eventid })
    .populate('sender', 'name email role')
    .sort({ createdAt: 1 });

  res.status(200).json({
    status: 'success',
    results: messages.length,
    data: messages,
  });
});

// POST /api/events/:eventid/messages - Post a new message (Admin Only)
const createmessage = asynchandler(async (req, res, next) => {
  // Direct admin protection check
  if (req.user.role !== 'admin') {
    return next(new apperror('Only admins are authorized to post messages.', 403));
  }

  const { eventid } = req.params;
  const { content } = req.body;

  if (!content) {
    return next(new apperror('Message content is required.', 400));
  }

  const newmessage = await message.create({
    content,
    event: eventid,
    sender: req.user._id,
  });
const populatedmessage = await newmessage.populate('sender', 'name email role');


  const io = req.app.get('io');
  if (io) {
    io.to(eventid).emit('announcement', populatedmessage);
  }

  res.status(201).json({
    status: 'success',
    data: populatedmessage,
  })});

module.exports = {
  geteventmessages,
  createmessage,
};