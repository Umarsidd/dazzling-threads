import React, { useState } from 'react';
import { ProductCard } from '../shop/ProductCard';

export const NewArrivals = ({ products, onQuickView }) => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filterTabs = ['All', 'Men', 'Women', 'Bridal', 'Suits', 'Kurta Sets'];

  const filteredProducts = (products || []).filter((p) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Men') return p.gender === 'men';
    if (activeFilter === 'Women') return p.gender === 'women';
    if (activeFilter === 'Bridal') return p.category?.toLowerCase().includes('bridal');
    if (activeFilter === 'Suits') return p.category?.toLowerCase().includes('suit') || p.category?.toLowerCase().includes('tuxedo');
    if (activeFilter === 'Kurta Sets') return p.category?.toLowerCase().includes('kurta');
    return true;
  });

  return (
    <section className="py-20 md:py-28 bg-[#0A0A0A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-medium">
            Autumn / Winter Haute Drop
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-widest uppercase mt-2">
            New Arrivals
          </h2>
          <div className="w-16 h-[1.5px] bg-luxury-gold mt-4 mb-8" />

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-5 py-2 text-xs uppercase tracking-widest font-semibold border transition-all duration-300 ${
                  activeFilter === tab
                    ? 'bg-luxury-gold text-black border-luxury-gold shadow-md'
                    : 'bg-transparent text-white/70 border-white/10 hover:border-luxury-gold/60 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} onQuickView={onQuickView} />
          ))}
        </div>
      </div>
    </section>
  );
};
