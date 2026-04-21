import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    stripeCustomerId: {
      type: String,
      default: null,
    },
    subscriptionStatus: {
      type: String,
      enum: ['inactive', 'active', 'past_due', 'canceled'],
      default: 'inactive',
    },
    subscriptionId: {
      type: String,
      default: null,
    },
    planType: {
      type: String,
      enum: ['monthly', 'yearly', 'none'],
      default: 'none',
    },
    subscriptionEndDate: {
      type: Date,
      default: null,
    },
    scores: {
      type: [
        {
          value: {
            type: Number,
            required: true,
            min: [1, 'Score must be at least 1'],
            max: [45, 'Score cannot exceed 45'],
          },
          date: {
            type: Date,
            default: Date.now,
          },
        }
      ],
      default: [],
    },
    selectedCharity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Charity',
      default: null
    },
    charityPercentage: {
      type: Number,
      default: 10,
      min: [10, 'Minimum charity contribution is 10%']
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;

