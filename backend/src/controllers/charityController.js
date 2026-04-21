import Charity from '../models/Charity.js';
import User from '../models/User.js';

export const getCharities = async (req, res) => {
  try {
    const { keyword, featured } = req.query;

    let query = {};
    if (keyword) {
      query.name = { $regex: keyword, $options: 'i' };
    }
    if (featured === 'true') {
      query.featured = true;
    }

    const charities = await Charity.find(query);
    res.json({ success: true, data: charities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCharity = async (req, res) => {
  try {
    const { name, description, images, featured, upcomingEvents } = req.body || {};
    
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    const newCharity = await Charity.create({
      name,
      description,
      images: images || [],
      featured: featured || false,
      upcomingEvents: upcomingEvents || [],
      totalDonationsReceived: 0
    });

    res.status(201).json({ success: true, message: 'Charity created successfully', data: newCharity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCharityById = async (req, res) => {
  try {
    const charity = await Charity.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!charity) return res.status(404).json({ message: 'Charity not found' });
    res.json({ success: true, message: 'Charity updated successfully', data: charity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCharity = async (req, res) => {
  try {
    const charity = await Charity.findByIdAndDelete(req.params.id);
    if (!charity) return res.status(404).json({ message: 'Charity not found' });
    res.json({ success: true, message: 'Charity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCharityById = async (req, res) => {
  try {
    const charity = await Charity.findById(req.params.id);
    if (!charity) return res.status(404).json({ message: 'Charity not found' });
    
    res.json({ success: true, data: charity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCharityConfig = async (req, res) => {
  try {
    const { charityId, percentage } = req.body || {};

    if (percentage && percentage < 10) {
      return res.status(400).json({ message: 'Minimum charity contribution is 10%' });
    }

    const user = await User.findById(req.user._id);
    
    if (charityId) {
      const exists = await Charity.findById(charityId);
      if (!exists) return res.status(404).json({ message: 'Charity not found' });
      user.selectedCharity = charityId;
    }

    if (percentage) user.charityPercentage = percentage;

    await user.save();
    
    res.json({
      success: true,
      message: 'Charity configuration updated',
      data: {
        selectedCharity: user.selectedCharity,
        charityPercentage: user.charityPercentage
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const makeIndependentDonation = async (req, res) => {
  try {
    const { charityId, amount } = req.body || {};
    
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Valid amount required' });

    const charity = await Charity.findById(charityId);
    if (!charity) return res.status(404).json({ message: 'Charity not found' });

    charity.totalDonationsReceived += amount;
    await charity.save();

    res.json({
      success: true,
      message: `Successfully donated $${amount} independently to ${charity.name}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

