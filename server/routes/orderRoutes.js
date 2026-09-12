import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAdminOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);

// Admin Routes
router.get('/admin/all', protect, authorize('admin', 'staff'), getAdminOrders);
router.put('/admin/:id/status', protect, authorize('admin', 'staff'), updateOrderStatus);
router.put('/admin/:id/payment', protect, authorize('admin', 'staff'), updatePaymentStatus);

export default router;
