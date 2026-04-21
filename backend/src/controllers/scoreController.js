import User from "../models/User.js";

export const addScore = async (req, res) => {
  try {
    const body = req.body || {};
    let numericScore = Number(body.value || body.score);

    if (!numericScore || isNaN(numericScore) || numericScore < 1 || numericScore > 45) {
      return res.status(400).json({ message: "Score must be a number between 1 and 45" });
    }

    const inputDate = body.date ? new Date(body.date) : new Date();
    const dateString = inputDate.toISOString().split('T')[0];

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.subscriptionStatus !== 'active') {
      return res.status(403).json({ 
        message: "Active subscription required to enter draws. Please upgrade your plan." 
      });
    }

    const exists = user.scores.some(s => s.date.toISOString().split('T')[0] === dateString);
    if (exists) {
      return res.status(400).json({ 
        message: 'Duplicate scores for the same date are not allowed. Please edit the existing entry.' 
      });
    }

    const newScore = {
      value: numericScore,
      date: new Date(dateString),
    };

    user.scores.push(newScore);
    user.scores.sort((a, b) => b.date - a.date);
    if (user.scores.length > 5) {
      user.scores = user.scores.slice(0, 5);
    }

    await user.save();

    res.status(201).json({
      success: true,
      data: user.scores,
      message: "Score added successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editScore = async (req, res) => {
  try {
    const { date } = req.params;
    const body = req.body || {};
    let numericScore = Number(body.value || body.score);

    if (!numericScore || isNaN(numericScore) || numericScore < 1 || numericScore > 45) {
      return res.status(400).json({ message: "Score must be a valid number between 1 and 45" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.subscriptionStatus !== 'active') {
      return res.status(403).json({ message: "Active subscription required to edit scores." });
    }

    const scoreIndex = user.scores.findIndex(s => s.date.toISOString().split('T')[0] === date);
    if (scoreIndex === -1) {
      return res.status(404).json({ message: "No score entry found for this date" });
    }

    user.scores[scoreIndex].value = numericScore;
    user.scores.sort((a, b) => b.date - a.date);
    await user.save();

    res.json({ success: true, message: 'Score updated', data: user.scores });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteScore = async (req, res) => {
  try {
    const { date } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.subscriptionStatus !== 'active') {
      return res.status(403).json({ message: "Active subscription required to delete scores." });
    }

    const initialLength = user.scores.length;
    user.scores = user.scores.filter(s => s.date.toISOString().split('T')[0] !== date);

    if (user.scores.length === initialLength) {
      return res.status(404).json({ message: "No score entry found for this date to delete" });
    }

    await user.save();
    res.json({ success: true, message: 'Score deleted', data: user.scores });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getScores = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const sortedScores = user.scores.sort((a, b) => b.date - a.date);

    res.status(200).json({
      success: true,
      count: sortedScores.length,
      data: sortedScores,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
