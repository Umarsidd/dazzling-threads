import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import { createRazorpayOrder } from '../config/razorpay.js';

// @desc    Create new order
// @route   POST /api/orders
export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items specified' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({ success: false, message: 'Complete shipping address is required' });
    }

    // Verify each product and calculate accurate prices
    let subtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const dbProduct = await Product.findById(item.product);
      if (!dbProduct) {
        return res.status(404).json({ success: false, message: `Product ${item.name || ''} is unavailable` });
      }

      const activePrice = dbProduct.salePrice || dbProduct.price;
      subtotal += activePrice * item.quantity;

      verifiedItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        image: item.image || (dbProduct.images && dbProduct.images[0]) || '',
        price: activePrice,
        quantity: item.quantity,
        size: item.size || 'M',
        color: item.color || '',
        customMeasurements: item.customMeasurements,
      });

      // Stock adjustment
      if (dbProduct.stock >= item.quantity) {
        dbProduct.stock -= item.quantity;
        await dbProduct.save();
      }
    }

    // Calculate discount
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), status: 'active' });
      if (coupon && (!coupon.expiryDate || new Date(coupon.expiryDate) > new Date())) {
        if (!coupon.minimumOrder || subtotal >= coupon.minimumOrder) {
          if (coupon.discountType === 'percentage') {
            discount = (subtotal * coupon.discountValue) / 100;
            if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
              discount = coupon.maximumDiscount;
            }
          } else {
            discount = coupon.discountValue;
          }
          coupon.usedCount = (coupon.usedCount || 0) + 1;
          await coupon.save();
        }
      }
    }

    const shippingCost = subtotal > 5000 ? 0 : 250; // Complimentary shipping over ₹5000
    const tax = Math.round((subtotal - discount) * 0.12); // 12% luxury garment GST
    const total = Math.max(0, subtotal - discount + shippingCost + tax);

    // Prepare Razorpay payload if razorpay selected
    let razorpayDetails = null;
    if (paymentMethod === 'razorpay') {
      const rpOrder = await createRazorpayOrder({
        amount: total,
        currency: 'INR',
        receipt: `dt_${Date.now()}`,
      });
      razorpayDetails = rpOrder;
    }

    const order = await Order.create({
      user: req.user._id,
      items: verifiedItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      orderStatus: 'Pending',
      subtotal,
      discount,
      shippingCost,
      tax,
      total,
      couponCode: couponCode || undefined,
      notes: notes || '',
      transactionId: razorpayDetails ? razorpayDetails.id : `COD-${Date.now()}`,
    });

    res.status(201).json({
      success: true,
      order,
      razorpay: razorpayDetails,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer's orders
// @route   GET /api/orders/my-orders
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order details
// @route   GET /api/orders/:id
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check ownership or admin privilege
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this order' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order (Customer or Admin)
// @route   PUT /api/orders/:id/cancel
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to cancel this order' });
    }

    if (['Shipped', 'Out for Delivery', 'Delivered'].includes(order.orderStatus)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel an order that is already dispatched' });
    }

    order.orderStatus = 'Cancelled';
    await order.save();

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }

    res.status(200).json({ success: true, message: 'Order cancelled successfully', order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders [Admin]
// @route   GET /api/admin/orders
export const getAdminOrders = async (req, res, next) => {
  try {
    const { status, paymentStatus, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.orderStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status [Admin]
// @route   PUT /api/admin/orders/:id/status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, trackingNumber, notes } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (notes) order.notes = notes;

    if (orderStatus === 'Delivered' && order.paymentMethod === 'cod') {
      order.paymentStatus = 'completed';
    }

    await order.save();

    res.status(200).json({ success: true, message: 'Order status updated', order });
  } catch (error) {
    next(error);
  }
};

// @desc    Update payment status [Admin]
// @route   PUT /api/admin/orders/:id/payment
export const updatePaymentStatus = async (req, res, next) => {
  try {
    const { paymentStatus, transactionId } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (transactionId) order.transactionId = transactionId;

    await order.save();

    res.status(200).json({ success: true, message: 'Payment status updated', order });
  } catch (error) {
    next(error);
  }
};
