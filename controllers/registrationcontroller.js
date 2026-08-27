const registration = require('../models/registration');
const event = require('../models/event');
const apperror = require('../utils/apperror');
const asynchandler = require('../utils/asynchandler');

const registerforevent = asynchandler(async (req, res, next) => {
  const { eventid } = req.body;
  const userid = req.user._id;

  
  const targetevent = await event.findById(eventid);
  if (!targetevent) {
    return next(new apperror('event not found', 404));
  }

  
  const existingreg = await registration.findOne({
    event: eventid,
    user: userid,
    status: 'registered',
  });
  if (existingreg) {
    return next(new apperror('already registered for this event', 400));
  }

  
  const activecount = await registration.countDocuments({
    event: eventid,
    status: 'registered',
  });

  if (activecount >= targetevent.capacity) {
    return next(new apperror('event is full; capacity reached', 400));
  }

  const newreg = await registration.create({
    event: eventid,
    user: userid,
    status: 'registered',
  });

  res.status(201).json({
    status: 'success',
    data: newreg,
  });
});

const getmyregistrations = asynchandler(async (req, res, next) => {
  const myregs = await registration
    .find({ user: req.user._id, status: 'registered' })
    .populate({
      path: 'event',
      populate: { path: 'category' },
    });

  res.status(200).json({
    status: 'success',
    results: myregs.length,
    data: myregs,
  });
});

const cancelregistration = asynchandler(async (req, res, next) => {
  
  const reg = await registration.findById(req.params.id);

  if (!reg) {
    return next(new apperror('registration not found', 404));
  }

  
  if (reg.user.toString() !== req.user._id.toString()) {
    return next(new apperror('forbidden: cannot cancel another user registration', 403));
  }

  reg.status = 'cancelled';
  await reg.save();

  res.status(200).json({
    status: 'success',
    message: 'registration cancelled successfully',
  });
});

module.exports = {
  registerforevent,
  getmyregistrations,
  cancelregistration,
};