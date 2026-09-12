import express from 'express';
import {
  getProductReviews,
  addReview,
  getAdminReviews,
  updateReviewStatus,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/product/:id', getProductReviews);
router.post('/product/:id', protect, addReview);

// Admin Routes
router.get('/admin/all', protect, authorize('admin', 'staff'), getAdminReviews);
router.put('/admin/:id', protect, authorize('admin', 'staff'), updateReviewStatus);
router.delete('/admin/:id', protect, authorize('admin'), deleteReview);

export default router;
