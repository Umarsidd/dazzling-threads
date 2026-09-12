import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-black text-white">
      {/* Background Image with Dark Vignette & Gold Tint */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=2000&q=90"
          alt="Dazzling Threads Luxury Bridal & Groom Wear"
          className="w-full h-full object-cover object-center scale-105 animate-[float_16s_ease-in-out_infinite] opacity-65 filter brightness-75"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)]" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16 flex flex-col items-center">
        {/* Subtle Crest Emblem */}
        <div className="flex items-center gap-2 px-3 py-1 border border-luxury-gold/40 bg-black/50 backdrop-blur-sm rounded-full mb-6">
          <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-luxury-gold-light font-medium">
            Dulha Dulhan House &bull; Haute Couture
          </span>
        </div>

        {/* Main Editorial Headline */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.2em] uppercase font-light leading-none mb-6 drop-shadow-2xl">
          CRAFTED TO <span className="gold-gradient-text font-normal">DAZZLE</span>
        </h1>

        {/* Supporting Tagline */}
        <p className="font-serif italic text-base sm:text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-10 tracking-wide leading-relaxed font-light">
          “Luxury clothing designed for moments that deserve to be remembered forever.”
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            to="/men"
            className="w-full sm:w-auto px-8 py-3.5 bg-luxury-gold text-black font-display text-xs tracking-[0.25em] uppercase font-semibold hover:bg-luxury-gold-light transition-all duration-300 shadow-[0_0_25px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 group"
          >
            <span>Shop Men</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <Link
            to="/women"
            className="w-full sm:w-auto px-8 py-3.5 border border-white/40 text-white font-display text-xs tracking-[0.25em] uppercase font-medium hover:border-luxury-gold hover:text-luxury-gold hover:bg-black/60 transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2"
          >
            <span>Shop Women</span>
          </Link>

          <Link
            to="/women/bridal"
            className="w-full sm:w-auto px-8 py-3.5 border border-luxury-gold/50 bg-luxury-crimson/80 text-luxury-gold-light font-display text-xs tracking-[0.25em] uppercase font-semibold hover:bg-luxury-crimson transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>Bridal House</span>
          </Link>
        </div>
      </div>

      {/* Bottom Floating Badges */}
      <div className="absolute bottom-6 left-0 right-0 hidden md:flex justify-between max-w-7xl mx-auto px-8 text-[11px] text-white/50 tracking-widest uppercase font-sans">
        <span>Bespoke Indian Tailoring</span>
        <span className="text-luxury-gold">Heirloom Handloom & 24K Gold Zari</span>
        <span>Global White-Glove Delivery</span>
      </div>
    </section>
  );
};
