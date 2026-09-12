import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

export const ProductCard = ({ product, onQuickView }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  if (!product) return null;

  const isWishlisted = isInWishlist(product._id);
  const primaryImg = (product.images && product.images[0]) || '/logo.png';
  const secondaryImg = (product.images && product.images[1]) || primaryImg;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    const defaultSize = (product.sizes && product.sizes[0]) || 'M';
    addToCart(product, 1, defaultSize);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      className="group relative flex flex-col bg-[#111111] border border-white/10 hover:border-luxury-gold/50 transition-all duration-500 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <Link to={`/product/${product.slug}`} className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900 block">
        <img
          src={isHovered ? secondaryImg : primaryImg}
          alt={product.name}
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges: Out of stock, Low stock, New Arrival, Sale */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {isOutOfStock ? (
            <span className="bg-red-900/90 text-red-200 text-[10px] font-semibold uppercase px-2 py-0.5 tracking-widest border border-red-700">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-900/90 text-amber-200 text-[10px] font-semibold uppercase px-2 py-0.5 tracking-widest border border-amber-700">
              Only {product.stock} Left
            </span>
          ) : product.newArrival ? (
            <span className="bg-black/80 text-luxury-gold text-[10px] font-semibold uppercase px-2.5 py-0.5 tracking-widest border border-luxury-gold/40">
              New Arrival
            </span>
          ) : null}

          {product.salePrice && (
            <span className="bg-luxury-crimson/90 text-white text-[10px] font-semibold uppercase px-2 py-0.5 tracking-widest">
              Save {Math.round(((product.price - product.salePrice) / product.price) * 100)}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            isWishlisted
              ? 'bg-luxury-gold text-black shadow-lg'
              : 'bg-black/60 text-white hover:bg-white hover:text-black'
          }`}
          aria-label="Toggle Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-black' : ''}`} />
        </button>

        {/* Quick Hover Actions Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className="flex-1 py-2 bg-luxury-gold text-black text-[11px] uppercase tracking-widest font-semibold hover:bg-luxury-gold-light transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? 'Sold Out' : 'Quick Bag'}</span>
          </button>
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="px-2.5 py-2 bg-black/80 border border-white/20 text-white hover:border-luxury-gold hover:text-luxury-gold transition-colors"
              aria-label="Quick View"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-2">
        <div>
          <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-white/50 mb-1">
            <span>{product.category}</span>
            <div className="flex items-center gap-1 text-luxury-gold">
              <Star className="w-3 h-3 fill-luxury-gold" />
              <span>{product.rating ? product.rating.toFixed(1) : '5.0'}</span>
            </div>
          </div>

          <Link
            to={`/product/${product.slug}`}
            className="font-display text-sm tracking-wider text-white hover:text-luxury-gold transition-colors line-clamp-1"
          >
            {product.name}
          </Link>

          <p className="text-[11px] text-white/40 italic font-serif line-clamp-1 mt-0.5">
            {product.fabric || 'Pure Silk & Handcrafted Zari'}
          </p>
        </div>

        {/* Price display */}
        <div className="flex items-baseline gap-2 pt-1 border-t border-white/5">
          {product.salePrice ? (
            <>
              <span className="font-serif text-base font-semibold text-luxury-gold">
                ₹{product.salePrice.toLocaleString('en-IN')}
              </span>
              <span className="font-serif text-xs text-white/40 line-through">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            </>
          ) : (
            <span className="font-serif text-base font-semibold text-luxury-gold">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
