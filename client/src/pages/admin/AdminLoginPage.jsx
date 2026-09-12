import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AdminLoginPage = () => {
  const [email, setEmail] = useState('admin@dazzlingthread.com');
  const [password, setPassword] = useState('Admin@12345');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      if (result.user.role === 'admin' || result.user.role === 'staff') {
        navigate('/admin');
      } else {
        addToast('Access Denied: Administrative privileges required.', 'error');
      }
    }
  };

  return (
    <div className="bg-[#070707] text-white min-h-screen flex items-center justify-center px-4 relative">
      <div className="w-full max-w-md bg-[#101010] border border-luxury-gold/50 p-8 sm:p-10 shadow-2xl relative">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-full border border-luxury-gold p-1.5 mb-3 flex items-center justify-center bg-black/60 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-display text-2xl uppercase tracking-widest text-white">Executive Control</h1>
          <p className="text-xs text-luxury-gold uppercase tracking-widest font-serif mt-1">
            DAZZLING THREADS &bull; ADMIN SUITE
          </p>
        </div>

        {/* Demo Credential Notice */}
        <div className="mb-6 p-3 bg-luxury-gold/10 border border-luxury-gold/30 text-xs text-white/80 space-y-1">
          <p className="font-semibold text-luxury-gold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Pre-Configured Admin Credentials</span>
          </p>
          <p className="font-mono text-[11px] text-white/70">Email: admin@dazzlingthread.com</p>
          <p className="font-mono text-[11px] text-white/70">Pass: Admin@12345</p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
          <div>
            <label className="block uppercase text-white/70 tracking-wider mb-1.5 font-medium">Administrator Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#181818] border border-white/15 pl-10 pr-3.5 py-2.5 text-white focus:outline-none focus:border-luxury-gold transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block uppercase text-white/70 tracking-wider mb-1.5 font-medium">Security Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#181818] border border-white/15 pl-10 pr-3.5 py-2.5 text-white focus:outline-none focus:border-luxury-gold transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-luxury-gold text-black font-display text-xs font-semibold tracking-[0.25em] uppercase hover:bg-luxury-gold-light transition-all flex items-center justify-center gap-2 mt-2 shadow-[0_0_20px_rgba(212,175,55,0.25)]"
          >
            <span>{loading ? 'Validating Token...' : 'Enter Admin Control'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-white/10 text-center">
          <Link to="/" className="text-xs text-white/50 hover:text-white transition-colors uppercase tracking-wider">
            &larr; Return to Public Boutique
          </Link>
        </div>
      </div>
    </div>
  );
};
