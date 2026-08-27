const mongoose = require('mongoose');

const eventschema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity limit is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'category',
      required: [true, 'Category is required'],
    },
    createdby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { timestamps: true }
);

// Enable text search for Task 3 requirement
eventschema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('event', eventschema);