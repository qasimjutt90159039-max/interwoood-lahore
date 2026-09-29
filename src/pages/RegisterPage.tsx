import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, phone);
      navigate('/account');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B6F47]">
            Join Interwood Lahore
          </span>
          <h1 className="text-2xl font-editorial font-bold text-[#171717]">
            Create Customer Account
          </h1>
          <p className="text-xs text-stone-500">
            Enjoy priority Lahore showroom appointments and tracked order updates.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-stone-600 mb-1 font-medium">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#8B6F47]"
                placeholder="e.g. Asad Rehman"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-600 mb-1 font-medium">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#8B6F47]"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-600 mb-1 font-medium">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#8B6F47]"
                placeholder="0300-1234567"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-600 mb-1 font-medium">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#8B6F47]"
                placeholder="Minimum 6 characters"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-600 mb-1 font-medium">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#8B6F47]"
                placeholder="Re-enter password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#171717] hover:bg-[#8B6F47] text-white rounded-lg font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            <span>{loading ? 'Registering...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-stone-500">
          Already registered?{' '}
          <Link to="/login" className="text-[#8B6F47] font-semibold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
