import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Edit2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const ProfilePage = () => {
  const { user, logout, updateProfile, addAddress, deleteAddress, isAdmin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');

  // Edit Profile Form
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isUpdating, setIsUpdating] = useState(false);

  // Add Address Form
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    landmark: '',
    city: 'New Delhi',
    state: 'Delhi',
    postalCode: '110001',
    country: 'India',
    isDefault: false,
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    await updateProfile({ name, phone });
    setIsUpdating(false);
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    await addAddress(newAddr);
    setShowAddressModal(false);
    setNewAddr({
      fullName: user?.name || '',
      phone: user?.phone || '',
      street: '',
      landmark: '',
      city: 'New Delhi',
      state: 'Delhi',
      postalCode: '110001',
      country: 'India',
      isDefault: false,
    });
  };

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen pt-28 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="pb-8 border-b border-white/10 mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-luxury-gold p-1 bg-neutral-900 flex items-center justify-center">
              <User className="w-8 h-8 text-luxury-gold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl uppercase tracking-wider">{user.name}</h1>
                {isAdmin && (
                  <span className="px-2 py-0.5 bg-luxury-gold text-black text-[10px] font-bold uppercase tracking-widest">
                    Staff/Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-luxury-gold tracking-widest uppercase font-serif">
                Dulha Dulhan House VIP Patron
              </p>
              <p className="text-xs text-white/50">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2.5 border border-luxury-gold bg-luxury-gold/10 text-luxury-gold text-xs uppercase tracking-widest font-semibold hover:bg-luxury-gold hover:text-black transition-colors"
              >
                Admin Suite
              </Link>
            )}
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="flex items-center gap-2 px-4 py-2.5 border border-white/20 text-white/80 text-xs uppercase tracking-widest hover:border-red-500 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 gap-6 mb-8 text-xs uppercase tracking-[0.2em] font-medium">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 relative ${activeTab === 'profile' ? 'text-luxury-gold font-semibold' : 'text-white/60 hover:text-white'}`}
          >
            Personal Atelier Profile
            {activeTab === 'profile' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-luxury-gold" />}
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`py-3 relative ${activeTab === 'addresses' ? 'text-luxury-gold font-semibold' : 'text-white/60 hover:text-white'}`}
          >
            Address Book ({user.addresses?.length || 0})
            {activeTab === 'addresses' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-luxury-gold" />}
          </button>
          <Link
            to="/orders"
            className="py-3 text-white/60 hover:text-white transition-colors"
          >
            Order History &rarr;
          </Link>
          <Link
            to="/wishlist"
            className="py-3 text-white/60 hover:text-white transition-colors"
          >
            Wishlist &rarr;
          </Link>
        </div>

        {/* TAB 1: Profile Details */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl bg-[#111111] border border-white/10 p-6 sm:p-8">
            <h2 className="font-display text-base uppercase tracking-widest text-luxury-gold font-semibold mb-6">
              Update Personal Information
            </h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full bg-black/40 border border-white/10 px-3 py-2 text-xs text-white/40 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5">Mobile Contact</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="px-6 py-3 bg-luxury-gold text-black font-display text-xs font-semibold tracking-[0.2em] uppercase hover:bg-luxury-gold-light transition-colors"
              >
                {isUpdating ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-base uppercase tracking-widest text-white">
                Saved Delivery Residences
              </h2>
              <button
                onClick={() => setShowAddressModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-luxury-gold text-black text-xs uppercase tracking-wider font-semibold hover:bg-luxury-gold-light transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Residence</span>
              </button>
            </div>

            {(!user.addresses || user.addresses.length === 0) ? (
              <div className="p-8 text-center bg-[#111111] border border-white/10 text-white/50 text-xs">
                No delivery addresses registered yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user.addresses.map((addr) => (
                  <div
                    key={addr._id}
                    className="p-6 bg-[#111111] border border-white/15 relative flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-display text-sm font-semibold text-white">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/30 px-2 py-0.5 uppercase tracking-wider">
                            Primary Residence
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/70 leading-relaxed">
                        {addr.street}
                        {addr.landmark && <>, {addr.landmark}</>}
                        <br />
                        {addr.city}, {addr.state} - {addr.postalCode}
                        <br />
                        {addr.country}
                      </p>
                      <p className="text-xs text-white/50 mt-2 font-mono">Tel: {addr.phone}</p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/10 flex justify-end">
                      <button
                        onClick={() => deleteAddress(addr._id)}
                        className="text-xs text-white/40 hover:text-red-400 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Address Modal */}
            {showAddressModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowAddressModal(false)} />
                <div className="relative w-full max-w-lg bg-[#111111] border border-luxury-gold/40 p-6 sm:p-8 z-10 text-white">
                  <h3 className="font-display text-base uppercase tracking-widest text-luxury-gold font-semibold mb-4">
                    Add New Residence
                  </h3>
                  <form onSubmit={handleAddAddress} className="space-y-3">
                    <input
                      type="text"
                      required
                      placeholder="Recipient Full Name"
                      value={newAddr.fullName}
                      onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                      className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-luxury-gold"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Recipient Phone"
                      value={newAddr.phone}
                      onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                      className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-luxury-gold"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Street / Estate / Villa No."
                      value={newAddr.street}
                      onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                      className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-luxury-gold"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="City"
                        value={newAddr.city}
                        onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                        className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-luxury-gold"
                      />
                      <input
                        type="text"
                        required
                        placeholder="State"
                        value={newAddr.state}
                        onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                        className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-luxury-gold"
                      />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Postal Code"
                      value={newAddr.postalCode}
                      onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                      className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-luxury-gold"
                    />
                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddressModal(false)}
                        className="flex-1 py-2.5 border border-white/20 text-xs uppercase"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 bg-luxury-gold text-black text-xs uppercase font-semibold"
                      >
                        Save Residence
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
