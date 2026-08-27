const mongoose = require('mongoose');

const registrationschema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'event',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    status: {
      type: String,
      enum: ['registered', 'cancelled'],
      default: 'registered',
    },
  },
  { timestamps: true }
);

// Enforce unique user per event to prevent double registrations
registrationschema.index({ event: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('registration', registrationschema);