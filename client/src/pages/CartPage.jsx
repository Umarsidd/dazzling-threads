import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartPage = () => {
  const {
    cartItems,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    discount,
    coupon,
    applyCoupon,
    removeCoupon,
    shippingCost,
    tax,
    total,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setIsApplying(true);
    await applyCoupon(couponCode.trim());
    setIsApplying(false);
    setCouponCode('');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] bg-[#0A0A0A] text-white pt-32 pb-20 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <ShoppingBag className="w-16 h-16 text-luxury-gold/30 mx-auto mb-4 stroke-1" />
          <h1 className="font-display text-2xl sm:text-3xl tracking-widest uppercase mb-3">
            Your Bag is Empty
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mb-8 font-sans">
            You have not added any royal sherwanis or bridal creations to your shopping bag yet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/men"
              className="px-6 py-3 bg-luxury-gold text-black text-xs uppercase tracking-widest font-semibold hover:bg-luxury-gold-light transition-colors"
            >
              Explore Men
            </Link>
            <Link
              to="/women/bridal"
              className="px-6 py-3 border border-luxury-gold text-luxury-gold text-xs uppercase tracking-widest font-semibold hover:bg-luxury-gold hover:text-black transition-colors"
            >
              Explore Bridal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-medium">Checkout Basket</span>
            <h1 className="font-display text-3xl sm:text-4xl tracking-widest uppercase mt-1">Shopping Bag</h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-white/50 hover:text-red-400 uppercase tracking-widest transition-colors"
          >
            Empty Bag
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Items Table */}
          <div className="lg:col-span-8 space-y-6">
            {cartItems.map((item) => {
              const product = item.product || {};
              const price = product.salePrice || product.price || 0;
              const imgUrl = (product.images && product.images[0]) || item.image || '/logo.png';

              return (
                <div
                  key={item._id}
                  className="p-4 sm:p-6 bg-[#111111] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <img
                      src={imgUrl}
                      alt={product.name}
                      className="w-20 h-28 object-cover object-top border border-white/10 shrink-0"
                    />
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-medium">
                        {product.gender} &bull; {product.category}
                      </span>
                      <Link
                        to={`/product/${product.slug}`}
                        className="font-display text-sm sm:text-base tracking-wider hover:text-luxury-gold transition-colors block mt-1"
                      >
                        {product.name}
                      </Link>
                      <div className="flex items-center gap-3 mt-1 text-xs text-white/60">
                        <span>Size: <strong className="text-luxury-gold">{item.size}</strong></span>
                        {item.color && <span>&bull; Color: {item.color}</span>}
                      </div>
                      <div className="font-serif text-sm font-semibold text-luxury-gold mt-2 sm:hidden">
                        ₹{(price * (item.quantity || 1)).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                    <div className="hidden sm:block font-serif text-base font-semibold text-luxury-gold">
                      ₹{(price * (item.quantity || 1)).toLocaleString('en-IN')}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-white/20 bg-black/40">
                        <button
                          onClick={() => updateQuantity(item._id, (item.quantity || 1) - 1)}
                          className="p-1.5 hover:bg-white/10 text-white/70"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
                          className="p-1.5 hover:bg-white/10 text-white/70"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-white/40 hover:text-red-400 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Summary Card */}
          <div className="lg:col-span-4">
            <div className="p-6 sm:p-8 bg-[#111111] border border-luxury-gold/30 sticky top-28 space-y-6">
              <h2 className="font-display text-lg uppercase tracking-widest text-white pb-4 border-b border-white/10">
                Order Summary
              </h2>

              {/* Promo code box */}
              {coupon ? (
                <div className="flex items-center justify-between p-3 bg-luxury-gold/10 border border-luxury-gold/40 text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-luxury-gold" />
                    <span className="text-luxury-gold font-semibold tracking-wider">
                      {coupon.code} (-₹{coupon.discountAmount.toLocaleString('en-IN')})
                    </span>
                  </div>
                  <button onClick={removeCoupon} className="text-white/50 hover:text-white underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="VOUCHER (e.g. ROYAL10)"
                    className="flex-1 bg-[#181818] border border-white/20 px-3 py-2 text-xs uppercase text-white focus:outline-none focus:border-luxury-gold"
                  />
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="px-4 py-2 border border-luxury-gold text-luxury-gold text-xs uppercase tracking-widest font-semibold hover:bg-luxury-gold hover:text-black transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Price rows */}
              <div className="space-y-3 text-xs text-white/70">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="text-white font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-luxury-gold">
                    <span>Voucher Discount</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>White-Glove Insured Delivery</span>
                  <span className="text-white font-medium">
                    {shippingCost === 0 ? 'COMPLIMENTARY' : `₹${shippingCost}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Garment GST & Luxury Cess (12%)</span>
                  <span className="text-white font-medium">₹{tax.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-base font-semibold text-white pt-4 border-t border-white/10">
                  <span className="font-display tracking-wider uppercase">Grand Total</span>
                  <span className="font-serif text-xl text-luxury-gold font-bold">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-luxury-gold text-black font-display text-xs font-semibold tracking-[0.25em] uppercase hover:bg-luxury-gold-light transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.25)]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-white/40">
                <ShieldCheck className="w-3.5 h-3.5 text-luxury-gold" />
                <span>SSL Encrypted &bull; 100% Authentic Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
