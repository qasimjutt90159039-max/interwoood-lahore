import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 sm:py-32 text-center space-y-6">
      <span className="text-4xl font-bold font-editorial text-[#8B6F47]">404</span>
      <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-[#171717]">
        Page Not Found
      </h1>
      <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto leading-relaxed">
        The architectural furniture page or product specification you are seeking could not be located.
      </p>

      <div className="pt-2 flex justify-center gap-3">
        <Link
          to="/"
          className="px-6 py-2.5 bg-[#171717] hover:bg-[#8B6F47] text-white rounded-lg text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <Link
          to="/shop"
          className="px-6 py-2.5 border border-stone-300 hover:bg-stone-50 text-stone-800 rounded-lg text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Explore Catalog</span>
        </Link>
      </div>
    </div>
  );
};
