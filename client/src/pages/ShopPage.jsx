import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Filter, X, SlidersHorizontal, ArrowUpDown, ChevronDown, Check } from 'lucide-react';
import api from '../services/api';
import { ProductCard } from '../components/shop/ProductCard';
import { QuickViewModal } from '../components/shop/QuickViewModal';

export const ShopPage = ({ gender = 'men' }) => {
  const { category: routeCategory } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState(routeCategory || searchParams.get('category') || '');
  const [selectedSizes, setSelectedSizes] = useState(searchParams.get('size') ? searchParams.get('size').split(',') : []);
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('inStock') === 'true');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  // Update selected category if route param changes
  useEffect(() => {
    if (routeCategory) {
      setSelectedCategory(routeCategory);
    }
  }, [routeCategory]);

  // Fetch categories for this gender
  useEffect(() => {
    api.get(`/categories?gender=${gender}`)
      .then(({ data }) => setCategories(data.categories || []))
      .catch(() => {});
  }, [gender]);

  // Fetch filtered products
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('gender', gender);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedSizes.length > 0) params.set('size', selectedSizes.join(','));
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (inStockOnly) params.set('inStock', 'true');
    if (sort) params.set('sort', sort);

    api.get(`/products?${params.toString()}`)
      .then(({ data }) => {
        setProducts(data.products || []);
        setTotalCount(data.total || 0);
      })
      .catch(() => {
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [gender, selectedCategory, selectedSizes, minPrice, maxPrice, inStockOnly, sort]);

  const toggleSize = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedSizes([]);
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setSort('newest');
  };

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom'];

  const isMen = gender === 'men';
  const heroTitle = isMen ? 'THE ART OF THE MODERN GENTLEMAN' : 'MADE TO MAKE AN ENTRANCE';
  const heroSubtitle = isMen
    ? 'Hand-tailored sherwanis, imperial black-tie tuxedos, sculpted bandhgalas and pure silk festive wear.'
    : 'Heirloom bridal lehengas, temple Kanjeevaram weaves, dramatic reception gowns and royal trousseau.';
  const heroBannerImg = isMen
    ? 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=2000&q=85'
    : 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=2000&q=85';

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen pt-20">
      {/* Editorial Category Hero Banner */}
      <div className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden border-b border-white/10">
        <img
          src={heroBannerImg}
          alt={heroTitle}
          className="absolute inset-0 w-full h-full object-cover filter brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/40 to-black/70" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-medium mb-2 block">
            {isMen ? "Men's Royal Collection" : "Women's Couture & Bridal"}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-widest uppercase font-light drop-shadow-lg">
            {heroTitle}
          </h1>
          <p className="font-serif italic text-sm sm:text-base text-white/80 max-w-2xl mx-auto mt-3 font-light">
            {heroSubtitle}
          </p>
        </div>
      </div>

      {/* Main Container: Sidebar + Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Control Bar: Total Count, Mobile Filter Trigger, Sort Dropdown */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 border border-white/20 text-xs uppercase tracking-wider text-luxury-gold"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <span className="text-xs text-white/60 uppercase tracking-widest font-sans">
              Showing <strong className="text-white">{totalCount}</strong> Creations
            </span>
          </div>

          {/* Sort Controller */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-white/50 uppercase tracking-widest">Sort By:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-[#141414] border border-white/15 text-xs uppercase tracking-wider text-white px-3 py-2 focus:outline-none focus:border-luxury-gold cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="popular">Most Desired</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        <div className="flex gap-10">
          {/* Left Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-8">
            {/* Clear All action */}
            {(selectedCategory || selectedSizes.length > 0 || minPrice || maxPrice || inStockOnly) && (
              <button
                onClick={clearAllFilters}
                className="w-full py-2 border border-luxury-gold/50 text-luxury-gold text-xs uppercase tracking-widest font-medium hover:bg-luxury-gold hover:text-black transition-colors"
              >
                Reset All Filters
              </button>
            )}

            {/* Categories */}
            <div>
              <h3 className="font-display text-xs uppercase tracking-[0.25em] text-luxury-gold font-semibold mb-3">
                Categories
              </h3>
              <ul className="space-y-2 text-xs text-white/70">
                <li>
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left py-1 transition-colors ${
                      !selectedCategory ? 'text-luxury-gold font-semibold' : 'hover:text-white'
                    }`}
                  >
                    All {isMen ? 'Gentleman' : 'Couture'}
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat._id}>
                    <button
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`w-full text-left py-1 transition-colors flex items-center justify-between ${
                        selectedCategory.toLowerCase() === cat.name.toLowerCase() ||
                        selectedCategory.toLowerCase() === cat.slug.toLowerCase()
                          ? 'text-luxury-gold font-semibold'
                          : 'hover:text-white'
                      }`}
                    >
                      <span>{cat.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-display text-xs uppercase tracking-[0.25em] text-luxury-gold font-semibold mb-3">
                Price (INR)
              </h3>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-[#141414] border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-luxury-gold"
                />
                <span className="text-white/40">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-[#141414] border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-luxury-gold"
                />
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="font-display text-xs uppercase tracking-[0.25em] text-luxury-gold font-semibold mb-3">
                Available Sizes
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {availableSizes.map((sz) => {
                  const isSelected = selectedSizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      onClick={() => toggleSize(sz)}
                      className={`py-1.5 text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-luxury-gold text-black border-luxury-gold'
                          : 'border-white/15 text-white/70 hover:border-luxury-gold hover:text-white'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-white/80">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-white/20 text-luxury-gold focus:ring-luxury-gold"
                />
                <span>In-Stock Pieces Only</span>
              </label>
            </div>
          </aside>

          {/* Right Product Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse border border-white/10" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="py-24 text-center border border-dashed border-white/20 p-8">
                <p className="font-display text-xl tracking-widest uppercase text-white mb-2">
                  No Matching Creations Found
                </p>
                <p className="text-xs text-white/60 mb-6 font-sans">
                  Try adjusting your filters or price boundaries.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-luxury-gold text-black text-xs uppercase tracking-widest font-semibold hover:bg-luxury-gold-light transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {products.map((prod) => (
                  <ProductCard
                    key={prod._id}
                    product={prod}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Drawer Filters */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative w-4/5 max-w-sm ml-auto bg-[#111111] border-l border-luxury-gold/40 h-full p-6 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <h3 className="font-display text-base tracking-widest uppercase text-white">Refine Catalog</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="text-white/60 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile filter controls */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-luxury-gold font-semibold mb-2">Category</h4>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-[#181818] border border-white/20 p-2 text-xs text-white"
                  >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-widest text-luxury-gold font-semibold mb-2">Sizes</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {availableSizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => toggleSize(sz)}
                        className={`py-1.5 text-xs font-semibold border ${
                          selectedSizes.includes(sz) ? 'bg-luxury-gold text-black border-luxury-gold' : 'border-white/20 text-white'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-widest text-luxury-gold font-semibold mb-2">Price Boundary</h4>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full bg-[#181818] border border-white/20 p-2 text-xs text-white"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full bg-[#181818] border border-white/20 p-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex gap-2">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-3 border border-white/20 text-white text-xs uppercase tracking-widest"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-3 bg-luxury-gold text-black text-xs uppercase tracking-widest font-semibold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};
