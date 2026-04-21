import express from 'express';
import { addScore, getScores, editScore, deleteScore } from '../controllers/scoreController.js';
import { protect, requireSubscription } from '../middlewares/auth.js';

const router = express.Router();

// Apply the protect middleware to all routes in this router
router.use(protect);

// Users can view their scores
router.get('/', getScores);

// Only users with active subscriptions can add, edit, or delete scores
router.post('/', requireSubscription, addScore);
router.put('/:date', requireSubscription, editScore);
router.delete('/:date', requireSubscription, deleteScore);

export default router;
