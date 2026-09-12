import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);
    const result = await register({ name, email, password, phone });
    setLoading(false);

    if (result.success) {
      navigate('/profile');
    }
  };

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen pt-32 pb-24 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#111111] border border-luxury-gold/40 p-8 sm:p-10 shadow-2xl relative animate-fade-in">
        {/* Crest */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-full border border-luxury-gold/50 p-1 mb-3 flex items-center justify-center">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-display text-2xl uppercase tracking-widest text-white">Join Atelier</h1>
          <p className="text-xs text-luxury-gold tracking-widest uppercase font-serif mt-1">
            Dulha Dulhan House Membership
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5 font-medium">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Princess Ananya Singhania"
                className="w-full bg-[#181818] border border-white/15 pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-luxury-gold transition-colors"
              />
            </div>
          </div>

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
              Contact Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
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
                placeholder="Minimum 6 characters"
                className="w-full bg-[#181818] border border-white/15 pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-luxury-gold transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-luxury-gold text-black font-display text-xs font-semibold tracking-[0.25em] uppercase hover:bg-luxury-gold-light transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.2)] disabled:opacity-50 mt-2"
          >
            <span>{loading ? 'Creating Membership...' : 'Register VIP Membership'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-white/60">
          <span>Already registered? </span>
          <Link to="/login" className="text-luxury-gold font-semibold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
