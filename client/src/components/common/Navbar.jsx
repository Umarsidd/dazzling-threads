import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Menu, X, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { user, isAdmin } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const { count: wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Men', path: '/men' },
    { label: 'Women', path: '/women' },
    { label: 'Bridal House', path: '/women/bridal' },
    { label: 'New Arrivals', path: '/women?filter=newArrival' },
    { label: 'Heritage Story', path: '/about' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'py-3 glass-nav border-b border-white/10 shadow-2xl backdrop-blur-md'
            : 'py-5 bg-gradient-to-b from-black/80 via-black/40 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile Hamburger Menu */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="text-white hover:text-luxury-gold p-1.5 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Brand Logo & Name */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-luxury-gold/50 p-1 flex items-center justify-center transition-transform duration-500 group-hover:rotate-12">
                <img
                  src="/logo.png"
                  alt="Dazzling Threads Dulha Dulhan House"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-display tracking-[0.25em] text-sm sm:text-base md:text-lg font-medium text-white group-hover:text-luxury-gold transition-colors">
                  DAZZLING THREADS
                </span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-luxury-gold/80 font-serif">
                  Dulha Dulhan House
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.label}
                    to={link.path}
                    className={`text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 relative py-1 ${
                      isActive
                        ? 'text-luxury-gold font-semibold'
                        : 'text-white/80 hover:text-luxury-gold'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-luxury-gold" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-3 sm:gap-5">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-white/80 hover:text-luxury-gold transition-colors p-1"
                aria-label="Search Catalog"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Link */}
              <Link
                to="/wishlist"
                className="relative text-white/80 hover:text-luxury-gold transition-colors p-1"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-luxury-gold text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Customer Account / Profile */}
              <Link
                to={user ? '/profile' : '/login'}
                className="text-white/80 hover:text-luxury-gold transition-colors p-1"
                aria-label="Customer Profile"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Admin Dashboard shortcut if admin */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden md:flex items-center gap-1 px-2.5 py-1 border border-luxury-gold/50 bg-luxury-gold/10 text-luxury-gold text-[10px] uppercase tracking-wider font-semibold hover:bg-luxury-gold hover:text-black transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
              )}

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-white/80 hover:text-luxury-gold transition-colors p-1"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-luxury-gold text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Quick Inline Search Bar (Expands on Search Icon Click) */}
          {searchOpen && (
            <form onSubmit={handleSearchSubmit} className="mt-4 pt-3 border-t border-white/10 flex items-center gap-3 animate-fade-in">
              <Search className="w-4 h-4 text-luxury-gold shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bespoke Sherwanis, Bridal Lehengas, Tuxedos, Banarasi Sarees..."
                className="w-full bg-transparent text-sm text-white placeholder-white/40 focus:outline-none tracking-wide"
                autoFocus
              />
              <button
                type="submit"
                className="text-xs uppercase tracking-widest text-luxury-gold hover:underline font-semibold shrink-0"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </header>

      {/* Mobile Animated Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-4/5 max-w-sm bg-[#0E0E0E] border-r border-luxury-gold/30 h-full p-6 flex flex-col justify-between shadow-2xl z-10 animate-fade-in">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full border border-luxury-gold/50 p-1 flex items-center justify-center">
                    <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <div className="text-left">
                    <p className="font-display text-sm font-semibold tracking-widest text-white">DAZZLING THREADS</p>
                    <p className="text-[8px] tracking-[0.2em] text-luxury-gold uppercase">Dulha Dulhan House</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white/60 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-4 py-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.path}
                    className="flex items-center justify-between text-sm uppercase tracking-[0.2em] text-white/90 hover:text-luxury-gold py-2 border-b border-white/5"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-luxury-gold/60" />
                  </Link>
                ))}

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center justify-between text-sm uppercase tracking-[0.2em] text-luxury-gold font-semibold py-2"
                  >
                    <span>Admin Control Suite</span>
                    <ShieldCheck className="w-4 h-4 text-luxury-gold" />
                  </Link>
                )}
              </nav>
            </div>

            {/* Bottom Contact / Account Links */}
            <div className="pt-6 border-t border-white/10 flex flex-col gap-3 text-xs tracking-wider text-white/60">
              <Link to={user ? '/profile' : '/login'} className="text-luxury-gold font-medium">
                {user ? `Logged in as ${user.name}` : 'Login or Register'}
              </Link>
              <p>42, Dulha Dulhan House, Heritage Blvd</p>
              <p>Concierge: +91 98765 43210</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
