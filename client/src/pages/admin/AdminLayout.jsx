import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Tag,
  Star,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user || !isAdmin) {
    navigate('/admin/login');
    return null;
  }

  const menuItems = [
    { label: 'Executive Metrics', path: '/admin', icon: LayoutDashboard },
    { label: 'Product Catalog', path: '/admin/products', icon: Package },
    { label: 'Fulfillment & Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Promotional Vouchers', path: '/admin/coupons', icon: Tag },
    { label: 'Client Reviews', path: '/admin/reviews', icon: Star },
    { label: 'User Directory', path: '/admin/users', icon: Users },
  ];

  return (
    <div className="bg-[#080808] text-white min-h-screen flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#0F0F0F] border-r border-luxury-gold/30 flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
          {/* Brand Crest */}
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-luxury-gold/50 p-1 flex items-center justify-center">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="font-display text-xs tracking-widest uppercase font-semibold text-white">
                DAZZLING THREADS
              </h2>
              <span className="text-[9px] uppercase tracking-[0.25em] text-luxury-gold font-serif">
                Admin Control Suite
              </span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-medium transition-all ${
                    isActive
                      ? 'bg-luxury-gold text-black font-semibold shadow-md'
                      : 'text-white/70 hover:bg-white/5 hover:text-luxury-gold'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs text-white/60 hover:text-white transition-colors"
          >
            <span>View Public Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-[#0F0F0F] border-b border-white/10 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-white/50">Admin Session:</span>
            <span className="font-semibold text-xs text-luxury-gold font-sans">{user.name}</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-xs text-luxury-gold hover:underline flex items-center gap-1 uppercase tracking-wider font-medium"
            >
              <span>Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Dynamic Nested View */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
