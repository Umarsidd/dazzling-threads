import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, X } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [minimumOrder, setMinimumOrder] = useState(25000);
  const [maximumDiscount, setMaximumDiscount] = useState(10000);
  const [expiryDate, setExpiryDate] = useState('2028-12-31');
  const { addToast } = useToast();

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = () => {
    setLoading(true);
    api.get('/coupons/admin/all')
      .then(({ data }) => setCoupons(data.coupons || []))
      .catch(() => setCoupons([]))
      .finally(() => setLoading(false));
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/coupons/admin', {
        code,
        discountType,
        discountValue: Number(discountValue),
        minimumOrder: Number(minimumOrder),
        maximumDiscount: maximumDiscount ? Number(maximumDiscount) : null,
        expiryDate,
      });
      setCoupons([data.coupon, ...coupons]);
      addToast(`Voucher ${code} activated successfully`, 'success');
      setIsModalOpen(false);
      setCode('');
    } catch (err) {
      addToast(err.response?.data?.message || 'Error creating coupon', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this voucher?')) return;
    try {
      await api.delete(`/coupons/admin/${id}`);
      setCoupons(coupons.filter((c) => c._id !== id));
      addToast('Voucher removed', 'info');
    } catch {
      addToast('Error removing coupon', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-medium">Promotions</span>
          <h1 className="font-display text-2xl sm:text-3xl tracking-widest uppercase mt-1">Vouchers & Privileges</h1>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-luxury-gold text-black font-display text-xs uppercase tracking-wider font-semibold hover:bg-luxury-gold-light transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Issue New Voucher</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div key={c._id} className="bg-[#111111] border border-luxury-gold/30 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-base font-bold text-luxury-gold tracking-widest uppercase">{c.code}</span>
                <button onClick={() => handleDelete(c._id)} className="text-white/40 hover:text-red-400 p-1">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-sm font-semibold text-white mb-2">
                {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT DISCOUNT`}
              </p>

              <div className="space-y-1 text-xs text-white/60">
                <p>Min Order: ₹{c.minimumOrder?.toLocaleString('en-IN')}</p>
                {c.maximumDiscount && <p>Max Cap: ₹{c.maximumDiscount?.toLocaleString('en-IN')}</p>}
                <p>Used: <strong className="text-luxury-gold">{c.usedCount || 0}</strong> redemptions</p>
                <p>Valid till: {new Date(c.expiryDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-[10px]">
              <span className="px-2 py-0.5 bg-emerald-950/80 text-emerald-300 border border-emerald-700 uppercase font-semibold">
                {c.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-[#111111] border border-luxury-gold/50 p-6 sm:p-8 z-10 text-white">
            <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-6">
              <h3 className="font-display text-base uppercase tracking-widest text-luxury-gold font-semibold">
                Issue VIP Promo Voucher
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block text-white/70 uppercase mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ROYAL10"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white font-mono uppercase focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-white/70 uppercase mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-luxury-gold"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/70 uppercase mb-1">Value</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-luxury-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-white/70 uppercase mb-1">Minimum Order (₹)</label>
                  <input
                    type="number"
                    value={minimumOrder}
                    onChange={(e) => setMinimumOrder(e.target.value)}
                    className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-luxury-gold"
                  />
                </div>
                <div>
                  <label className="block text-white/70 uppercase mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    value={maximumDiscount}
                    onChange={(e) => setMaximumDiscount(e.target.value)}
                    className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-luxury-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 uppercase mb-1">Expiry Date</label>
                <input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-white/20 text-white uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-luxury-gold text-black uppercase font-semibold hover:bg-luxury-gold-light"
                >
                  Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
