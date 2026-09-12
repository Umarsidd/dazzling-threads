import express from 'express';
import multer from 'multer';
import {
  getProducts,
  getProductBySlug,
  getProductById,
  getFeaturedProducts,
  getTrendingProducts,
  getNewArrivals,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const router = express.Router();

router.get('/', getProducts);
router.get('/collections/featured', getFeaturedProducts);
router.get('/collections/trending', getTrendingProducts);
router.get('/collections/new-arrivals', getNewArrivals);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id/related', getRelatedProducts);
router.get('/:id', getProductById);

// Admin Routes
router.post('/', protect, authorize('admin', 'staff'), createProduct);
router.put('/:id', protect, authorize('admin', 'staff'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);
router.post(
  '/upload-image',
  protect,
  authorize('admin', 'staff'),
  upload.single('image'),
  uploadProductImage
);

export default router;
