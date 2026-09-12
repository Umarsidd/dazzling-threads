import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/profile';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      if (result.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(redirectPath);
      }
    }
  };

  const fillDemoCustomer = () => {
    setEmail('customer@dazzlingthread.com');
    setPassword('Customer@12345');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@dazzlingthread.com');
    setPassword('Admin@12345');
  };

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen pt-32 pb-24 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#111111] border border-luxury-gold/40 p-8 sm:p-10 shadow-2xl relative animate-fade-in">
        {/* Brand Crest */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-full border border-luxury-gold/50 p-1 mb-3 flex items-center justify-center">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-display text-2xl uppercase tracking-widest text-white">Client Portal</h1>
          <p className="text-xs text-luxury-gold tracking-widest uppercase font-serif mt-1">
            Dulha Dulhan House Sign In
          </p>
        </div>

        {/* Demo Fast Fill Buttons for easy evaluation */}
        <div className="mb-6 p-3 bg-white/5 border border-white/10 flex items-center justify-between text-xs">
          <span className="text-white/60">Demo Accounts:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={fillDemoCustomer}
              className="px-2 py-1 bg-white/10 hover:bg-luxury-gold hover:text-black transition-colors text-[10px] uppercase font-semibold"
            >
              VIP Client
            </button>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="px-2 py-1 bg-luxury-gold/20 text-luxury-gold hover:bg-luxury-gold hover:text-black transition-colors text-[10px] uppercase font-semibold"
            >
              Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5 font-medium">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@luxuryhouse.com"
                className="w-full bg-[#181818] border border-white/15 pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-luxury-gold transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5 font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#181818] border border-white/15 pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-luxury-gold transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-luxury-gold text-black font-display text-xs font-semibold tracking-[0.25em] uppercase hover:bg-luxury-gold-light transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.2)] disabled:opacity-50 mt-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Atelier'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-white/60">
          <span>New to Dazzling Threads? </span>
          <Link to="/register" className="text-luxury-gold font-semibold hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
