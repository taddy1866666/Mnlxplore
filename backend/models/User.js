const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 255
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    trips: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip'
      }
    ],
    preferences: {
      type: [String],
      default: ['Food', 'Adventure', 'Shopping'],
      validate: [arrayLimit, 'Preferences cannot exceed 10 items']
    }
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length <= 10;
}

module.exports = mongoose.model('User', userSchema);
