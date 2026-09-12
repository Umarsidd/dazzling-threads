import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
    },
    gender: {
      type: String,
      enum: ['men', 'women', 'unisex'],
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Please select category'],
      trim: true,
    },
    subcategory: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Please set standard price'],
      min: 0,
    },
    salePrice: {
      type: Number,
      min: 0,
      default: null,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true,
    },
    images: {
      type: [String],
      validate: [v => Array.isArray(v) && v.length > 0, 'At least one product image is required'],
    },
    sizes: {
      type: [String],
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom'],
      default: ['S', 'M', 'L', 'XL', 'Custom'],
    },
    colors: {
      type: [
        {
          name: String,
          hex: String,
        },
      ],
      default: [],
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 10,
    },
    fabric: {
      type: String,
      default: 'Pure Raw Silk / Velvet / Handloom Zardozi',
    },
    tags: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4.9,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    trending: {
      type: Boolean,
      default: false,
    },
    newArrival: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'draft', 'archived'],
      default: 'active',
    },
  },
  { timestamps: true }
);

// Indexes for fast querying, filtering and search
productSchema.index({ name: 'text', description: 'text', tags: 'text', fabric: 'text' });
productSchema.index({ gender: 1, category: 1, status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ featured: 1, trending: 1, newArrival: 1 });

export default mongoose.model('Product', productSchema);
