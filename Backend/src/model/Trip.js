import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    coverPhoto: {
      type: String,
      default: '',
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    budget: {
      totalBudget: { type: Number, default: 0 },
      expenses: [
        {
          category: { type: String, enum: ['Transport', 'Stay', 'Activities', 'Meals', 'Other'], default: 'Other' },
          amount: { type: Number, required: true },
          description: { type: String },
          date: { type: Date, default: Date.now }
        }
      ]
    },
    packingList: [
      {
        item: { type: String, required: true },
        isPacked: { type: Boolean, default: false },
        category: { type: String, default: 'General' }
      }
    ],
    notes: [
      {
        title: { type: String },
        content: { type: String, required: true },
        date: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;
