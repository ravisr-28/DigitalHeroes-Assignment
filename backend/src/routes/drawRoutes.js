import express from 'express';
import { simulateDraw, publishDraw, getDraws } from '../controllers/drawController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

// Users can view draws
router.get('/', getDraws);

// Only admins can trigger simulations and publishes
router.post('/simulate', authorize('admin'), simulateDraw);
router.post('/publish/:id', authorize('admin'), publishDraw);

export default router;
