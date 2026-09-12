import Product from '../models/Product.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

// @desc    Get all products with advanced filtering, search, sorting & pagination
// @route   GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      gender,
      category,
      subcategory,
      minPrice,
      maxPrice,
      size,
      fabric,
      inStock,
      featured,
      trending,
      newArrival,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    const query = { status: 'active' };

    // Search
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { subcategory: searchRegex },
        { fabric: searchRegex },
        { tags: searchRegex },
      ];
    }

    // Gender
    if (gender) {
      query.gender = gender.toLowerCase();
    }

    // Category
    if (category) {
      query.category = new RegExp(`^${category.trim()}$`, 'i');
    }

    // Subcategory
    if (subcategory) {
      query.subcategory = new RegExp(`^${subcategory.trim()}$`, 'i');
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Size filter
    if (size) {
      const sizesList = Array.isArray(size) ? size : size.split(',');
      query.sizes = { $in: sizesList };
    }

    // Fabric filter
    if (fabric) {
      query.fabric = new RegExp(fabric, 'i');
    }

    // Stock availability
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Badges
    if (featured === 'true') query.featured = true;
    if (trending === 'true') query.trending = true;
    if (newArrival === 'true') query.newArrival = true;

    // Sorting
    let sortOptions = {};
    switch (sort) {
      case 'price_asc':
        sortOptions = { price: 1 };
        break;
      case 'price_desc':
        sortOptions = { price: -1 };
        break;
      case 'rating':
        sortOptions = { rating: -1, reviewCount: -1 };
        break;
      case 'popular':
        sortOptions = { trending: -1, rating: -1 };
        break;
      case 'newest':
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOptions).skip(skip).limit(limitNum),
      Product.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by slug
// @route   GET /api/products/slug/:slug
export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/collections/featured
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ featured: true, status: 'active' }).limit(8);
    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trending products
// @route   GET /api/products/collections/trending
export const getTrendingProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ trending: true, status: 'active' }).limit(10);
    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get new arrivals
// @route   GET /api/products/collections/new-arrivals
export const getNewArrivals = async (req, res, next) => {
  try {
    const products = await Product.find({ newArrival: true, status: 'active' }).sort({ createdAt: -1 }).limit(10);
    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
export const getRelatedProducts = async (req, res, next) => {
  try {
    const current = await Product.findById(req.params.id);
    if (!current) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const related = await Product.find({
      _id: { $ne: current._id },
      $or: [{ category: current.category }, { gender: current.gender }],
      status: 'active',
    }).limit(4);

    res.status(200).json({ success: true, products: related });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product [Admin]
// @route   POST /api/products
export const createProduct = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);
    }
    const product = await Product.create(data);
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product [Admin]
// @route   PUT /api/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product [Admin]
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, message: 'Product successfully removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload product image [Admin]
// @route   POST /api/products/upload-image
export const uploadProductImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please attach an image file' });
    }
    const uploadResult = await uploadToCloudinary(req.file.buffer);
    res.status(200).json({
      success: true,
      url: uploadResult.url,
      publicId: uploadResult.publicId,
    });
  } catch (error) {
    next(error);
  }
};
