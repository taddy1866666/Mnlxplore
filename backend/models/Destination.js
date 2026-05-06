const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    type: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    location: {
      latitude: Number,
      longitude: Number
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5
    },
    attractions: [String],
    restaurants: [String],
    estimatedBudget: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Destination', destinationSchema);
