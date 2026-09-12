import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Helper to populate items
const populateCart = (query) => query.populate('items.product', 'name slug price salePrice images stock fabric');

// @desc    Get user cart
// @route   GET /api/cart
export const getCart = async (req, res, next) => {
  try {
    let cart = await populateCart(Cart.findOne({ user: req.user._id }));
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, size = 'M', color = '', customMeasurements } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Check if same product with same size already exists
    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.size === size && item.color === color
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        product: productId,
        quantity: Number(quantity),
        size,
        color,
        customMeasurements,
      });
    }

    await cart.save();
    cart = await populateCart(Cart.findById(cart._id));

    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity/size
// @route   PUT /api/cart/:itemId
export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity, size } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    if (quantity !== undefined) item.quantity = Math.max(1, Number(quantity));
    if (size) item.size = size;

    await cart.save();
    cart = await populateCart(Cart.findById(cart._id));

    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
export const removeFromCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== req.params.itemId);
    await cart.save();

    cart = await populateCart(Cart.findById(cart._id));
    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
export const clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.status(200).json({ success: true, message: 'Cart emptied', cart: { items: [] } });
  } catch (error) {
    next(error);
  }
};

// @desc    Sync guest cart on login
// @route   POST /api/cart/sync
export const syncCart = async (req, res, next) => {
  try {
    const { guestItems = [] } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    for (const gItem of guestItems) {
      const pId = gItem.product?._id || gItem.product;
      if (!pId) continue;

      const idx = cart.items.findIndex(
        (it) => it.product.toString() === pId.toString() && it.size === gItem.size
      );

      if (idx > -1) {
        cart.items[idx].quantity += gItem.quantity || 1;
      } else {
        cart.items.push({
          product: pId,
          quantity: gItem.quantity || 1,
          size: gItem.size || 'M',
          color: gItem.color || '',
        });
      }
    }

    await cart.save();
    cart = await populateCart(Cart.findById(cart._id));

    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};
