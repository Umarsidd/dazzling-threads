import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export const BridalSection = () => {
  return (
    <section className="relative py-24 md:py-36 bg-[#0B0608] text-white overflow-hidden border-t border-b border-luxury-gold/30">
      {/* Background Subtle Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1800&q=80"
          alt="Bridal Background"
          className="w-full h-full object-cover filter blur-sm scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0608] via-[#0B0608]/90 to-[#0B0608]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Bridal Editorial Story */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="flex items-center gap-2 px-3 py-1 border border-luxury-crimson bg-luxury-crimson/30 rounded-full mb-6">
              <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
              <span className="text-xs uppercase tracking-[0.3em] text-luxury-gold-light font-semibold">
                Dulha Dulhan House Exclusive
              </span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-wider uppercase font-light mb-6 leading-tight">
              THE BRIDAL <span className="gold-gradient-text font-normal">SANCTUARY</span>
            </h2>

            <p className="font-serif italic text-lg sm:text-xl text-luxury-gold-light/90 mb-6 font-light leading-relaxed">
              “Every stitch holds a vow; every thread weaves a legacy.”
            </p>

            <p className="text-xs sm:text-sm text-white/70 max-w-xl leading-relaxed mb-8 font-sans">
              From majestic 24-kali crimson velvet lehengas encrusted with pure Basra pearl and salma sitara, to cathedral-length sculpted crystal reception gowns. Dazzling Threads crafts couture masterpieces for the bride destined to illuminate the room.
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <Link
                to="/women/bridal"
                className="px-8 py-4 bg-luxury-gold text-black font-display text-xs tracking-[0.25em] uppercase font-semibold hover:bg-luxury-gold-light transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.25)] flex items-center gap-2"
              >
                <span>Discover Bridal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/women/sarees"
                className="px-8 py-4 border border-white/30 text-white font-display text-xs tracking-[0.25em] uppercase font-medium hover:border-luxury-gold hover:text-luxury-gold transition-colors"
              >
                <span>Heirloom Silks</span>
              </Link>
            </div>
          </div>

          {/* Right: Layered Bridal Editorial Images */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              {/* Primary Image */}
              <div className="aspect-[3/4] overflow-hidden border-2 border-luxury-gold/40 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85"
                  alt="Dulhan Bridal Lehenga"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Offset Secondary Accent Card */}
              <div className="hidden sm:block absolute -bottom-8 -left-8 w-44 h-56 border border-luxury-gold/60 bg-black/80 p-2 shadow-2xl z-20 backdrop-blur-sm">
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80"
                  alt="Zardozi Detail"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Gold Crest watermark */}
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full border border-luxury-gold/30 p-2 bg-black/70 backdrop-blur-sm flex items-center justify-center z-20">
                <img src="/logo.png" alt="dt Crest" className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
