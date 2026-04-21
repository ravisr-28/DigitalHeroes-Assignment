import mongoose from 'mongoose';

const tierSchema = new mongoose.Schema({
  tierPool: { type: Number, default: 0 },
  winners: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    proofUrl: { type: String, default: null },
    verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' }
  }],
  prizePerWinner: { type: Number, default: 0 },
  rolloverOut: { type: Number, default: 0 }
}, { _id: false });

const drawSchema = new mongoose.Schema(
  {
    month: { 
      type: String, 
      required: true,
    },
    status: {
      type: String,
      enum: ['simulation', 'published'],
      default: 'simulation'
    },
    drawType: {
      type: String,
      enum: ['random', 'algorithmic'],
      required: true,
    },
    winningNumbers: {
      type: [Number],
      required: true,
      validate: [
        arr => arr.length === 5,
        'Winning numbers exactly requires 5 digits'
      ]
    },
    basePool: { type: Number, default: 0 },
    rolloverIn: { type: Number, default: 0 },
    totalPool: { type: Number, default: 0 },
    
    match5: { type: tierSchema, default: () => ({}) },
    match4: { type: tierSchema, default: () => ({}) },
    match3: { type: tierSchema, default: () => ({}) },
  },
  { timestamps: true }
);

const Draw = mongoose.model('Draw', drawSchema);
export default Draw;

