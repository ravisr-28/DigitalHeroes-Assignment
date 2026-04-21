import express from 'express';
import { 
  getSubscriptionStatus, 
  createCheckoutSession, 
  verifyPayment, 
  cancelSubscription 
} from '../controllers/subscriptionController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/status', getSubscriptionStatus);
router.post('/create-session', createCheckoutSession);
router.post('/verify-payment', verifyPayment);
router.post('/cancel', cancelSubscription);

export default router;
