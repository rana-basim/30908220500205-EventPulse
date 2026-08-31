const event = require('../models/event');
const apperror = require('../utils/apperror');
const asynchandler = require('../utils/asynchandler');

const createevent = asynchandler(async (req, res, next) => {
  const newevent = await event.create({
    ...req.body,
    createdby: req.user._id,
  });

  res.status(201).json({
    status: 'success',
    data: newevent,
  });
});

const getevents = asynchandler(async (req, res, next) => {
  const { category, city, startdate, enddate, search, page = 1, limit = 10, sort } = req.query;
  const query = {};

  if (category) query.category = category;
  if (city) query.city = new RegExp(city, 'i');
  if (startdate || enddate) {
    query.date = {};
    if (startdate) query.date.$gte = new Date(startdate);
    if (enddate) query.date.$lte = new Date(enddate);
  }

  if (search) {
    query.$text = { $search: search };
  }

  let sortoption = { date: 1 };
  if (sort === 'date_desc') sortoption = { date: -1 };

  const pagenumber = parseInt(page, 10);
  const limitnumber = parseInt(limit, 10);
  const skip = (pagenumber - 1) * limitnumber;

  const total = await event.countDocuments(query);
  const events = await event
    .find(query)
    .populate('category')
    .populate('createdby', 'name email role')
    .sort(sortoption)
    .skip(skip)
    .limit(limitnumber);

  res.status(200).json({
    status: 'success',
    total,
    currentpage: pagenumber,
    pages: Math.ceil(total / limitnumber),
    data: events,
  });
});

const geteventbyid = asynchandler(async (req, res, next) => {
  const foundevent = await event.findById(req.params.id).populate('category');
  if (!foundevent) {
    return next(new apperror('event not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: foundevent,
  });
});

const updateevent = asynchandler(async (req, res, next) => {
  const updatedevent = await event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('category');

  if (!updatedevent) {
    return next(new apperror('event not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: updatedevent,
  });
});

const deleteevent = asynchandler(async (req, res, next) => {
  const deletedevent = await event.findByIdAndDelete(req.params.id);
  if (!deletedevent) {
    return next(new apperror('event not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'event deleted successfully',
  });
});

module.exports = {
  createevent,
  getevents,
  geteventbyid,
  updateevent,
  deleteevent,
};