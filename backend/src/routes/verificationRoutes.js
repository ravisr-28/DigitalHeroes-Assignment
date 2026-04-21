import express from 'express';
import { uploadProof, reviewWinner } from '../controllers/verificationController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

// Winner route to upload proof
router.post('/upload/:drawId', uploadProof);

// Admin route to review proof
router.post('/review/:drawId/:userId', authorize('admin'), reviewWinner);

export default router;
