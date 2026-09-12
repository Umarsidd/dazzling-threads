import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const FeaturedCollections = () => {
  return (
    <section className="py-20 md:py-28 bg-[#0A0A0A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-medium">
            Curated Expressions
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-widest uppercase mt-2 text-white">
            Featured Collections
          </h2>
          <div className="w-16 h-[1.5px] bg-luxury-gold mx-auto mt-4" />
        </div>

        {/* Dual Editorial Grid: Men & Women */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Men's Luxury Card */}
          <div className="group relative overflow-hidden bg-neutral-900 border border-white/10 flex flex-col justify-end min-h-[500px] lg:min-h-[600px] p-8 sm:p-12">
            <img
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85"
              alt="Men's Luxury Wardrobe"
              className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-1000 ease-out group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            <div className="relative z-10 flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.25em] text-luxury-gold font-semibold mb-2">
                The Gentleman's Atelier
              </span>
              <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl tracking-wider uppercase mb-3">
                Men's Royal Wardrobe
              </h3>
              <p className="text-xs sm:text-sm text-white/70 max-w-md mb-6 leading-relaxed font-sans">
                Imperial tuxedos in Italian wool, hand-embroidered wedding sherwanis, bespoke bandhgalas, and pure silk kurtas.
              </p>
              <Link
                to="/men"
                className="px-6 py-3 border border-luxury-gold text-luxury-gold text-xs uppercase tracking-[0.2em] font-medium hover:bg-luxury-gold hover:text-black transition-all duration-300 flex items-center gap-2 group-hover:bg-luxury-gold group-hover:text-black"
              >
                <span>Explore Men's Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Women's Luxury Card */}
          <div className="group relative overflow-hidden bg-neutral-900 border border-white/10 flex flex-col justify-end min-h-[500px] lg:min-h-[600px] p-8 sm:p-12">
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85"
              alt="Women's Couture & Bridal"
              className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-1000 ease-out group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            <div className="relative z-10 flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.25em] text-luxury-gold font-semibold mb-2">
                Haute Dulhan House
              </span>
              <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl tracking-wider uppercase mb-3">
                Women's Bridal & Couture
              </h3>
              <p className="text-xs sm:text-sm text-white/70 max-w-md mb-6 leading-relaxed font-sans">
                Heirloom zardozi bridal lehengas, pure Kanjeevaram gold silks, sculpted crystal gowns, and regal shararas.
              </p>
              <Link
                to="/women"
                className="px-6 py-3 border border-luxury-gold text-luxury-gold text-xs uppercase tracking-[0.2em] font-medium hover:bg-luxury-gold hover:text-black transition-all duration-300 flex items-center gap-2 group-hover:bg-luxury-gold group-hover:text-black"
              >
                <span>Explore Women's Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Micro Category Tiles below */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <Link
            to="/men/sherwanis"
            className="group relative h-48 border border-white/10 overflow-hidden flex items-end p-5"
          >
            <img
              src="https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80"
              alt="Groom Sherwanis"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="relative z-10">
              <p className="font-display text-sm tracking-wider uppercase group-hover:text-luxury-gold transition-colors">
                Royal Sherwanis
              </p>
              <span className="text-[10px] text-white/60 uppercase tracking-widest font-serif">Explore &rarr;</span>
            </div>
          </Link>

          <Link
            to="/men/tuxedos"
            className="group relative h-48 border border-white/10 overflow-hidden flex items-end p-5"
          >
            <img
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80"
              alt="Imperial Tuxedos"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="relative z-10">
              <p className="font-display text-sm tracking-wider uppercase group-hover:text-luxury-gold transition-colors">
                Imperial Tuxedos
              </p>
              <span className="text-[10px] text-white/60 uppercase tracking-widest font-serif">Explore &rarr;</span>
            </div>
          </Link>

          <Link
            to="/women/bridal"
            className="group relative h-48 border border-white/10 overflow-hidden flex items-end p-5"
          >
            <img
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80"
              alt="Bridal Lehengas"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="relative z-10">
              <p className="font-display text-sm tracking-wider uppercase group-hover:text-luxury-gold transition-colors">
                Bridal Lehengas
              </p>
              <span className="text-[10px] text-white/60 uppercase tracking-widest font-serif">Explore &rarr;</span>
            </div>
          </Link>

          <Link
            to="/women/sarees"
            className="group relative h-48 border border-white/10 overflow-hidden flex items-end p-5"
          >
            <img
              src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80"
              alt="Heritage Sarees"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="relative z-10">
              <p className="font-display text-sm tracking-wider uppercase group-hover:text-luxury-gold transition-colors">
                Heirloom Sarees
              </p>
              <span className="text-[10px] text-white/60 uppercase tracking-widest font-serif">Explore &rarr;</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};
