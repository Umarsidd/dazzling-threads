import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Star, ShoppingBag, Heart, Check, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const QuickViewModal = ({ product, onClose }) => {
  if (!product) return null;

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState((product.images && product.images[0]) || '/logo.png');
  const [selectedSize, setSelectedSize] = useState((product.sizes && product.sizes[0]) || 'M');
  const [quantity, setQuantity] = useState(1);

  const isWishlisted = isInWishlist(product._id);
  const activePrice = product.salePrice || product.price;

  const handleAddToBag = () => {
    addToCart(product, quantity, selectedSize);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-[#111111] border border-luxury-gold/40 shadow-2xl overflow-hidden z-10 animate-fade-in max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-white/60 hover:text-white p-1 bg-black/40 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Images */}
        <div className="md:w-1/2 p-6 flex flex-col items-center justify-center bg-black/40">
          <div className="w-full aspect-[3/4] overflow-hidden border border-white/10 mb-4">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-top"
            />
          </div>
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto w-full pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-14 h-16 border shrink-0 transition-all ${
                    selectedImage === img ? 'border-luxury-gold scale-105' : 'border-white/20 opacity-60'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details & Buying options */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between text-xs text-luxury-gold/80 tracking-widest uppercase mb-1">
              <span>{product.gender} &bull; {product.category}</span>
              <div className="flex items-center gap-1 text-luxury-gold">
                <Star className="w-3.5 h-3.5 fill-luxury-gold" />
                <span className="font-semibold">{product.rating ? product.rating.toFixed(1) : '5.0'}</span>
              </div>
            </div>

            <h2 className="font-display text-xl sm:text-2xl tracking-wider text-white mb-2">
              {product.name}
            </h2>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-serif text-2xl font-bold text-luxury-gold">
                ₹{activePrice.toLocaleString('en-IN')}
              </span>
              {product.salePrice && (
                <span className="font-serif text-sm text-white/40 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <p className="text-xs text-white/70 leading-relaxed font-sans mb-5 line-clamp-3">
              {product.description}
            </p>

            {/* Fabric specification */}
            <div className="text-xs mb-5 p-2.5 bg-white/5 border border-white/10 flex items-center justify-between">
              <span className="text-white/60">Fabric:</span>
              <span className="text-luxury-gold font-medium">{product.fabric || 'Pure Heritage Silk'}</span>
            </div>

            {/* Size Matrix */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-widest text-white/80 font-medium">Select Size</span>
                <Link
                  to={`/product/${product.slug}`}
                  onClick={onClose}
                  className="text-[11px] text-luxury-gold hover:underline"
                >
                  Size Guide & Custom Tailoring
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider border transition-all ${
                      selectedSize === size
                        ? 'bg-luxury-gold text-black border-luxury-gold'
                        : 'bg-transparent text-white border-white/20 hover:border-luxury-gold'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <div className="flex gap-3">
              <button
                onClick={handleAddToBag}
                disabled={product.stock <= 0}
                className="flex-1 py-3 bg-luxury-gold text-black font-display text-xs font-semibold tracking-[0.2em] uppercase hover:bg-luxury-gold-light transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{product.stock <= 0 ? 'Out of Stock' : 'Add to Shopping Bag'}</span>
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 border transition-colors ${
                  isWishlisted
                    ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/10'
                    : 'border-white/20 text-white hover:border-white'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-luxury-gold' : ''}`} />
              </button>
            </div>

            <Link
              to={`/product/${product.slug}`}
              onClick={onClose}
              className="w-full py-2.5 border border-white/20 text-white/80 hover:text-white hover:border-white text-xs tracking-widest uppercase flex items-center justify-center gap-1.5 transition-colors text-center"
            >
              <span>View Full Editorial Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
