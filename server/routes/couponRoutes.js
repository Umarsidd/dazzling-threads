import express from 'express';
import {
  validateCoupon,
  getAdminCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from '../controllers/couponController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/validate', validateCoupon);

// Admin Routes
router.get('/admin/all', protect, authorize('admin', 'staff'), getAdminCoupons);
router.post('/admin', protect, authorize('admin', 'staff'), createCoupon);
router.put('/admin/:id', protect, authorize('admin', 'staff'), updateCoupon);
router.delete('/admin/:id', protect, authorize('admin'), deleteCoupon);

export default router;
