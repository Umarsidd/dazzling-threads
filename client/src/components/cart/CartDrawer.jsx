import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, Tag, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    subtotal,
    discount,
    coupon,
    applyCoupon,
    removeCoupon,
    shippingCost,
    total,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    await applyCoupon(couponInput.trim());
    setIsApplying(false);
    setCouponInput('');
  };

  const freeShippingThreshold = 5000;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#0D0D0D] border-l border-luxury-gold/30 h-full flex flex-col justify-between shadow-2xl z-10 animate-fade-in text-white">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-luxury-gold" />
            <h2 className="font-display text-base tracking-[0.2em] uppercase">Your Shopping Bag</h2>
            <span className="text-xs text-luxury-gold font-sans">
              ({cartItems.reduce((acc, it) => acc + (it.quantity || 1), 0)})
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-white/60 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#141414] px-5 py-3 border-b border-white/5">
          <div className="flex justify-between text-xs text-white/70 mb-1.5 font-sans">
            {subtotal >= freeShippingThreshold ? (
              <span className="text-luxury-gold font-medium">✨ You unlocked complimentary insured shipping!</span>
            ) : (
              <span>
                Add <strong className="text-luxury-gold">₹{(freeShippingThreshold - subtotal).toLocaleString('en-IN')}</strong> for complimentary shipping
              </span>
            )}
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-luxury-gold transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Item List or Empty State */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-white/10">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <ShoppingBag className="w-12 h-12 text-luxury-gold/30 mb-4 stroke-1" />
              <p className="font-display tracking-widest text-base mb-2">Your Bag is Empty</p>
              <p className="text-xs text-white/50 mb-6 font-sans">
                Explore our curated bridal and royal groom collections.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/women/bridal');
                }}
                className="px-6 py-2.5 border border-luxury-gold text-luxury-gold text-xs uppercase tracking-[0.2em] hover:bg-luxury-gold hover:text-black transition-colors"
              >
                Discover Collections
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const product = item.product || {};
              const currentPrice = product.salePrice || product.price || 0;
              const imgUrl = (product.images && product.images[0]) || item.image || '/logo.png';

              return (
                <div key={item._id} className="py-4 flex gap-4 first:pt-0">
                  <img
                    src={imgUrl}
                    alt={product.name}
                    className="w-20 h-24 object-cover object-top border border-white/10 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          to={`/product/${product.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-display text-xs tracking-wider line-clamp-2 hover:text-luxury-gold transition-colors"
                        >
                          {product.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item._id)}
                          className="text-white/40 hover:text-red-400 transition-colors p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-white/60">
                        <span>Size: <strong className="text-luxury-gold">{item.size}</strong></span>
                        {item.color && <span>&bull; Color: {item.color}</span>}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-white/20">
                        <button
                          onClick={() => updateQuantity(item._id, (item.quantity || 1) - 1)}
                          className="p-1 hover:bg-white/10 text-white/70"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
                          className="p-1 hover:bg-white/10 text-white/70"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-serif text-sm font-semibold text-luxury-gold">
                        ₹{(currentPrice * (item.quantity || 1)).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer / Checkout Actions */}
        {cartItems.length > 0 && (
          <div className="p-5 bg-[#080808] border-t border-white/10 flex flex-col gap-4">
            {/* Promo Code Input */}
            {coupon ? (
              <div className="flex items-center justify-between p-2.5 bg-luxury-gold/10 border border-luxury-gold/30 text-xs">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-luxury-gold" />
                  <span className="text-luxury-gold font-semibold tracking-wider">
                    {coupon.code} (-₹{coupon.discountAmount.toLocaleString('en-IN')})
                  </span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-white/50 hover:text-white text-[11px] underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter Promo Voucher (e.g. ROYAL10)"
                    className="w-full bg-white/5 border border-white/15 pl-8 pr-3 py-2 text-xs text-white uppercase placeholder-white/40 focus:outline-none focus:border-luxury-gold"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isApplying}
                  className="px-4 py-2 border border-luxury-gold text-luxury-gold text-xs uppercase tracking-widest font-semibold hover:bg-luxury-gold hover:text-black transition-colors disabled:opacity-50"
                >
                  Apply
                </button>
              </form>
            )}

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-white/70">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-luxury-gold">
                  <span>Voucher Discount</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Insured White-Glove Shipping</span>
                <span>{shippingCost === 0 ? 'COMPLIMENTARY' : `₹${shippingCost}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Garment GST & Luxury Tax (12%)</span>
                <span>₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-white pt-2 border-t border-white/10">
                <span className="font-display tracking-wider">Estimated Total</span>
                <span className="text-luxury-gold font-serif text-base">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="w-full py-3.5 bg-luxury-gold text-black font-display font-semibold text-xs tracking-[0.25em] uppercase hover:bg-luxury-gold-light transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/cart');
                }}
                className="w-full py-2 border border-white/20 text-white/80 text-xs tracking-[0.2em] uppercase hover:border-white transition-colors text-center"
              >
                View Full Bag Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
