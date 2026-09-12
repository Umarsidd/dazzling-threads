import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Send, ShieldCheck, RefreshCw, Award, Truck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const { addToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      addToast('Thank you for joining the inner circle of Dazzling Threads.', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#070707] text-white border-t border-luxury-gold/20 pt-16 pb-10">
      {/* Brand Trust Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Award className="w-6 h-6 text-luxury-gold" />
            <h4 className="font-display text-xs tracking-widest uppercase font-semibold">Master Craftsmanship</h4>
            <p className="text-xs text-white/50">Hand-embroidered zardozi, pure silk, and Italian wool.</p>
          </div>
          <div className="flex flex-col items-center md:items-start gap-2">
            <Truck className="w-6 h-6 text-luxury-gold" />
            <h4 className="font-display text-xs tracking-widest uppercase font-semibold">Complimentary Shipping</h4>
            <p className="text-xs text-white/50">Fully insured white-glove delivery on orders over ₹5,000.</p>
          </div>
          <div className="flex flex-col items-center md:items-start gap-2">
            <RefreshCw className="w-6 h-6 text-luxury-gold" />
            <h4 className="font-display text-xs tracking-widest uppercase font-semibold">Bespoke Fitting</h4>
            <p className="text-xs text-white/50">Complimentary virtual master-tailor consultation.</p>
          </div>
          <div className="flex flex-col items-center md:items-start gap-2">
            <ShieldCheck className="w-6 h-6 text-luxury-gold" />
            <h4 className="font-display text-xs tracking-widest uppercase font-semibold">Authenticity Certified</h4>
            <p className="text-xs text-white/50">100% genuine silk, gold zari, and hallmarked luxury.</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full border border-luxury-gold/50 p-1 flex items-center justify-center">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-display tracking-[0.25em] text-lg font-medium text-white">
                  DAZZLING THREADS
                </span>
                <span className="text-[9px] uppercase tracking-[0.3em] text-luxury-gold font-serif">
                  Dulha Dulhan House
                </span>
              </div>
            </Link>
            <p className="text-xs text-white/60 leading-relaxed font-sans max-w-sm mb-6">
              A timeless sanctuary of royal groom sherwanis, imperial tuxedos, handcrafted bridal lehengas, and heirloom sarees. Crafted to dazzle for life's unforgettable occasions.
            </p>
            <div className="flex items-center gap-4 text-luxury-gold/80">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-luxury-gold p-2 border border-white/10 rounded-full hover:border-luxury-gold transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-luxury-gold p-2 border border-white/10 rounded-full hover:border-luxury-gold transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-luxury-gold p-2 border border-white/10 rounded-full hover:border-luxury-gold transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Shop */}
          <div>
            <h3 className="font-display text-xs uppercase tracking-[0.25em] text-luxury-gold font-semibold mb-4">
              Collections
            </h3>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li><Link to="/men" className="hover:text-luxury-gold transition-colors">Men's Royal Wardrobe</Link></li>
              <li><Link to="/men/sherwanis" className="hover:text-luxury-gold transition-colors">Groom Sherwanis</Link></li>
              <li><Link to="/men/tuxedos" className="hover:text-luxury-gold transition-colors">Imperial Tuxedos</Link></li>
              <li><Link to="/women" className="hover:text-luxury-gold transition-colors">Women's Couture</Link></li>
              <li><Link to="/women/bridal" className="hover:text-luxury-gold transition-colors">Bridal Lehengas</Link></li>
              <li><Link to="/women/sarees" className="hover:text-luxury-gold transition-colors">Kanjeevaram & Banarasi</Link></li>
            </ul>
          </div>

          {/* Column 2: Customer Care */}
          <div>
            <h3 className="font-display text-xs uppercase tracking-[0.25em] text-luxury-gold font-semibold mb-4">
              Concierge Care
            </h3>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li><Link to="/contact" className="hover:text-luxury-gold transition-colors">Private Appointment</Link></li>
              <li><Link to="/faq" className="hover:text-luxury-gold transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/shipping" className="hover:text-luxury-gold transition-colors">Worldwide Shipping</Link></li>
              <li><Link to="/returns" className="hover:text-luxury-gold transition-colors">Returns & Alterations</Link></li>
              <li><Link to="/about" className="hover:text-luxury-gold transition-colors">Our Heritage</Link></li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div>
            <h3 className="font-display text-xs uppercase tracking-[0.25em] text-luxury-gold font-semibold mb-4">
              The Inner Circle
            </h3>
            <p className="text-xs text-white/60 mb-4 leading-relaxed">
              Be first to discover new bridal drops, private runway invites, and bespoke salon viewings.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-white/5 border border-white/20 px-3 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-luxury-gold transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-luxury-gold hover:text-luxury-gold-light p-1"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[10px] text-white/40">Exclusive editorial insights. No spam.</span>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/40 gap-4">
        <p>&copy; {new Date().getFullYear()} DAZZLING THREADS (DULHA DULHAN HOUSE). All Rights Reserved.</p>
        <div className="flex gap-6">
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link to="/shipping" className="hover:text-white transition-colors">Shipping Guide</Link>
        </div>
      </div>
    </footer>
  );
};
