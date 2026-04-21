import User from '../models/User.js';
import Draw from '../models/Draw.js';

const getWinningsOverview = async (userId) => {
  const publishedDraws = await Draw.find({ status: 'published' });
  
  let totalWon = 0;
  let paidOut = 0;
  let pendingPayouts = 0;
  const detailedWinnings = [];

  for (const draw of publishedDraws) {
    let matchObj = null;
    let tier = null;
    
    let record = draw.match5.winners.find(w => w.user.toString() === userId.toString());
    if (record) { matchObj = record; tier = '5-Match'; totalWon += draw.match5.prizePerWinner; }
    
    if (!record) {
      record = draw.match4.winners.find(w => w.user.toString() === userId.toString());
      if (record) { matchObj = record; tier = '4-Match'; totalWon += draw.match4.prizePerWinner; }
    }

    if (!record) {
      record = draw.match3.winners.find(w => w.user.toString() === userId.toString());
      if (record) { matchObj = record; tier = '3-Match'; totalWon += draw.match3.prizePerWinner; }
    }

    if (matchObj) {
      const prize = draw[tier === '5-Match' ? 'match5' : tier === '4-Match' ? 'match4' : 'match3'].prizePerWinner;
      if (matchObj.paymentStatus === 'paid') paidOut += prize;
      else pendingPayouts += prize;

      detailedWinnings.push({
        drawMonth: draw.month,
        tier,
        prize,
        verificationStatus: matchObj.verificationStatus,
        paymentStatus: matchObj.paymentStatus
      });
    }
  }

  return { totalWon, paidOut, pendingPayouts, detailedWinnings };
};

export const getUserDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('selectedCharity');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const winningsOverview = await getWinningsOverview(user._id);
    const totalDraws = await Draw.countDocuments({ status: 'published' });

    res.json({
      success: true,
      data: {
        profile: {
          name: user.name,
          email: user.email,
          role: user.role
        },
        subscription: {
          status: user.subscriptionStatus,
          plan: user.planType,
          renewalDate: user.subscriptionEndDate
        },
        scores: {
          count: user.scores.length,
          history: user.scores.sort((a,b) => b.date - a.date)
        },
        charityConfig: {
          percentage: user.charityPercentage,
          selectedCharity: user.selectedCharity ? user.selectedCharity.name : 'None Selected'
        },
        participationSummary: {
          drawsEntered: totalDraws,
        },
        winningsOverview
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

