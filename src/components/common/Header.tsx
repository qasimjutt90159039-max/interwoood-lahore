import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User as UserIcon, Menu, X, ChevronDown, Phone, MapPin } from 'lucide-react';
import { useCart } from '../../context/CartContext.js';
import { useWishlist } from '../../context/WishlistContext.js';
import { useAuth } from '../../context/AuthContext.js';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  const { totalItemsCount, setIsCartDrawerOpen } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setAccountMenuOpen(false);
    setMegaMenuOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const navCategories = [
    { name: 'Living Room', path: '/shop?category=Sofas' },
    { name: 'Bedroom', path: '/shop?category=Beds' },
    { name: 'Dining', path: '/shop?category=Dining+Tables' },
    { name: 'Office', path: '/shop?category=Office+Furniture' },
    { name: 'Mattresses', path: '/shop?category=Mattresses' },
    { name: 'Decor', path: '/shop?category=Home+Decor+%26+Lighting' },
    { name: 'New Arrivals', path: '/shop?newArrival=true' },
    { name: 'Sale', path: '/shop?sale=true' }
  ];

  return (
    <>
      {/* Top Notification Bar */}
      <div className="bg-[#171717] text-white text-[11px] sm:text-xs py-2 px-4 tracking-wide border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#C9A66B]">
              <MapPin className="w-3.5 h-3.5" />
              <span>Lahore Showroom: 7, Babar Block, New Garden Town</span>
            </span>
            <span className="hidden md:inline text-white/40">·</span>
            <span className="hidden md:flex items-center gap-1.5 text-stone-300">
              <Phone className="w-3.5 h-3.5" />
              <a href="tel:+9242111203203" className="hover:text-white transition-colors">+92 42 111-203-203</a>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden lg:inline text-stone-300">Free White-Glove Lahore Delivery over Rs. 100,000</span>
            <Link to="/contact" className="hover:text-[#C9A66B] transition-colors underline underline-offset-2">Visit Showroom</Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Header: 3-Zone Contract */}
      <header
        className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md transition-all duration-200 border-b ${
          isScrolled ? 'border-[#171717]/10 shadow-xs py-3' : 'border-[#171717]/6 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 text-[#171717] hover:bg-stone-100 rounded-lg transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link
              to="/"
              className="text-xl sm:text-2xl font-bold tracking-[0.2em] uppercase text-[#171717] font-editorial select-none"
            >
              INTERWOOD
            </Link>
          </div>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-semibold uppercase tracking-wider text-stone-700">
            <Link to="/" className="hover:text-[#8B6F47] transition-colors whitespace-nowrap">
              Home
            </Link>

            <div
              className="relative group"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <Link
                to="/shop"
                className="hover:text-[#8B6F47] transition-colors inline-flex items-center gap-1 whitespace-nowrap"
              >
                <span>Furniture</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </Link>

              {/* Mega-menu dropdown */}
              {megaMenuOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[700px] bg-white border border-[#171717]/10 shadow-xl rounded-xl p-6 grid grid-cols-3 gap-6 animate-fadeIn">
                  <div>
                    <h4 className="text-xs font-bold text-[#171717] tracking-widest uppercase mb-3 pb-1 border-b border-stone-100">
                      Living Room
                    </h4>
                    <ul className="space-y-2 text-xs normal-case font-normal text-stone-600">
                      <li><Link to="/shop?category=Sofas" className="hover:text-[#8B6F47]">Sofas & Couches</Link></li>
                      <li><Link to="/shop?category=Armchairs+%26+Accent+Chairs" className="hover:text-[#8B6F47]">Accent Armchairs</Link></li>
                      <li><Link to="/shop?category=Coffee+Tables" className="hover:text-[#8B6F47]">Coffee & Center Tables</Link></li>
                      <li><Link to="/shop?category=TV+Units+%26+Consoles" className="hover:text-[#8B6F47]">TV Consoles & Media Units</Link></li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-[#171717] tracking-widest uppercase mb-3 pb-1 border-b border-stone-100">
                      Bedroom & Sleep
                    </h4>
                    <ul className="space-y-2 text-xs normal-case font-normal text-stone-600">
                      <li><Link to="/shop?category=Beds" className="hover:text-[#8B6F47]">King & Queen Beds</Link></li>
                      <li><Link to="/shop?category=Bedside+Tables+%26+Dressers" className="hover:text-[#8B6F47]">Nightstands & Dressers</Link></li>
                      <li><Link to="/shop?category=Wardrobes+%26+Closets" className="hover:text-[#8B6F47]">Wardrobes & Closets</Link></li>
                      <li><Link to="/shop?category=Mattresses" className="hover:text-[#8B6F47]">Orthopedic Mattresses</Link></li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-[#171717] tracking-widest uppercase mb-3 pb-1 border-b border-stone-100">
                      Dining & Workspace
                    </h4>
                    <ul className="space-y-2 text-xs normal-case font-normal text-stone-600">
                      <li><Link to="/shop?category=Dining+Tables" className="hover:text-[#8B6F47]">Dining Tables</Link></li>
                      <li><Link to="/shop?category=Dining+Chairs" className="hover:text-[#8B6F47]">Dining Chairs</Link></li>
                      <li><Link to="/shop?category=Office+Furniture" className="hover:text-[#8B6F47]">Executive Desks & Chairs</Link></li>
                      <li><Link to="/shop?category=Home+Decor+%26+Lighting" className="hover:text-[#8B6F47]">Lamps & Home Decor</Link></li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {navCategories.slice(0, 5).map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="hover:text-[#8B6F47] transition-colors whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}

            <Link
              to="/shop?sale=true"
              className="text-[#8B6F47] hover:text-[#171717] transition-colors whitespace-nowrap font-bold"
            >
              Sale
            </Link>
          </nav>

          {/* Zone 3: Primary interactive controls (Search, Wishlist, Account, Cart) */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-stone-700 hover:text-[#171717] hover:bg-stone-100 rounded-full transition-colors"
              aria-label="Search furniture catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="p-2 text-stone-700 hover:text-[#171717] hover:bg-stone-100 rounded-full transition-colors relative"
              aria-label="View saved items"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#8B6F47] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Account / User Menu */}
            <div className="relative">
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="p-2 text-stone-700 hover:text-[#171717] hover:bg-stone-100 rounded-full transition-colors"
                aria-label="Account options"
              >
                <UserIcon className="w-5 h-5" />
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#171717]/10 shadow-lg rounded-xl py-2 z-50 animate-fadeIn">
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-stone-100">
                        <p className="text-xs font-semibold text-[#171717] truncate">{user.name}</p>
                        <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/account"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-xs text-stone-700 hover:bg-[#F7F5F1] hover:text-[#171717]"
                      >
                        My Account
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-xs text-stone-700 hover:bg-[#F7F5F1] hover:text-[#171717]"
                      >
                        Order History
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setAccountMenuOpen(false)}
                          className="block px-4 py-2 text-xs text-[#8B6F47] font-semibold hover:bg-[#F7F5F1]"
                        >
                          Admin Console
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setAccountMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="p-3 border-b border-stone-100">
                        <p className="text-xs text-stone-600 mb-2">Welcome to Interwood Lahore</p>
                        <Link
                          to="/login"
                          onClick={() => setAccountMenuOpen(false)}
                          className="block w-full py-1.5 bg-[#171717] text-white text-center rounded-lg text-xs font-semibold hover:bg-[#8B6F47] transition-colors"
                        >
                          Sign In
                        </Link>
                      </div>
                      <Link
                        to="/register"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-xs text-stone-700 hover:bg-[#F7F5F1]"
                      >
                        Create Customer Account
                      </Link>
                      <Link
                        to="/login?admin=true"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-xs text-[#8B6F47] hover:bg-[#F7F5F1]"
                      >
                        Admin Portal Login
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Shopping Bag / Cart */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="p-2 text-stone-700 hover:text-[#171717] hover:bg-stone-100 rounded-full transition-colors relative"
              aria-label="Open shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#171717] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Live Search Drawer / Input Bar */}
        {searchOpen && (
          <div className="border-t border-[#171717]/10 bg-[#F7F5F1] py-4 px-4 sm:px-6">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 130+ sofas, king beds, walnut tables, ergonomic chairs, SKU..."
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-stone-300 rounded-lg text-sm focus:outline-hidden focus:border-[#8B6F47] focus:ring-1 focus:ring-[#8B6F47]"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#171717] text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-[#8B6F47] transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2 text-stone-500 hover:text-[#171717]"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl z-50 flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <span className="font-editorial text-lg font-bold tracking-widest text-[#171717]">INTERWOOD</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <Link to="/" className="block text-sm font-semibold text-[#171717] hover:text-[#8B6F47]">Home</Link>
              <Link to="/shop" className="block text-sm font-semibold text-[#171717] hover:text-[#8B6F47]">All Furniture (130+)</Link>
              <div className="pt-2 pb-1 text-xs font-bold uppercase tracking-wider text-stone-400">Categories</div>
              {navCategories.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block text-sm text-stone-700 hover:text-[#8B6F47] pl-2"
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-stone-200 space-y-2">
                <Link to="/about" className="block text-sm text-stone-600 hover:text-[#171717]">About Interwood</Link>
                <Link to="/contact" className="block text-sm text-stone-600 hover:text-[#171717]">Lahore Showroom</Link>
                <Link to="/faq" className="block text-sm text-stone-600 hover:text-[#171717]">Delivery & FAQs</Link>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-stone-200 text-xs text-stone-500 space-y-1">
              <p className="font-semibold text-stone-800">Lahore Showroom</p>
              <p>7, Babar Block, New Garden Town</p>
              <a href="tel:+9242111203203" className="text-[#8B6F47] font-medium block pt-1">+92 42 111-203-203</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
