import React, { useState, useEffect } from 'react';
import { Package, Truck, Check, Eye, X, ChevronDown, Clock } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { addToast } = useToast();

  const orderStatuses = [
    'Pending',
    'Confirmed',
    'Processing',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
    'Returned',
    'Refunded',
  ];

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = () => {
    setLoading(true);
    const query = statusFilter ? `?status=${statusFilter}` : '';
    api.get(`/orders/admin/all${query}`)
      .then(({ data }) => setOrders(data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const { data } = await api.put(`/orders/admin/${orderId}/status`, { orderStatus: newStatus });
      setOrders(orders.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o)));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
      }
      addToast(`Order status transitioned to ${newStatus}`, 'success');
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

  const handleUpdatePayment = async (orderId, newPaymentStatus) => {
    try {
      await api.put(`/orders/admin/${orderId}/payment`, { paymentStatus: newPaymentStatus });
      setOrders(orders.map((o) => (o._id === orderId ? { ...o, paymentStatus: newPaymentStatus } : o)));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, paymentStatus: newPaymentStatus });
      }
      addToast(`Payment status updated to ${newPaymentStatus}`, 'success');
    } catch (err) {
      addToast('Failed to update payment status', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-medium">Logistics & Atelier</span>
          <h1 className="font-display text-2xl sm:text-3xl tracking-widest uppercase mt-1">Order Fulfillment</h1>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/50 uppercase tracking-wider">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#181818] border border-white/15 text-white text-xs px-3 py-2 uppercase tracking-wider focus:outline-none focus:border-luxury-gold"
          >
            <option value="">All Orders ({orders.length})</option>
            {orderStatuses.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#111111] border border-white/10 overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-white/10 text-white/50 uppercase tracking-wider bg-black/40">
              <th className="py-3 px-4">Order ID & Date</th>
              <th className="py-3 px-4">Client & Contact</th>
              <th className="py-3 px-4">Items</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4">Order Status</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white/80">
            {loading ? (
              <tr><td colSpan={7} className="py-12 text-center text-luxury-gold">Loading commissioned orders...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={7} className="py-12 text-center text-white/40">No orders found matching filter.</td></tr>
            ) : (
              orders.map((ord) => (
                <tr key={ord._id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-luxury-gold font-medium block">#{ord._id.slice(-8)}</span>
                    <span className="text-[10px] text-white/40">{new Date(ord.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-white block">{ord.shippingAddress?.fullName}</span>
                    <span className="text-[10px] text-white/50">{ord.shippingAddress?.city}, {ord.shippingAddress?.phone}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span>{ord.items?.length} pieces</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="uppercase text-[10px] tracking-wider text-white font-semibold block">
                      {ord.paymentMethod}
                    </span>
                    <span className={`text-[10px] font-mono ${ord.paymentStatus === 'completed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => handleUpdateStatus(ord._id, e.target.value)}
                      className="bg-black/60 border border-white/20 text-white text-[11px] p-1.5 focus:outline-none focus:border-luxury-gold cursor-pointer"
                    >
                      {orderStatuses.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3.5 px-4 font-serif font-semibold text-luxury-gold">
                    ₹{ord.total?.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="px-3 py-1.5 border border-white/20 hover:border-luxury-gold hover:text-luxury-gold transition-colors text-[11px] uppercase tracking-wider"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Inspection Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative w-full max-w-2xl bg-[#111111] border border-luxury-gold/50 p-6 sm:p-8 z-10 text-white max-h-[90vh] overflow-y-auto animate-fade-in space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <div>
                <h3 className="font-display text-base uppercase tracking-widest text-luxury-gold font-semibold">
                  Commission #{selectedOrder._id}
                </h3>
                <span className="text-[11px] text-white/50">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Address & Client Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black/40 p-4 border border-white/10 text-xs">
              <div>
                <span className="text-luxury-gold uppercase font-semibold block mb-1">Shipping Destination</span>
                <p className="font-medium text-white">{selectedOrder.shippingAddress?.fullName}</p>
                <p className="text-white/70">{selectedOrder.shippingAddress?.street}</p>
                <p className="text-white/70">
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.postalCode}
                </p>
                <p className="text-white/60 font-mono mt-1">Contact: {selectedOrder.shippingAddress?.phone}</p>
              </div>

              <div>
                <span className="text-luxury-gold uppercase font-semibold block mb-1">Financial Settlement</span>
                <p className="text-white">Method: <strong className="uppercase">{selectedOrder.paymentMethod}</strong></p>
                <p className="text-white">Status: <strong className="uppercase text-luxury-gold">{selectedOrder.paymentStatus}</strong></p>
                {selectedOrder.transactionId && (
                  <p className="text-[10px] text-white/40 font-mono mt-1 truncate">ID: {selectedOrder.transactionId}</p>
                )}
                {/* Quick toggle payment status */}
                <button
                  onClick={() => handleUpdatePayment(selectedOrder._id, selectedOrder.paymentStatus === 'completed' ? 'pending' : 'completed')}
                  className="mt-3 px-3 py-1 bg-white/10 hover:bg-luxury-gold hover:text-black transition-colors text-[10px] uppercase font-semibold tracking-wider"
                >
                  Mark as {selectedOrder.paymentStatus === 'completed' ? 'Pending' : 'Completed'}
                </button>
              </div>
            </div>

            {/* Items */}
            <div>
              <h4 className="text-xs uppercase tracking-wider text-white/80 font-semibold mb-3">Garment Items</h4>
              <div className="divide-y divide-white/10 border border-white/10 p-3">
                {selectedOrder.items?.map((it, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs first:pt-0">
                    <div className="flex items-center gap-3">
                      <img src={it.image} alt="" className="w-10 h-14 object-cover object-top border border-white/10" />
                      <div>
                        <p className="font-display font-medium text-white">{it.name}</p>
                        <p className="text-white/50 text-[11px]">Size: <strong className="text-luxury-gold">{it.size}</strong> &bull; Qty: {it.quantity}</p>
                      </div>
                    </div>
                    <span className="font-serif font-semibold text-luxury-gold">
                      ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="pt-2 border-t border-white/10 text-xs flex justify-between items-center">
              <span>Commission Total:</span>
              <span className="font-serif text-2xl font-bold text-luxury-gold">
                ₹{selectedOrder.total?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
