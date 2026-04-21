import User from '../models/User.js';

export const getSubscriptionStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        subscriptionStatus: user.subscriptionStatus,
        planType: user.planType,
        subscriptionEndDate: user.subscriptionEndDate,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCheckoutSession = async (req, res) => {
  try {
    const { planType } = req.body || {};

    if (!['monthly', 'yearly'].includes(planType)) {
      return res.status(400).json({ message: 'Invalid plan type' });
    }

    const sessionId = `sim_${Math.random().toString(36).substr(2, 9)}`;
    const checkoutUrl = `/checkout?session_id=${sessionId}&plan=${planType}`;

    res.json({
      success: true,
      sessionId,
      url: checkoutUrl
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { sessionId, planType } = req.body || {};

    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const endDate = new Date();
    if (planType === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    user.subscriptionStatus = 'active';
    user.planType = planType || 'monthly';
    user.subscriptionEndDate = endDate;
    user.stripeCustomerId = `cus_${Math.random().toString(36).substr(2, 9)}`;

    await user.save();

    res.json({
      success: true,
      message: 'Payment verified and subscription activated!',
      data: {
        subscriptionStatus: user.subscriptionStatus,
        planType: user.planType,
        subscriptionEndDate: user.subscriptionEndDate,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.subscriptionStatus = 'canceled';
    user.planType = 'none';
    user.subscriptionEndDate = null; 

    await user.save();

    res.json({
      success: true,
      message: 'Subscription canceled successfully',
      data: {
        subscriptionStatus: user.subscriptionStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
