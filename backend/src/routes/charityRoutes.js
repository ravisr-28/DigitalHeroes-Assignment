import express from 'express';
import { getCharities, getCharityById, updateCharityConfig, makeIndependentDonation, createCharity, updateCharityById, deleteCharity } from '../controllers/charityController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.get('/', getCharities);
router.get('/:id', getCharityById);

// Admin routes
router.post('/', protect, authorize('admin'), createCharity);
router.put('/:id', protect, authorize('admin'), updateCharityById);
router.delete('/:id', protect, authorize('admin'), deleteCharity);

// Protected routes
router.put('/config', protect, updateCharityConfig);
router.post('/independent-donation', protect, makeIndependentDonation);

export default router;
