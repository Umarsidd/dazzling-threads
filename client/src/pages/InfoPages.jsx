import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, ShieldCheck, Award, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';

// ABOUT PAGE
export const AboutPage = () => (
  <div className="bg-[#0A0A0A] text-white min-h-screen pt-28 pb-24">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-medium">
          Since Inception &bull; Dulha Dulhan House
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-widest uppercase mt-3 mb-6">
          THE LEGACY OF <span className="gold-gradient-text">DAZZLING THREADS</span>
        </h1>
        <div className="w-20 h-[1.5px] bg-luxury-gold mx-auto mb-8" />
        <p className="font-serif italic text-lg sm:text-xl text-white/80 font-light leading-relaxed">
          “Where ancestral Indian textile heritage meets bespoke contemporary sartorial majesty.”
        </p>
      </div>

      <div className="space-y-12 text-sm sm:text-base text-white/80 leading-relaxed font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="font-display text-xl uppercase tracking-wider text-luxury-gold">
              The Dulha Dulhan Heritage
            </h2>
            <p>
              Founded with the vision to preserve and elevate authentic royal wedding traditions, Dazzling Threads (Dulha Dulhan House) is celebrated for crafting ceremonial garments that command prestige, grace, and enduring majesty.
            </p>
            <p>
              For generations, our house has outfitted discerning patrons, aristocratic families, and couples embarking on sacred matrimonial vows.
            </p>
          </div>
          <div className="aspect-[4/3] overflow-hidden border border-luxury-gold/40">
            <img
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80"
              alt="Atelier Craftsman"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center md:flex-row-reverse">
          <div className="aspect-[4/3] overflow-hidden border border-luxury-gold/40 order-2 md:order-1">
            <img
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80"
              alt="Bridal Embroidery"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-4 order-1 md:order-2">
            <h2 className="font-display text-xl uppercase tracking-wider text-luxury-gold">
              Artisanal Handcrafting
            </h2>
            <p>
              Each garment in our collection is an investment piece. A single bridal lehenga or royal sherwani undergoes between 300 to 500 hours of delicate handwork by our generational karigars in Varanasi, Lucknow, and Bengal.
            </p>
            <p>
              From real 24k gold zari wires and natural dyes to authentic Basra pearls, we never compromise on provenance and fabric purity.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// CONTACT PAGE
export const ContactPage = () => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: 'Bridal Couture', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    addToast('Your appointment request has been scheduled with our Master Concierge.', 'success');
    setFormData({ name: '', email: '', phone: '', service: 'Bridal Couture', message: '' });
  };

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-medium">Bespoke Consultations</span>
          <h1 className="font-display text-4xl tracking-widest uppercase mt-2">Private Concierge</h1>
          <div className="w-16 h-[1.5px] bg-luxury-gold mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Salon Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-[#111111] border border-white/10 space-y-4">
              <h2 className="font-display text-base uppercase tracking-widest text-luxury-gold font-semibold">
                Flagship Atelier
              </h2>
              <div className="flex items-start gap-3 text-xs text-white/70">
                <MapPin className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
                <span>42, Dulha Dulhan House, Heritage Boulevard, Civil Lines, New Delhi 110001, India</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/70">
                <Phone className="w-4 h-4 text-luxury-gold shrink-0" />
                <span>Concierge Phone: +91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/70">
                <Mail className="w-4 h-4 text-luxury-gold shrink-0" />
                <span>Private Inquiries: concierge@dazzlingthread.com</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-white/70">
                <Clock className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
                <span>Monday – Saturday: 10:30 AM to 8:00 PM (By Private Appointment)</span>
              </div>
            </div>

            <div className="p-6 bg-luxury-gold/5 border border-luxury-gold/30 text-xs text-white/70 space-y-2">
              <p className="font-semibold text-luxury-gold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Virtual Video Consultations Available Worldwide</span>
              </p>
              <p>For international patrons, we offer 1-on-1 Zoom styling appointments with physical fabric swatches couriered internationally.</p>
            </div>
          </div>

          {/* Appointment Booking Form */}
          <div className="lg:col-span-7 bg-[#111111] border border-white/10 p-8">
            <h2 className="font-display text-lg uppercase tracking-widest text-white mb-6">
              Schedule Your Fitting Session
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#181818] border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-luxury-gold"
                />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#181818] border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="tel"
                  required
                  placeholder="Mobile / WhatsApp"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#181818] border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-luxury-gold"
                />
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full bg-[#181818] border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-luxury-gold"
                >
                  <option value="Bridal Couture">Bridal Couture Lehenga</option>
                  <option value="Groom Sherwani">Groom Wedding Sherwani</option>
                  <option value="Black Tie Tuxedo">Black-Tie Tailored Tuxedo</option>
                  <option value="Reception Gown">Reception Couture Gown</option>
                  <option value="Trousseau Consultation">Full Family Trousseau</option>
                </select>
              </div>

              <textarea
                rows={4}
                required
                placeholder="Wedding or event date, color palette preferences, or specific inquiries..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-[#181818] border border-white/15 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-luxury-gold"
              />

              <button
                type="submit"
                className="w-full py-3.5 bg-luxury-gold text-black font-display text-xs font-semibold tracking-[0.25em] uppercase hover:bg-luxury-gold-light transition-colors"
              >
                Request Private Session
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// FAQ PAGE
export const FAQPage = () => {
  const faqs = [
    { q: 'How far in advance should I order my bridal lehenga or groom sherwani?', a: 'We recommend ordering 6 to 10 weeks before your wedding celebrations to allow adequate time for bespoke hand-embroidery, canvas construction, and personalized trial fittings.' },
    { q: 'Do you offer Made-to-Measure custom sizing?', a: 'Yes. Every creation can be made according to your personalized 14-point body measurements. Select "Custom" in the size matrix, and our Master Concierge will guide you via video call.' },
    { q: 'What is your shipping policy across India and internationally?', a: 'We offer complimentary insured white-glove shipping on domestic orders over ₹5,000. For international destinations (USA, UK, Canada, UAE), we ship via FedEx International Priority.' },
    { q: 'Can I request color modifications or customize the dupatta style?', a: 'Certainly. As a true couture house, customizations in dye color, embroidery intensity, and veil borders can be coordinated through our design atelier.' },
  ];

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-medium">Knowledge Base</span>
          <h1 className="font-display text-4xl tracking-widest uppercase mt-2">Frequently Asked Questions</h1>
          <div className="w-16 h-[1.5px] bg-luxury-gold mx-auto mt-4" />
        </div>

        <div className="space-y-6">
          {faqs.map((f, i) => (
            <div key={i} className="p-6 bg-[#111111] border border-white/10">
              <h3 className="font-display text-sm uppercase tracking-wider text-luxury-gold font-semibold mb-2">
                {f.q}
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// POLICIES (Shipping, Returns, Privacy, Terms)
export const PolicyPage = ({ type = 'shipping' }) => {
  const contents = {
    shipping: {
      title: 'White-Glove Shipping & Delivery Policy',
      body: 'All Dazzling Threads creations are transported in specialized garment boxes with atmospheric moisture protection. Domestic orders ship complimentary via Blue Dart Apex. International orders are handled with door-to-door white glove logistics.',
    },
    returns: {
      title: 'Alterations & Return Privileges',
      body: 'Due to the custom and ceremonial nature of our haute couture pieces, ready-to-wear pieces may be exchanged within 7 days of delivery in pristine condition with security tags intact. Bespoke made-to-measure orders are non-refundable but include complimentary master tailor alterations.',
    },
    privacy: {
      title: 'Privacy & Client Discretion Policy',
      body: 'At Dulha Dulhan House, client confidentiality is paramount. We never sell or share patron records, wedding dates, or measurement blueprints with third parties. All online payments are handled through 256-bit encrypted gateways.',
    },
    terms: {
      title: 'Terms & Conditions of Service',
      body: 'By commissioning garments through Dazzling Threads, you agree to our standard artisanal production timelines and handcrafting variances inherent to natural silk yarns and handmade zardozi embroideries.',
    },
  };

  const current = contents[type] || contents.shipping;

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-medium">Dulha Dulhan House</span>
          <h1 className="font-display text-3xl sm:text-4xl tracking-widest uppercase mt-2">{current.title}</h1>
          <div className="w-16 h-[1.5px] bg-luxury-gold mx-auto mt-4" />
        </div>
        <div className="p-8 bg-[#111111] border border-white/10 text-xs sm:text-sm text-white/80 leading-relaxed space-y-4">
          <p>{current.body}</p>
          <p>
            For any specific clarifications or expedited wedding timelines, please contact our atelier team directly at <strong className="text-luxury-gold">concierge@dazzlingthread.com</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
