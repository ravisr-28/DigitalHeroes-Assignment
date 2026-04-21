import Draw from '../models/Draw.js';
import User from '../models/User.js';
import { sendEmail, EmailTemplates } from '../utils/email.js';

const findWinnerRecord = (draw, userId) => {
  let record = draw.match5.winners.find(w => w.user.toString() === userId.toString());
  if (record) return { record, tier: 'match5' };
  
  record = draw.match4.winners.find(w => w.user.toString() === userId.toString());
  if (record) return { record, tier: 'match4' };
  
  record = draw.match3.winners.find(w => w.user.toString() === userId.toString());
  if (record) return { record, tier: 'match3' };

  return null;
};

export const uploadProof = async (req, res) => {
  try {
    const { drawId } = req.params;
    const { proofUrl } = req.body || {};

    if (!proofUrl) return res.status(400).json({ message: 'proofUrl is required' });

    const draw = await Draw.findById(drawId);
    if (!draw) return res.status(404).json({ message: 'Draw not found' });

    const winnerResult = findWinnerRecord(draw, req.user._id);
    if (!winnerResult) {
      return res.status(403).json({ message: 'You are not a winner in this draw' });
    }

    winnerResult.record.proofUrl = proofUrl;
    winnerResult.record.verificationStatus = 'pending';

    draw.markModified(`${winnerResult.tier}.winners`);
    await draw.save();

    res.json({
      success: true,
      message: 'Proof uploaded successfully. Awaiting admin verification',
      data: winnerResult.record
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reviewWinner = async (req, res) => {
  try {
    const { drawId, userId } = req.params;
    const { verificationStatus } = req.body || {};

    if (!['approved', 'rejected'].includes(verificationStatus)) {
      return res.status(400).json({ message: 'Status must be approved or rejected' });
    }

    const draw = await Draw.findById(drawId);
    if (!draw) return res.status(404).json({ message: 'Draw not found' });

    const winnerResult = findWinnerRecord(draw, userId);
    if (!winnerResult) {
      return res.status(404).json({ message: 'User is not a winner in this draw' });
    }

    winnerResult.record.verificationStatus = verificationStatus;
    if (verificationStatus === 'approved') {
      winnerResult.record.paymentStatus = 'paid';
      
      try {
         const user = await User.findById(userId);
         if(user) {
            sendEmail({
               to: user.email,
               ...EmailTemplates.winnerApprovalAlert(winnerResult.tier, draw[winnerResult.tier].prizePerWinner)
            });
         }
      } catch(err) {
         console.log('Payout email failed', err);
      }
      
    } else {
      winnerResult.record.paymentStatus = 'pending';
    }

    draw.markModified(`${winnerResult.tier}.winners`);
    await draw.save();

    res.json({
      success: true,
      message: `User verification ${verificationStatus}`,
      data: winnerResult.record
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

