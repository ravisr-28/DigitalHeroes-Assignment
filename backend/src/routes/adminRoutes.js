import express from 'express';
import { getAllUsers, updateUser, getAllWinners, getAnalytics } from '../controllers/adminController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.get('/winners', getAllWinners);
router.get('/analytics', getAnalytics);

export default router;
