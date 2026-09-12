import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  TrendingUp,
  Clock,
  ArrowRight,
} from 'lucide-react';
import api from '../../services/api';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics/dashboard')
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center text-luxury-gold">
        <div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = data?.stats || {};
  const charts = data?.charts || {};
  const recentOrders = data?.recentOrders || [];
  const lowStock = data?.lowStockProducts || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-medium">Executive Overview</span>
          <h1 className="font-display text-2xl sm:text-3xl tracking-widest uppercase mt-1">
            Performance Analytics
          </h1>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-luxury-gold text-black text-xs uppercase tracking-wider font-semibold hover:bg-luxury-gold-light transition-colors"
          >
            Manage Catalog
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2 border border-white/20 text-white text-xs uppercase tracking-wider hover:border-white transition-colors"
          >
            View Orders
          </Link>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="p-6 bg-[#111111] border border-luxury-gold/40 relative flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-widest text-white/60">Gross Revenue</span>
            <div className="w-8 h-8 rounded-full bg-luxury-gold/10 border border-luxury-gold/40 flex items-center justify-center text-luxury-gold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <span className="font-serif text-3xl font-bold text-luxury-gold">
            ₹{stats.totalRevenue?.toLocaleString('en-IN') || '0'}
          </span>
          <span className="text-[11px] text-white/40 mt-2">All settled & pending commissions</span>
        </div>

        {/* Total Orders */}
        <div className="p-6 bg-[#111111] border border-white/10 relative flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-widest text-white/60">Total Orders</span>
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-white">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <span className="font-display text-3xl font-bold text-white">
            {stats.totalOrders || 0}
          </span>
          <span className="text-[11px] text-luxury-gold mt-2">
            {stats.pendingOrders || 0} Pending Fulfillment
          </span>
        </div>

        {/* Total Customers */}
        <div className="p-6 bg-[#111111] border border-white/10 relative flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-widest text-white/60">VIP Patrons</span>
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-white">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <span className="font-display text-3xl font-bold text-white">
            {stats.totalUsers || 0}
          </span>
          <span className="text-[11px] text-white/40 mt-2">Registered client accounts</span>
        </div>

        {/* Low Stock Warning */}
        <div className="p-6 bg-[#111111] border border-white/10 relative flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-widest text-white/60">Low Stock Pieces</span>
            <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <span className="font-display text-3xl font-bold text-amber-400">
            {stats.lowStockCount || 0}
          </span>
          <span className="text-[11px] text-amber-300/60 mt-2">&le; 3 units inventory warning</span>
        </div>
      </div>

      {/* 7-Day Revenue Trend Visualizer */}
      <div className="p-6 sm:p-8 bg-[#111111] border border-white/10 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <span className="text-xs uppercase tracking-widest text-luxury-gold font-semibold">Trend Analysis</span>
            <h2 className="font-display text-lg uppercase tracking-wider text-white">7-Day Revenue Volume</h2>
          </div>
          <span className="text-xs text-white/50 font-sans">
            Average Order Value: <strong className="text-luxury-gold">₹{stats.averageOrderValue?.toLocaleString('en-IN') || 0}</strong>
          </span>
        </div>

        {/* Visual Bar Chart */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 h-48 items-end pt-4 border-b border-white/10 pb-2">
          {charts.revenueTrend?.map((item, idx) => {
            const maxVal = Math.max(...charts.revenueTrend.map((d) => d.revenue), 100000);
            const heightPercent = Math.max(8, (item.revenue / maxVal) * 100);

            return (
              <div key={idx} className="flex flex-col items-center h-full justify-end group">
                <div className="w-full bg-[#1A1A1A] group-hover:bg-luxury-gold/80 transition-all duration-300 rounded-t-sm flex flex-col justify-between p-1 relative border border-white/5" style={{ height: `${heightPercent}%` }}>
                  {item.revenue > 0 && (
                    <span className="hidden sm:block text-[9px] text-center font-mono text-white/70 truncate">
                      ₹{Math.round(item.revenue / 1000)}k
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-white/50 mt-2 font-mono">{item.date}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Columns: Recent Orders and Low Stock Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders (8 cols) */}
        <div className="lg:col-span-8 p-6 bg-[#111111] border border-white/10">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <h3 className="font-display text-sm uppercase tracking-widest text-white">
              Recent Commissioned Orders
            </h3>
            <Link to="/admin/orders" className="text-xs text-luxury-gold hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/10 text-white/50 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Client</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {recentOrders.length === 0 ? (
                  <tr><td colSpan={4} className="py-6 text-center text-white/40">No recent orders logged yet.</td></tr>
                ) : (
                  recentOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-white/5">
                      <td className="py-3 px-3 font-mono text-luxury-gold">#{ord._id.slice(-6)}</td>
                      <td className="py-3 px-3">{ord.user?.name || ord.shippingAddress?.fullName || 'VIP Guest'}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 border border-white/20 text-[10px] uppercase font-semibold">
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-serif font-semibold text-luxury-gold">
                        ₹{ord.total?.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts (4 cols) */}
        <div className="lg:col-span-4 p-6 bg-[#111111] border border-white/10">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <h3 className="font-display text-sm uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Low Inventory</span>
            </h3>
            <Link to="/admin/products" className="text-xs text-luxury-gold hover:underline">
              Catalog
            </Link>
          </div>

          <div className="space-y-3">
            {lowStock.length === 0 ? (
              <p className="text-xs text-white/50 italic py-4">All garments comfortably stocked.</p>
            ) : (
              lowStock.map((prod) => (
                <div key={prod._id} className="flex items-center justify-between p-2.5 bg-black/40 border border-white/5 text-xs">
                  <div className="flex items-center gap-2.5">
                    <img src={(prod.images && prod.images[0]) || '/logo.png'} alt="" className="w-8 h-10 object-cover" />
                    <div>
                      <p className="font-display font-medium text-white line-clamp-1">{prod.name}</p>
                      <p className="text-[10px] text-white/40">{prod.sku || prod.category}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-red-950/70 border border-red-800 text-red-300 font-mono font-bold text-[11px]">
                    {prod.stock} left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
