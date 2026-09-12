import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, X, Sparkles } from 'lucide-react';
import api from '../services/api';
import { ProductCard } from '../components/shop/ProductCard';
import { QuickViewModal } from '../components/shop/QuickViewModal';

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const popularSearches = [
    'Ivory Sherwani',
    'Bridal Lehenga',
    'Black Tuxedo',
    'Banarasi Saree',
    'Velvet Blazer',
    'Chikankari Kurta',
    'Emerald Gown',
  ];

  // Debounce query input by 400ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      if (query.trim()) {
        setSearchParams({ q: query.trim() });
      } else {
        setSearchParams({});
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [query]);

  // Query API
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setProducts([]);
      return;
    }

    setLoading(true);
    api.get(`/products?search=${encodeURIComponent(debouncedQuery.trim())}`)
      .then(({ data }) => setProducts(data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header and Search Box */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-medium mb-2 block">
            The Haute Archive
          </span>
          <h1 className="font-display text-3xl sm:text-4xl tracking-widest uppercase mb-8">
            Global Collection Search
          </h1>

          <div className="relative">
            <Search className="w-5 h-5 text-luxury-gold absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by garment name, fabric (Silk, Velvet), style or occasion..."
              className="w-full bg-[#141414] border border-white/20 pl-12 pr-10 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-luxury-gold tracking-wide transition-colors"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Popular Tag suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
            <span className="text-white/40 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-luxury-gold" />
              <span>Popular Searches:</span>
            </span>
            {popularSearches.map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-2.5 py-1 bg-white/5 border border-white/10 hover:border-luxury-gold/50 text-white/70 hover:text-luxury-gold transition-colors text-[11px]"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results Section */}
        <div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-white/5 border border-white/10 animate-pulse" />
              ))}
            </div>
          ) : debouncedQuery.trim() === '' ? (
            <div className="text-center py-16 text-white/40 text-xs tracking-widest uppercase">
              Begin typing to query our bespoke bridal and groom ateliers.
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-white/15 p-8 max-w-lg mx-auto">
              <p className="font-display text-xl uppercase tracking-widest text-white mb-2">
                No Creations Matched "{debouncedQuery}"
              </p>
              <p className="text-xs text-white/60 mb-6">
                Our concierges craft custom bespoke pieces upon request. Explore our signature bridal collection or contact our styling atelier.
              </p>
              <div className="flex justify-center gap-4">
                <Link to="/men/sherwanis" className="px-5 py-2.5 bg-luxury-gold text-black text-xs uppercase tracking-widest font-semibold">
                  Men's Sherwanis
                </Link>
                <Link to="/women/bridal" className="px-5 py-2.5 border border-luxury-gold text-luxury-gold text-xs uppercase tracking-widest font-semibold">
                  Bridal Lehengas
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs text-white/60 uppercase tracking-widest mb-6">
                Found <strong className="text-white">{products.length}</strong> creations matching "{debouncedQuery}"
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {products.map((prod) => (
                  <ProductCard
                    key={prod._id}
                    product={prod}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};
