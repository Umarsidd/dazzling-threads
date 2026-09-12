import React from 'react';
import { Star, Instagram, Quote } from 'lucide-react';

export const SocialAndTestimonials = () => {
  const testimonials = [
    {
      quote: 'Wearing the Empress Noor lehenga at our Lake Palace wedding was genuinely the dream of a lifetime. The richness of the velvet and gold dabka left everyone speechless.',
      name: 'Princess Ananya Singhania',
      occasion: 'Grand Udaipur Palace Wedding',
      city: 'Mumbai & Udaipur',
      rating: 5,
    },
    {
      quote: 'The craftsmanship of the Royal Sovereign Sherwani was unmatched. The cut, the shoulder taper, and the subtle antique zardozi work made me feel truly regal.',
      name: 'Raghavendra Rathore',
      occasion: 'Groom Couture Reception',
      city: 'New Delhi',
      rating: 5,
    },
    {
      quote: 'The Celeste Emerald gown sculpted my reception look flawlessly. The weight of the hand-embroidered crystals and the fluted train felt straight out of Cannes.',
      name: 'Meera Kapadia',
      occasion: 'Sangeet & Reception Gala',
      city: 'Bangalore',
      rating: 5,
    },
  ];

  const galleryImages = [
    {
      url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
      tag: '#DazzlingBride',
    },
    {
      url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80',
      tag: '#DulhaHouse',
    },
    {
      url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      tag: '#ZardoziCouture',
    },
    {
      url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
      tag: '#BlackTieGala',
    },
    {
      url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
      tag: '#HeirloomWeaves',
    },
    {
      url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
      tag: '#RoyalSovereign',
    },
  ];

  return (
    <div className="bg-[#090909] text-white">
      {/* Testimonials Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-medium">
            The Royal Chronicles
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-widest uppercase mt-2">
            Words of Devotion
          </h2>
          <div className="w-16 h-[1.5px] bg-luxury-gold mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-8 bg-[#121212] border border-white/10 relative flex flex-col justify-between hover:border-luxury-gold/40 transition-colors"
            >
              <Quote className="w-8 h-8 text-luxury-gold/30 mb-4 stroke-1" />
              <p className="font-serif italic text-sm sm:text-base text-white/80 leading-relaxed mb-6 font-light">
                “{t.quote}”
              </p>
              <div>
                <div className="flex gap-1 text-luxury-gold mb-2">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-luxury-gold" />
                  ))}
                </div>
                <h4 className="font-display text-xs uppercase tracking-wider font-semibold text-white">
                  {t.name}
                </h4>
                <p className="text-[11px] text-luxury-gold/80 font-sans mt-0.5">{t.occasion}</p>
                <p className="text-[10px] text-white/40">{t.city}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Editorial Instagram Gallery */}
      <section className="py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-medium">
              Join The Visual Tapestry
            </span>
            <h3 className="font-display text-2xl sm:text-3xl tracking-widest uppercase mt-1">
              @DazzlingThreadsCouture
            </h3>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-luxury-gold hover:underline font-semibold"
          >
            <Instagram className="w-4 h-4" />
            <span>Follow on Instagram</span>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {galleryImages.map((img, idx) => (
            <div
              key={idx}
              className="group relative aspect-square overflow-hidden border border-white/10"
            >
              <img
                src={img.url}
                alt="Social gallery"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-center">
                <Instagram className="w-5 h-5 text-luxury-gold mb-1" />
                <span className="text-[10px] uppercase tracking-wider text-white font-medium">
                  {img.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
