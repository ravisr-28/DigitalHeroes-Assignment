import express from 'express';
import { getUserDashboard } from '../controllers/userController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Dashboard aggregation summary route
router.get('/dashboard', protect, getUserDashboard);

export default router;
