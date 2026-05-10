import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    stopId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Stop',
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Sightseeing', 'Food', 'Adventure', 'Relaxation', 'General'],
      default: 'General',
    },
    cost: {
      type: Number,
      default: 0.0,
    },
    duration: {
      type: Number, // in minutes
      default: 60,
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
