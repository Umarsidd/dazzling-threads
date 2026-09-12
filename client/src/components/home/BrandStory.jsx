import React from 'react';
import { Compass, Feather, Sparkles, Gem } from 'lucide-react';

export const BrandStory = () => {
  return (
    <section className="py-24 md:py-36 bg-[#080808] text-white border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-medium">
            The Heritage &bull; Dulha Dulhan House
          </span>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl tracking-widest uppercase mt-3 mb-6">
            THREADS OF <span className="gold-gradient-text">ELEGANCE</span>
          </h2>
          <div className="w-20 h-[1.5px] bg-luxury-gold mx-auto mb-8" />
          <p className="font-serif italic text-base sm:text-xl text-white/80 leading-relaxed font-light">
            “True luxury is not merely manufactured; it is consecrated through hundreds of patient artisan hours, sacred weaves, and unrelenting precision.”
          </p>
        </div>

        {/* 4 Pillars of Dazzling Threads */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-8 bg-[#111111] border border-white/10 hover:border-luxury-gold/50 transition-colors flex flex-col items-center text-center group">
            <div className="w-12 h-12 rounded-full border border-luxury-gold/40 flex items-center justify-center mb-6 group-hover:bg-luxury-gold group-hover:text-black transition-colors text-luxury-gold">
              <Feather className="w-5 h-5" />
            </div>
            <h3 className="font-display text-sm tracking-widest uppercase mb-3 font-semibold text-white">
              Heritage Weaves
            </h3>
            <p className="text-xs text-white/60 leading-relaxed font-sans">
              Handloom Mulberry silks, authentic Varanasi Kadhwa brocades, and certified silver zari passed through master weavers over centuries.
            </p>
          </div>

          <div className="p-8 bg-[#111111] border border-white/10 hover:border-luxury-gold/50 transition-colors flex flex-col items-center text-center group">
            <div className="w-12 h-12 rounded-full border border-luxury-gold/40 flex items-center justify-center mb-6 group-hover:bg-luxury-gold group-hover:text-black transition-colors text-luxury-gold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-display text-sm tracking-widest uppercase mb-3 font-semibold text-white">
              Zardozi Artistry
            </h3>
            <p className="text-xs text-white/60 leading-relaxed font-sans">
              Every dabka, nakshi, french knot, and mukaish dot is meticulously hand-stitched by generational artisans over 400+ hours.
            </p>
          </div>

          <div className="p-8 bg-[#111111] border border-white/10 hover:border-luxury-gold/50 transition-colors flex flex-col items-center text-center group">
            <div className="w-12 h-12 rounded-full border border-luxury-gold/40 flex items-center justify-center mb-6 group-hover:bg-luxury-gold group-hover:text-black transition-colors text-luxury-gold">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-display text-sm tracking-widest uppercase mb-3 font-semibold text-white">
              Bespoke Sculpting
            </h3>
            <p className="text-xs text-white/60 leading-relaxed font-sans">
              Equestrian shoulder contours, tapered Italian silhouettes, and personalized made-to-measure bridal kalis tailored to perfection.
            </p>
          </div>

          <div className="p-8 bg-[#111111] border border-white/10 hover:border-luxury-gold/50 transition-colors flex flex-col items-center text-center group">
            <div className="w-12 h-12 rounded-full border border-luxury-gold/40 flex items-center justify-center mb-6 group-hover:bg-luxury-gold group-hover:text-black transition-colors text-luxury-gold">
              <Gem className="w-5 h-5" />
            </div>
            <h3 className="font-display text-sm tracking-widest uppercase mb-3 font-semibold text-white">
              Couture Exclusivity
            </h3>
            <p className="text-xs text-white/60 leading-relaxed font-sans">
              Strictly limited seasonal production runs ensure that no bride or groom ever shares their signature statement piece.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
