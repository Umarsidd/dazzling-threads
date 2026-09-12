import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Get executive dashboard metrics
// @route   GET /api/admin/analytics/dashboard
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      pendingOrders,
      completedOrders,
      lowStockCount,
      allOrders,
      recentOrders,
      lowStockProducts,
    ] = await Promise.all([
      Product.countDocuments({ status: 'active' }),
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Order.countDocuments({ orderStatus: { $in: ['Pending', 'Confirmed', 'Processing'] } }),
      Order.countDocuments({ orderStatus: 'Delivered' }),
      Product.countDocuments({ stock: { $lte: 3 }, status: 'active' }),
      Order.find({ paymentStatus: { $in: ['completed', 'pending'] } }).select('total items orderStatus paymentStatus createdAt'),
      Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(6),
      Product.find({ stock: { $lte: 3 }, status: 'active' }).select('name price stock images sku category').limit(8),
    ]);

    // Compute total revenue and average order value
    const totalRevenue = allOrders.reduce((sum, ord) => sum + (ord.total || 0), 0);
    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // Sales by Gender (Men vs Women vs Bridal)
    let menSales = 0;
    let womenSales = 0;
    const categoryDistribution = {};

    // Generate 7-day revenue trend data
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      last7Days.push({ date: dateStr, revenue: 0, orders: 0 });
    }

    allOrders.forEach((order) => {
      const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const daySlot = last7Days.find((d) => d.date === orderDate);
      if (daySlot) {
        daySlot.revenue += order.total || 0;
        daySlot.orders += 1;
      }
    });

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalUsers,
        totalProducts,
        pendingOrders,
        completedOrders,
        lowStockCount,
        averageOrderValue,
      },
      charts: {
        revenueTrend: last7Days,
      },
      recentOrders,
      lowStockProducts,
    });
  } catch (error) {
    next(error);
  }
};
