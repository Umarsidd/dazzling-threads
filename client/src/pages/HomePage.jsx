import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { CinematicEntrance } from '../components/home/CinematicEntrance';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturedCollections } from '../components/home/FeaturedCollections';
import { TrendingCarousel } from '../components/home/TrendingCarousel';
import { BridalSection } from '../components/home/BridalSection';
import { BrandStory } from '../components/home/BrandStory';
import { NewArrivals } from '../components/home/NewArrivals';
import { SocialAndTestimonials } from '../components/home/SocialAndTestimonials';
import { QuickViewModal } from '../components/shop/QuickViewModal';

export const HomePage = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    // Load trending and new arrivals
    api.get('/products/collections/trending')
      .then(({ data }) => setTrendingProducts(data.products || []))
      .catch(() => {});

    api.get('/products/collections/new-arrivals')
      .then(({ data }) => setNewArrivals(data.products || []))
      .catch(() => {});
  }, []);

  return (
    <div className="bg-[#070707] text-white min-h-screen">
      {/* Signature GSAP Cinematic Scrolling Entrance */}
      <CinematicEntrance />

      {/* Hero Section */}
      <HeroSection />

      {/* Featured Collections */}
      <FeaturedCollections />

      {/* Couture Spotlight (Trending) */}
      <TrendingCarousel
        products={trendingProducts}
        onQuickView={(prod) => setQuickViewProduct(prod)}
      />

      {/* Dedicated Bridal House Section */}
      <BridalSection />

      {/* Threads of Elegance Brand Heritage Story */}
      <BrandStory />

      {/* Autumn/Winter New Arrivals with Filter Tabs */}
      <NewArrivals
        products={newArrivals}
        onQuickView={(prod) => setQuickViewProduct(prod)}
      />

      {/* Testimonials and Social Tapestry */}
      <SocialAndTestimonials />

      {/* Interactive Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};
