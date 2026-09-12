import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { ProductCard } from '../shop/ProductCard';

export const TrendingCarousel = ({ products, onQuickView }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-[#0D0D0D] text-white border-t border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-luxury-gold text-xs uppercase tracking-[0.3em] font-medium mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Couture Spotlight</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-widest uppercase text-white">
              Trending Creations
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 border border-white/20 hover:border-luxury-gold hover:text-luxury-gold flex items-center justify-center transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 border border-white/20 hover:border-luxury-gold hover:text-luxury-gold flex items-center justify-center transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((prod) => (
            <div key={prod._id} className="w-[280px] sm:w-[320px] shrink-0 snap-start">
              <ProductCard product={prod} onQuickView={onQuickView} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
