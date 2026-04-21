import mongoose from 'mongoose';

const charitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    upcomingEvents: {
      type: [String],
      default: [],
    },
    totalDonationsReceived: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Charity = mongoose.model('Charity', charitySchema);
export default Charity;
