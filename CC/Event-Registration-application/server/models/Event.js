const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    location: {
      type: String,
      required: [true, 'Event location is required'],
      trim: true,
    },
    maxCapacity: {
      type: Number,
      required: [true, 'Max capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    registrationCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Virtual for seats available
eventSchema.virtual('seatsAvailable').get(function () {
  return this.maxCapacity - this.registrationCount;
});

// Virtual for isFull
eventSchema.virtual('isFull').get(function () {
  return this.registrationCount >= this.maxCapacity;
});

eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
