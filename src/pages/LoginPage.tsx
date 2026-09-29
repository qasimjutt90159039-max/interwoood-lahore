import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isAdminParam = searchParams.get('admin') === 'true';

  const [email, setEmail] = useState(isAdminParam ? 'admin@interwood.pk' : '');
  const [password, setPassword] = useState(isAdminParam ? 'admin123' : '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      if (email.toLowerCase().includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/account');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      setEmail('admin@interwood.pk');
      setPassword('admin123');
    } else {
      setEmail('customer@interwood.pk');
      setPassword('customer123');
    }
    setError('');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B6F47]">
            Interwood Member Access
          </span>
          <h1 className="text-2xl font-editorial font-bold text-[#171717]">
            {isAdminParam ? 'Admin Console Login' : 'Sign In to Your Account'}
          </h1>
          <p className="text-xs text-stone-500">
            Access order history, customized delivery tracking, and saved furniture lists.
          </p>
        </div>

        {/* Demo Credentials Quick Click */}
        <div className="bg-[#F7F5F1] p-3.5 rounded-xl space-y-2 text-xs border border-stone-200">
          <span className="text-[11px] font-bold text-stone-600 block uppercase tracking-wider">
            Quick Demo Login (One-Click Fill):
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDemoCredentials('customer')}
              className="py-1.5 px-2 bg-white hover:bg-stone-100 border border-stone-300 rounded text-[11px] font-medium text-stone-800 transition-colors"
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('admin')}
              className="py-1.5 px-2 bg-white hover:bg-stone-100 border border-[#8B6F47] rounded text-[11px] font-medium text-[#8B6F47] transition-colors"
            >
              Demo Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
            <div className="flex justify-between items-center mb-1">
              <label className="text-stone-600 font-medium">Password</label>
              <span className="text-[11px] text-[#8B6F47] hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#8B6F47]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#171717] hover:bg-[#8B6F47] text-white rounded-lg font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-stone-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#8B6F47] font-semibold hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};
