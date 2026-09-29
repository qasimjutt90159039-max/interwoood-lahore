import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck, Truck, Clock, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#171717] text-[#EDE8DF] border-t border-white/5 pt-16 pb-12">
      {/* Brand Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="flex items-start gap-3">
          <Truck className="w-6 h-6 text-[#C9A66B] shrink-0 mt-1" />
          <div>
            <h4 className="text-sm font-semibold text-white">Nationwide Delivery</h4>
            <p className="text-xs text-stone-400 mt-1">Specialized white-glove transport & assembly across Pakistan.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Award className="w-6 h-6 text-[#C9A66B] shrink-0 mt-1" />
          <div>
            <h4 className="text-sm font-semibold text-white">Bespoke Craftsmanship</h4>
            <p className="text-xs text-stone-400 mt-1">Engineered woods, kiln-dried seasoned hardwoods & luxury finishes.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-[#C9A66B] shrink-0 mt-1" />
          <div>
            <h4 className="text-sm font-semibold text-white">Lahore Showroom</h4>
            <p className="text-xs text-stone-400 mt-1">Experience live setups at Babar Block, New Garden Town.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="w-6 h-6 text-[#C9A66B] shrink-0 mt-1" />
          <div>
            <h4 className="text-sm font-semibold text-white">Dedicated Support</h4>
            <p className="text-xs text-stone-400 mt-1">Mon - Sat: 10:30 AM to 8:30 PM helpline assistance.</p>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Column 1: Brand Wordmark & Overview */}
        <div className="space-y-4">
          <Link to="/" className="text-2xl font-bold tracking-[0.2em] font-editorial text-white block">
            INTERWOOD
          </Link>
          <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
            Interwood is a distinguished Pakistani furniture brand dedicated to creating thoughtful, durable, and architecturally refined home and office interiors.
          </p>
          <div className="pt-2 text-[11px] text-stone-500">
            Official Brand Portal: <a href="https://interwood.pk/" target="_blank" rel="noopener noreferrer" className="text-[#C9A66B] hover:underline">interwood.pk</a>
          </div>
        </div>

        {/* Column 2: Furniture Collections */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#C9A66B] mb-4">
            Collections
          </h3>
          <ul className="space-y-2.5 text-xs text-stone-300">
            <li><Link to="/shop?category=Sofas" className="hover:text-white transition-colors">Living Room Sofas</Link></li>
            <li><Link to="/shop?category=Beds" className="hover:text-white transition-colors">King & Queen Beds</Link></li>
            <li><Link to="/shop?category=Dining+Tables" className="hover:text-white transition-colors">Dining Tables & Chairs</Link></li>
            <li><Link to="/shop?category=Office+Furniture" className="hover:text-white transition-colors">Executive Office Suites</Link></li>
            <li><Link to="/shop?category=Mattresses" className="hover:text-white transition-colors">Orthopedic Mattresses</Link></li>
            <li><Link to="/shop?category=Home+Decor+%26+Lighting" className="hover:text-white transition-colors">Home Decor & Lighting</Link></li>
            <li><Link to="/shop?newArrival=true" className="hover:text-white transition-colors">New Arrivals</Link></li>
            <li><Link to="/shop?sale=true" className="hover:text-white transition-colors">Promotions & Sale</Link></li>
          </ul>
        </div>

        {/* Column 3: Customer Care */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#C9A66B] mb-4">
            Customer Service
          </h3>
          <ul className="space-y-2.5 text-xs text-stone-300">
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Lahore Showroom</Link></li>
            <li><Link to="/faq" className="hover:text-white transition-colors">Delivery FAQs & Timelines</Link></li>
            <li><Link to="/faq" className="hover:text-white transition-colors">Furniture Care & Assembly</Link></li>
            <li><Link to="/orders" className="hover:text-white transition-colors">Track Your Order</Link></li>
            <li><Link to="/cart" className="hover:text-white transition-colors">Shopping Bag</Link></li>
            <li><Link to="/login" className="hover:text-white transition-colors">Customer Login</Link></li>
            <li><Link to="/login?admin=true" className="hover:text-[#C9A66B] transition-colors">Staff / Admin Portal</Link></li>
          </ul>
        </div>

        {/* Column 4: Verified Lahore Showroom & Contact Details */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#C9A66B] mb-4">
            Lahore Showroom & Offices
          </h3>
          <div className="space-y-3.5 text-xs text-stone-300">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#C9A66B] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Lahore Showroom:</strong>
                <span>7, Babar Block, New Garden Town, Lahore 54600, Pakistan</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-400 block text-[11px]">Head Office & Plant:</strong>
                <span className="text-[11px] text-stone-400">56 Sultan Mehmood Road, Shalimar Town, Mehmood Booti, Lahore 54920</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-[#C9A66B] shrink-0 mt-0.5" />
              <div>
                <div>Main UAN: <a href="tel:+9242111203203" className="text-white hover:text-[#C9A66B] font-semibold">+92 42 111-203-203</a></div>
                <div className="text-[11px] text-stone-400">Showroom: <a href="tel:+924235831800" className="hover:text-white">+92 42 35831800</a></div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-[#C9A66B] shrink-0 mt-0.5" />
              <div className="text-[11px]">
                <div>Complaints: <a href="mailto:complaints@interwoodmobel.com" className="text-stone-300 hover:text-white">complaints@interwoodmobel.com</a></div>
                <div>Corporate: <a href="mailto:corporate@interwoodmobel.com" className="text-stone-300 hover:text-white">corporate@interwoodmobel.com</a></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar & Authenticity Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-4 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 gap-4">
        <div>
          &copy; {new Date().getFullYear()} Interwood Lahore. All rights reserved.
        </div>
        <div className="text-[11px] text-stone-400 text-center md:text-right">
          <span className="text-[#C9A66B] font-medium">Authenticity Notice:</span> Product prices and demo catalog data are presented for demonstration purposes. Official information is accessible on <a href="https://interwood.pk/" target="_blank" rel="noopener noreferrer" className="text-stone-300 underline">interwood.pk</a>.
        </div>
      </div>
    </footer>
  );
};
