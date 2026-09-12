import Review from '../models/Review.js';
import Product from '../models/Product.js';

// @desc    Get approved reviews for a product
// @route   GET /api/products/:id/reviews
export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({
      product: req.params.id,
      status: 'approved',
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Add review for a product
// @route   POST /api/products/:id/reviews
export const addReview = async (req, res, next) => {
  try {
    const { rating, comment, title, images } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const review = await Review.create({
      user: req.user._id,
      product: product._id,
      userName: req.user.name,
      rating: Number(rating),
      title: title || '',
      comment,
      images: images || [],
      status: 'approved',
    });

    // Recompute product rating & reviewCount
    const allReviews = await Review.find({ product: product._id, status: 'approved' });
    const avg = allReviews.reduce((acc, item) => acc + item.rating, 0) / allReviews.length;

    product.rating = Number(avg.toFixed(1));
    product.reviewCount = allReviews.length;
    await product.save();

    res.status(201).json({ success: true, review, productRating: product.rating, reviewCount: product.reviewCount });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews [Admin]
// @route   GET /api/admin/reviews
export const getAdminReviews = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate('product', 'name slug images')
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Review.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update review status [Admin]
// @route   PUT /api/admin/reviews/:id
export const updateReviewStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const review = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.status(200).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review [Admin]
// @route   DELETE /api/admin/reviews/:id
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};
