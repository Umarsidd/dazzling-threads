import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, Clock, CheckCircle2, ChevronRight, ShoppingBag } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my-orders')
      .then(({ data }) => setOrders(data.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-32 flex items-center justify-center text-luxury-gold">
        <div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen pt-28 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-6 border-b border-white/10 mb-10 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-medium">VIP History</span>
            <h1 className="font-display text-3xl sm:text-4xl tracking-widest uppercase mt-1">
              Your Commissioned Orders
            </h1>
          </div>
          <Link to="/profile" className="text-xs text-luxury-gold hover:underline uppercase tracking-wider">
            Back to Profile
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-[#111111] border border-white/10 p-8">
            <Package className="w-14 h-14 text-luxury-gold/30 mx-auto mb-4 stroke-1" />
            <h2 className="font-display text-xl uppercase tracking-widest text-white mb-2">
              No Previous Orders Found
            </h2>
            <p className="text-xs text-white/50 mb-6 font-sans">
              Discover our signature sherwanis and bridal couture creations.
            </p>
            <Link
              to="/men"
              className="px-6 py-2.5 bg-luxury-gold text-black text-xs uppercase tracking-widest font-semibold"
            >
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((ord) => (
              <div
                key={ord._id}
                className="bg-[#111111] border border-white/10 hover:border-luxury-gold/40 p-6 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-luxury-gold shrink-0" />
                    <div>
                      <span className="font-mono text-white font-medium">#{ord._id}</span>
                      <p className="text-white/40 text-[11px]">
                        Placed on {new Date(ord.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider border border-luxury-gold/40 text-luxury-gold bg-luxury-gold/10">
                      {ord.orderStatus}
                    </span>
                    <span className="font-serif text-base font-bold text-luxury-gold">
                      ₹{ord.total?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="py-4 space-y-3">
                  {ord.items?.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={it.image}
                          alt={it.name}
                          className="w-12 h-14 object-cover object-top border border-white/10 shrink-0"
                        />
                        <div>
                          <p className="font-display font-medium text-white line-clamp-1">{it.name}</p>
                          <p className="text-white/50 text-[11px]">
                            Size: <strong className="text-luxury-gold">{it.size}</strong> &bull; Qty: {it.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-serif font-medium text-white/80">
                        ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Address & Tracking footer */}
                <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-white/50 gap-2">
                  <span>
                    Delivering to: <strong className="text-white">{ord.shippingAddress?.fullName}</strong>, {ord.shippingAddress?.city}
                  </span>
                  <span className="text-luxury-gold flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    <span>White-Glove Insured Delivery</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
