import Draw from '../models/Draw.js';
import User from '../models/User.js';
import { sendEmail, EmailTemplates } from '../utils/email.js';

const CONTRIBUTION_PER_USER_TO_POOL = 5;

const generateWinningNumbers = async (drawType) => {
  if (drawType === 'algorithmic') {
    const users = await User.find({ 'scores.0': { $exists: true } });
    const frequency = {};
    for (const u of users) {
      for (const s of u.scores) {
        frequency[s.value] = (frequency[s.value] || 0) + 1;
      }
    }
    
    const sortedFreq = Object.entries(frequency).sort((a, b) => b[1] - a[1]);
    
    const top5 = sortedFreq.slice(0, 5).map(arr => Number(arr[0]));
    
    while (top5.length < 5) {
      const random = Math.floor(Math.random() * 45) + 1;
      if (!top5.includes(random)) top5.push(random);
    }
    return top5;
  } else {
    const numbers = new Set();
    while (numbers.size < 5) {
      numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(numbers);
  }
};

export const simulateDraw = async (req, res) => {
  try {
    const { month, drawType } = req.body;
    if (!month || !drawType) return res.status(400).json({ message: 'month and drawType required' });

    const activeUsers = await User.find({ subscriptionStatus: 'active' });
    const userCount = activeUsers.length;
    
    const basePool = userCount * CONTRIBUTION_PER_USER_TO_POOL;
    
    const lastDraw = await Draw.findOne({ status: 'published' }).sort({ createdAt: -1 });
    const rolloverIn = lastDraw ? lastDraw.match5.rolloverOut : 0;
    const totalPool = basePool + rolloverIn;

    const winningNumbers = await generateWinningNumbers(drawType);

    let match5Winners = [];
    let match4Winners = [];
    let match3Winners = [];

    activeUsers.forEach(user => {
      if (user.scores.length === 5) {
        const userValues = user.scores.map(s => s.value);
        let matchCount = 0;
        winningNumbers.forEach(num => {
          if (userValues.includes(num)) matchCount++;
        });

        if (matchCount === 5) match5Winners.push(user._id);
        else if (matchCount === 4) match4Winners.push(user._id);
        else if (matchCount === 3) match3Winners.push(user._id);
      }
    });

    const alloc5 = totalPool * 0.40;
    const alloc4 = totalPool * 0.35;
    const alloc3 = totalPool * 0.25;

    const match5 = {
      tierPool: alloc5,
      winners: match5Winners.map(id => ({ user: id })),
      prizePerWinner: match5Winners.length > 0 ? (alloc5 / match5Winners.length) : 0,
      rolloverOut: match5Winners.length === 0 ? alloc5 : 0
    };

    const match4 = {
      tierPool: alloc4,
      winners: match4Winners.map(id => ({ user: id })),
      prizePerWinner: match4Winners.length > 0 ? (alloc4 / match4Winners.length) : 0,
    };

    const match3 = {
      tierPool: alloc3,
      winners: match3Winners.map(id => ({ user: id })),
      prizePerWinner: match3Winners.length > 0 ? (alloc3 / match3Winners.length) : 0,
    };

    let draw = await Draw.findOne({ month, status: 'simulation' });
    if (draw) {
      draw.drawType = drawType;
      draw.winningNumbers = winningNumbers;
      draw.basePool = basePool;
      draw.rolloverIn = rolloverIn;
      draw.totalPool = totalPool;
      draw.match5 = match5;
      draw.match4 = match4;
      draw.match3 = match3;
      await draw.save();
    } else {
      draw = await Draw.create({
        month, status: 'simulation', drawType, winningNumbers,
        basePool, rolloverIn, totalPool, match5, match4, match3
      });
    }

    res.status(201).json({ success: true, data: draw });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const publishDraw = async (req, res) => {
  try {
    const draw = await Draw.findById(req.params.id);
    if (!draw) return res.status(404).json({ message: 'Draw not found' });
    
    if (draw.status === 'published') {
      return res.status(400).json({ message: 'This draw is already published' });
    }

    const existingPublished = await Draw.findOne({ month: draw.month, status: 'published' });
    if (existingPublished) {
      return res.status(400).json({ message: `A published draw for ${draw.month} already exists.` });
    }

    draw.status = 'published';
    await draw.save();

    try {
      const activeUsers = await User.find({ subscriptionStatus: 'active' });
      activeUsers.forEach(user => {
         sendEmail({
            to: user.email,
            ...EmailTemplates.publishDrawDetails(draw.month, draw.match5.prizePerWinner)
         }).catch(console.error);
      });
    } catch(err) {
      console.log('Broadcast failure', err);
    }

    res.status(200).json({ success: true, message: 'Draw officially published', data: draw });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDraws = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { status: 'published' };
    const draws = await Draw.find(query).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: draws });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

