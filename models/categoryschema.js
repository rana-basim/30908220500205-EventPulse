const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    categoryname: {
      type: String,
      minlength: [3],
      maxlength: [50]
    },
    description: {
      type: String,
      required: [true, 'A category description is needed.'],
      trim: true,
      maxlength: [500, 'The descriptions cant exceed 500 characters.']
    },

  },
  {
    // Automatically creates 'createdAt' and 'updatedAt' fields
    timestamps: true 
  }
);

// Export the model
module.exports = mongoose.model('Category', categorySchema);