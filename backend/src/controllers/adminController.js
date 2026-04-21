import User from '../models/User.js';
import Charity from '../models/Charity.js';
import Draw from '../models/Draw.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('selectedCharity');
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, role, subscriptionStatus, planType } = req.body || {};
    
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (role) user.role = role;
    if (subscriptionStatus) user.subscriptionStatus = subscriptionStatus;
    if (planType) user.planType = planType;
    
    if (subscriptionStatus === 'active' && user.subscriptionEndDate <= new Date()) {
       const endDate = new Date();
       if (planType === 'monthly') endDate.setMonth(endDate.getMonth() + 1);
       if (planType === 'yearly') endDate.setFullYear(endDate.getFullYear() + 1);
       user.subscriptionEndDate = endDate;
    }

    await user.save();
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllWinners = async (req, res) => {
  try {
    const draws = await Draw.find({ status: 'published' }).populate({
        path: 'match5.winners.user match4.winners.user match3.winners.user',
        select: 'name email'
    }).sort({ createdAt: -1 });

    const winnersList = [];

    draws.forEach(draw => {
      const processTier = (tierName, tierData) => {
         tierData.winners.forEach(w => {
            winnersList.push({
               drawId: draw._id,
               month: draw.month,
               tier: tierName,
               user: w.user,
               prize: tierData.prizePerWinner,
               proofUrl: w.proofUrl,
               verificationStatus: w.verificationStatus,
               paymentStatus: w.paymentStatus
            });
         });
      };
      
      processTier('match5', draw.match5);
      processTier('match4', draw.match4);
      processTier('match3', draw.match3);
    });

    res.json({ success: true, count: winnersList.length, data: winnersList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeSubscribers = await User.countDocuments({ subscriptionStatus: 'active' });

    const charities = await Charity.find();
    const independentDonations = charities.reduce((acc, curr) => acc + (curr.totalDonationsReceived || 0), 0);

    const platformCharityCut = activeSubscribers * 1.50;

    const draws = await Draw.find({ status: 'published' });
    const totalPrizePoolDistributed = draws.reduce((acc, curr) => acc + curr.totalPool, 0);

    res.json({
      success: true,
      data: {
        totalUsers,
        activeSubscribers,
        financials: {
           totalPrizePoolDistributed,
           totalIndependentDonations: independentDonations,
           estimatedMonthlySubscriptionCharityCut: platformCharityCut
        },
        drawStatistics: {
           totalDrawsPublished: draws.length
        }
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

