import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Check,
  ChevronRight,
  CreditCard,
  Truck,
  ShieldCheck,
  Lock,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const CheckoutPage = () => {
  const { cartItems, subtotal, discount, coupon, shippingCost, tax, total, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Active Step: 1 = Contact & Address, 2 = Delivery & Payment, 3 = Review & Place
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.addresses?.[0]?.street || '',
    landmark: user?.addresses?.[0]?.landmark || '',
    city: user?.addresses?.[0]?.city || 'New Delhi',
    state: user?.addresses?.[0]?.state || 'Delhi',
    postalCode: user?.addresses?.[0]?.postalCode || '110001',
    country: 'India',
    paymentMethod: 'razorpay', // 'razorpay' or 'cod'
    notes: '',
  });

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white pt-32 flex flex-col items-center justify-center text-center px-4">
        <ShoppingBag className="w-16 h-16 text-luxury-gold/30 mb-4 stroke-1" />
        <h2 className="font-display text-2xl uppercase tracking-widest mb-3">No Items to Checkout</h2>
        <p className="text-xs text-white/50 mb-6">Please add creations to your shopping bag prior to checkout.</p>
        <Link to="/women/bridal" className="px-6 py-2.5 bg-luxury-gold text-black text-xs uppercase tracking-widest font-semibold">
          Return to Atelier
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextFromStep1 = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.street || !formData.city || !formData.postalCode) {
      addToast('Please complete all required address fields', 'error');
      return;
    }
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const orderPayload = {
        items: cartItems.map((it) => ({
          product: it.product?._id || it.product,
          quantity: it.quantity || 1,
          size: it.size || 'M',
          color: it.color || '',
          image: (it.product?.images && it.product.images[0]) || it.image || '',
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          street: formData.street,
          landmark: formData.landmark,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
        couponCode: coupon?.code,
        notes: formData.notes,
      };

      const { data } = await api.post('/orders', orderPayload);

      if (data.success && data.order) {
        clearCart();
        addToast('Your bespoke order has been confirmed successfully!', 'success');
        navigate(`/order-success/${data.order._id}`);
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to finalize order. Please try again.';
      addToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Checkout Header & Steps Indicator */}
        <div className="pb-8 border-b border-white/10 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-medium">Bespoke Concierge</span>
            <h1 className="font-display text-3xl sm:text-4xl tracking-widest uppercase mt-1">Secured Checkout</h1>
          </div>

          {/* Stepper Wizard */}
          <div className="flex items-center gap-3 text-xs uppercase tracking-widest font-medium">
            <span className={`flex items-center gap-1.5 ${step >= 1 ? 'text-luxury-gold' : 'text-white/40'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${step >= 1 ? 'border-luxury-gold bg-luxury-gold text-black' : 'border-white/30'}`}>
                1
              </span>
              <span>Address</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-white/30" />
            <span className={`flex items-center gap-1.5 ${step >= 2 ? 'text-luxury-gold' : 'text-white/40'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${step >= 2 ? 'border-luxury-gold bg-luxury-gold text-black' : 'border-white/30'}`}>
                2
              </span>
              <span>Payment</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-white/30" />
            <span className={`flex items-center gap-1.5 ${step >= 3 ? 'text-luxury-gold' : 'text-white/40'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${step >= 3 ? 'border-luxury-gold bg-luxury-gold text-black' : 'border-white/30'}`}>
                3
              </span>
              <span>Review</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Form View (Steps) */}
          <div className="lg:col-span-8">
            {/* STEP 1: Contact & Shipping Address */}
            {step === 1 && (
              <form onSubmit={handleNextFromStep1} className="p-6 sm:p-8 bg-[#111111] border border-white/10 space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <h2 className="font-display text-lg uppercase tracking-widest text-luxury-gold font-semibold">
                    1. Shipping & Delivery Address
                  </h2>
                  <span className="text-xs text-white/50">* All fields required</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Princess Ananya Singhania"
                      className="w-full bg-[#181818] border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-luxury-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="client@luxuryhouse.com"
                      className="w-full bg-[#181818] border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-luxury-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">Mobile Contact</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#181818] border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-luxury-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">Landmark / Estate</label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleChange}
                      placeholder="Near Heritage Gate / Golf Course"
                      className="w-full bg-[#181818] border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-luxury-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">Street Address / Suite</label>
                  <input
                    type="text"
                    name="street"
                    required
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="Bungalow 42, Dulha Dulhan House, Heritage Blvd"
                    className="w-full bg-[#181818] border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-luxury-gold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">City</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-[#181818] border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-luxury-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">State</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full bg-[#181818] border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-luxury-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full bg-[#181818] border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-luxury-gold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-luxury-gold text-black font-display text-xs font-semibold tracking-[0.25em] uppercase hover:bg-luxury-gold-light transition-all flex items-center justify-center gap-2"
                >
                  <span>Continue to Payment Method</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: Delivery & Payment Method */}
            {step === 2 && (
              <div className="p-6 sm:p-8 bg-[#111111] border border-white/10 space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <h2 className="font-display text-lg uppercase tracking-widest text-luxury-gold font-semibold">
                    2. Delivery & Payment Selection
                  </h2>
                  <button onClick={() => setStep(1)} className="text-xs text-luxury-gold hover:underline">
                    Edit Address
                  </button>
                </div>

                {/* Delivery Option */}
                <div className="p-4 bg-[#161616] border border-luxury-gold/40 flex items-start gap-4">
                  <Truck className="w-6 h-6 text-luxury-gold shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-display text-sm tracking-wider uppercase font-semibold">
                      Insured White-Glove Courier &bull; {shippingCost === 0 ? 'COMPLIMENTARY' : `₹${shippingCost}`}
                    </h3>
                    <p className="text-xs text-white/60 mt-0.5">
                      Includes luxury padded keepsake packaging, tracking updates via SMS, and signature upon receipt.
                    </p>
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs uppercase tracking-wider text-luxury-gold font-semibold mb-2">
                    Select Payment Gateway
                  </label>

                  {/* Razorpay / Cards / UPI */}
                  <label
                    className={`flex items-start gap-3.5 p-4 border cursor-pointer transition-colors ${
                      formData.paymentMethod === 'razorpay'
                        ? 'border-luxury-gold bg-luxury-gold/10'
                        : 'border-white/15 bg-black/40 hover:border-white/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={formData.paymentMethod === 'razorpay'}
                      onChange={handleChange}
                      className="mt-1 text-luxury-gold focus:ring-luxury-gold"
                    />
                    <div>
                      <div className="flex items-center gap-2 font-display text-sm tracking-wider uppercase font-semibold text-white">
                        <CreditCard className="w-4 h-4 text-luxury-gold" />
                        <span>Razorpay Luxury Gateway (Cards, UPI, NetBanking)</span>
                      </div>
                      <p className="text-xs text-white/60 mt-1">
                        Instant encrypted settlement with Indian & International Credit/Debit Cards, Google Pay, PhonePe, UPI.
                      </p>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-start gap-3.5 p-4 border cursor-pointer transition-colors ${
                      formData.paymentMethod === 'cod'
                        ? 'border-luxury-gold bg-luxury-gold/10'
                        : 'border-white/15 bg-black/40 hover:border-white/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      className="mt-1 text-luxury-gold focus:ring-luxury-gold"
                    />
                    <div>
                      <div className="flex items-center gap-2 font-display text-sm tracking-wider uppercase font-semibold text-white">
                        <ShieldCheck className="w-4 h-4 text-luxury-gold" />
                        <span>Cash / Card On Delivery (Verified VIP Dispatch)</span>
                      </div>
                      <p className="text-xs text-white/60 mt-1">
                        Pay upon personal delivery after inspection by our white-glove logistics partner.
                      </p>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">
                    Tailoring Notes / Special Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Specific delivery date preferences, gift message, or measurement notes..."
                    className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-luxury-gold"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="py-3.5 px-6 border border-white/20 text-white text-xs uppercase tracking-widest hover:border-white transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 py-3.5 bg-luxury-gold text-black font-display text-xs font-semibold tracking-[0.25em] uppercase hover:bg-luxury-gold-light transition-all flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Order Review</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Final Order Review & Placement */}
            {step === 3 && (
              <div className="p-6 sm:p-8 bg-[#111111] border border-luxury-gold/40 space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <h2 className="font-display text-lg uppercase tracking-widest text-luxury-gold font-semibold">
                    3. Review & Authorize Order
                  </h2>
                  <button onClick={() => setStep(2)} className="text-xs text-luxury-gold hover:underline">
                    Modify Details
                  </button>
                </div>

                {/* Review Address and Payment Info summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-black/40 p-4 border border-white/10">
                  <div>
                    <h4 className="text-luxury-gold font-semibold uppercase tracking-wider mb-1">Deliver To</h4>
                    <p className="text-white font-medium">{formData.fullName}</p>
                    <p className="text-white/60">{formData.street}</p>
                    <p className="text-white/60">{formData.city}, {formData.state} - {formData.postalCode}</p>
                    <p className="text-white/60">Phone: {formData.phone}</p>
                  </div>
                  <div>
                    <h4 className="text-luxury-gold font-semibold uppercase tracking-wider mb-1">Payment Method</h4>
                    <p className="text-white font-medium">
                      {formData.paymentMethod === 'razorpay' ? 'Razorpay Secure (Cards/UPI/NetBanking)' : 'Cash / Card on Delivery'}
                    </p>
                    <p className="text-white/60 mt-1">Delivery: White-Glove Insured Delivery</p>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="divide-y divide-white/10 border-t border-b border-white/10 py-2 max-h-60 overflow-y-auto">
                  {cartItems.map((item) => {
                    const prod = item.product || {};
                    const price = prod.salePrice || prod.price || 0;
                    return (
                      <div key={item._id} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={(prod.images && prod.images[0]) || item.image || '/logo.png'}
                            alt={prod.name}
                            className="w-12 h-14 object-cover object-top border border-white/10"
                          />
                          <div>
                            <p className="font-display font-medium text-white line-clamp-1">{prod.name}</p>
                            <p className="text-white/50 text-[11px]">Size: {item.size} &bull; Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-serif text-sm font-semibold text-luxury-gold">
                          ₹{(price * (item.quantity || 1)).toLocaleString('en-IN')}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 bg-luxury-gold/5 border border-luxury-gold/30 text-xs text-white/70 space-y-1">
                  <p className="flex items-center gap-1.5 text-luxury-gold font-semibold">
                    <Lock className="w-3.5 h-3.5" />
                    <span>256-Bit SSL End-to-End Encrypted Checkout</span>
                  </p>
                  <p>By placing this order, you authorize Dazzling Threads to tailor and fulfill your selections.</p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="py-4 px-6 border border-white/20 text-white text-xs uppercase tracking-widest hover:border-white transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="flex-1 py-4 bg-luxury-gold text-black font-display text-xs font-semibold tracking-[0.25em] uppercase hover:bg-luxury-gold-light transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.3)] disabled:opacity-50"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{isSubmitting ? 'Securing Order...' : `Authorize & Place Order (₹${total.toLocaleString('en-IN')})`}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Order Summary Column */}
          <div className="lg:col-span-4">
            <div className="p-6 sm:p-8 bg-[#111111] border border-white/10 sticky top-28 space-y-6">
              <h3 className="font-display text-base uppercase tracking-widest text-white pb-3 border-b border-white/10">
                Order Breakdown
              </h3>

              <div className="space-y-3 text-xs text-white/70">
                <div className="flex justify-between">
                  <span>Bag Items ({cartItems.reduce((acc, it) => acc + (it.quantity || 1), 0)})</span>
                  <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-luxury-gold">
                    <span>Voucher ({coupon?.code})</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Insured Shipping</span>
                  <span className="text-white">
                    {shippingCost === 0 ? 'COMPLIMENTARY' : `₹${shippingCost}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Garment GST (12%)</span>
                  <span className="text-white">₹{tax.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-sm font-semibold text-white pt-4 border-t border-white/10">
                  <span className="font-display tracking-wider uppercase">Grand Total</span>
                  <span className="font-serif text-xl text-luxury-gold font-bold">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
