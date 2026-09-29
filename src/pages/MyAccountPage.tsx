import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, Heart, LogOut, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

export const MyAccountPage: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || 'Lahore');
  const [province, setProvince] = useState(user?.address?.province || 'Punjab');
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || '');
  const [savedMessage, setSavedMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold font-editorial text-[#171717]">Sign In Required</h2>
        <p className="text-xs text-stone-500">Please sign in to access your customer profile and orders.</p>
        <Link to="/login" className="inline-block px-6 py-2.5 bg-[#171717] text-white rounded-lg text-xs font-semibold uppercase">
          Sign In
        </Link>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSavedMessage(false);
    try {
      await updateProfile({
        name,
        phone,
        address: { street, city, province, postalCode }
      });
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    } catch (err) {
      console.error('Update profile error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#171717]/10 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-editorial font-normal text-[#171717]">
            My Account
          </h1>
          <p className="text-xs text-stone-500 mt-1">Welcome back, {user.name} ({user.role})</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/orders"
            className="px-4 py-2 border border-stone-300 hover:bg-stone-50 rounded-lg text-xs font-semibold text-stone-700 inline-flex items-center gap-1.5"
          >
            <Package className="w-3.5 h-3.5 text-[#8B6F47]" />
            <span>View Orders</span>
          </Link>
          <button
            onClick={logout}
            className="px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg inline-flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-2 text-xs">
          <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-3">
            <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
              <div className="w-10 h-10 rounded-full bg-[#171717] text-white flex items-center justify-center font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-[#171717]">{user.name}</p>
                <p className="text-stone-400 text-[11px] truncate">{user.email}</p>
              </div>
            </div>

            <nav className="space-y-1">
              <Link to="/account" className="block px-3 py-2 rounded-lg bg-[#F7F5F1] font-semibold text-[#8B6F47]">
                Personal Information & Address
              </Link>
              <Link to="/orders" className="block px-3 py-2 rounded-lg text-stone-600 hover:bg-stone-50">
                Order History & Tracking
              </Link>
              <Link to="/wishlist" className="block px-3 py-2 rounded-lg text-stone-600 hover:bg-stone-50">
                Saved Wishlist
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="block px-3 py-2 rounded-lg text-amber-700 bg-amber-50 font-semibold mt-2">
                  Admin Management Console &rarr;
                </Link>
              )}
            </nav>
          </div>
        </div>

        {/* Profile Edit Form */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#171717] pb-2 border-b border-stone-100">
            Profile & Delivery Details
          </h2>

          {savedMessage && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Your profile and delivery address were updated successfully.</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-600 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#8B6F47]"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#8B6F47]"
                  placeholder="0300-1234567"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-600 mb-1">Email (Account ID)</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full p-2.5 bg-stone-100 border border-stone-200 rounded-lg text-stone-500 cursor-not-allowed"
              />
            </div>

            <div className="pt-2 border-t border-stone-100">
              <h3 className="font-semibold text-stone-800 mb-3">Default Delivery Address</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-stone-600 mb-1">Street / House / Sector</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#8B6F47]"
                    placeholder="House 42, Sector Y, Phase 3, DHA"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-stone-600 mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#8B6F47]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-1">Province</label>
                    <input
                      type="text"
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#8B6F47]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#8B6F47]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-[#171717] hover:bg-[#8B6F47] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving Changes...' : 'Save Profile Details'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
