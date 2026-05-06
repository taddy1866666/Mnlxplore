const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    destination: {
      type: String,
      required: true
    },
    budget: {
      type: Number,
      required: true
    },
    days: {
      type: Number,
      required: true
    },
    preferences: {
      type: [String],
      default: []
    },
    itinerary: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['draft', 'completed', 'archived'],
      default: 'draft'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trip', tripSchema);
