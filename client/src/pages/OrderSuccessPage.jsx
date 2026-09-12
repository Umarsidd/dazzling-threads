import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Truck, Sparkles } from 'lucide-react';
import api from '../services/api';

export const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.get(`/orders/${id}`)
        .then(({ data }) => setOrder(data.order))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id]);

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Success Crest */}
        <div className="w-20 h-20 rounded-full border-2 border-luxury-gold bg-luxury-gold/10 mx-auto flex items-center justify-center mb-6 shadow-[0_0_35px_rgba(212,175,55,0.3)]">
          <CheckCircle2 className="w-10 h-10 text-luxury-gold" />
        </div>

        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.3em] text-luxury-gold font-medium mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Order Confirmed &bull; Dulha Dulhan House</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-widest uppercase font-light mb-4">
          CRAFTED FOR YOUR <span className="gold-gradient-text font-normal">MOMENT</span>
        </h1>

        <p className="font-serif italic text-base sm:text-lg text-white/80 max-w-xl mx-auto mb-8 font-light">
          “Thank you for entrusting Dazzling Threads with your momentous celebration. Our master artisans have received your order details.”
        </p>

        {order && (
          <div className="bg-[#111111] border border-luxury-gold/30 p-6 sm:p-8 text-left mb-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-white/50">Order Reference</span>
                <p className="font-mono text-sm font-semibold text-luxury-gold">#{order._id}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-white/50">Fulfillment Status</span>
                <p className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
                  {order.orderStatus} (White-Glove Processing)
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-white/50">Payment</span>
                <p className="text-xs uppercase tracking-wider font-semibold text-white">
                  {order.paymentMethod.toUpperCase()} &bull; {order.paymentStatus}
                </p>
              </div>
            </div>

            {/* Items Summary */}
            <div className="divide-y divide-white/10">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-16 object-cover object-top border border-white/10" />
                    <div>
                      <p className="font-display font-medium text-white">{item.name}</p>
                      <p className="text-white/50 text-[11px]">Size: {item.size} &bull; Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-serif text-sm font-semibold text-luxury-gold">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-white/10 flex justify-between items-baseline">
              <span className="font-display text-sm tracking-wider uppercase">Total Amount</span>
              <span className="font-serif text-2xl font-bold text-luxury-gold">
                ₹{order.total?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}

        {/* Next Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/orders"
            className="px-8 py-3.5 bg-luxury-gold text-black font-display text-xs tracking-[0.2em] uppercase font-semibold hover:bg-luxury-gold-light transition-all flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>Track Order History</span>
          </Link>
          <Link
            to="/"
            className="px-8 py-3.5 border border-white/30 text-white font-display text-xs tracking-[0.2em] uppercase font-medium hover:border-luxury-gold hover:text-luxury-gold transition-colors flex items-center justify-center gap-2"
          >
            <span>Return to Home</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
