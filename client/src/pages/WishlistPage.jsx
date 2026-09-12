import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export const WishlistPage = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToBag = (product) => {
    const size = (product.sizes && product.sizes[0]) || 'M';
    addToCart(product, 1, size);
    toggleWishlist(product);
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[80vh] bg-[#0A0A0A] text-white pt-32 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <Heart className="w-16 h-16 text-luxury-gold/30 mx-auto mb-4 stroke-1" />
          <h1 className="font-display text-2xl sm:text-3xl tracking-widest uppercase mb-3">
            Your Wishlist is Empty
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mb-8 font-sans">
            Save your favorite bespoke sherwanis, bridal lehengas, and couture gowns to review anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/men"
              className="px-6 py-3 bg-luxury-gold text-black text-xs uppercase tracking-widest font-semibold hover:bg-luxury-gold-light transition-colors"
            >
              Men's Atelier
            </Link>
            <Link
              to="/women/bridal"
              className="px-6 py-3 border border-luxury-gold text-luxury-gold text-xs uppercase tracking-widest font-semibold hover:bg-luxury-gold hover:text-black transition-colors"
            >
              Bridal Sanctuary
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-6 border-b border-white/10 mb-10 flex items-end justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-medium">Saved Creations</span>
            <h1 className="font-display text-3xl sm:text-4xl tracking-widest uppercase mt-1">
              Your Private Wishlist
            </h1>
          </div>
          <span className="text-xs uppercase tracking-widest text-white/60">
            {wishlist.length} Items Saved
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {wishlist.map((product) => {
            const currentPrice = product.salePrice || product.price || 0;
            const primaryImg = (product.images && product.images[0]) || '/logo.png';

            return (
              <div
                key={product._id}
                className="group relative bg-[#111111] border border-white/10 hover:border-luxury-gold/50 flex flex-col justify-between overflow-hidden transition-all duration-300"
              >
                <div>
                  <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900">
                    <img
                      src={primaryImg}
                      alt={product.name}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-3 right-3 p-2 bg-black/60 rounded-full text-white hover:text-red-400 transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4">
                    <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-medium">
                      {product.gender} &bull; {product.category}
                    </span>
                    <Link
                      to={`/product/${product.slug}`}
                      className="font-display text-sm tracking-wider text-white hover:text-luxury-gold transition-colors line-clamp-1 mt-1 block"
                    >
                      {product.name}
                    </Link>
                    <p className="font-serif text-base font-semibold text-luxury-gold mt-2">
                      ₹{currentPrice.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => handleMoveToBag(product)}
                    className="w-full py-2.5 bg-luxury-gold text-black text-xs uppercase tracking-widest font-semibold hover:bg-luxury-gold-light transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Shopping Bag</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
