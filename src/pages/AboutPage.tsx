import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Award, CheckCircle2, Factory, Home, Briefcase, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../components/common/ImageWithFallback.js';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Editorial Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#8B6F47]">
          About The Brand
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-normal text-[#171717] leading-tight">
          Pioneering Contemporary Furniture & Interior Design in Pakistan
        </h1>
        <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
          Interwood Lahore provides complete furnishing solutions for modern residential living spaces, executive corporate suites, and contemporary architectural projects.
        </p>
      </div>

      {/* Hero Visual */}
      <div className="rounded-2xl overflow-hidden aspect-16/9 max-h-[500px] border border-stone-200">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85"
          alt="Interwood Lahore Interiors"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Core Collections Overview */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8B6F47]">Our Core Disciplines</span>
          <h2 className="text-2xl sm:text-3xl font-editorial text-[#171717]">Furniture Collections</h2>
          <p className="text-xs text-stone-500">Every category is engineered with durability, ergonomics, and architectural elegance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-3">
            <Home className="w-8 h-8 text-[#8B6F47]" />
            <h3 className="text-base font-bold text-[#171717]">Home Living & Lounge</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              Plush 3-seater sofas, sectional couches, coffee tables, and floating TV consoles engineered to enhance family comfort and interior aesthetics.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-3">
            <CheckCircle2 className="w-8 h-8 text-[#8B6F47]" />
            <h3 className="text-base font-bold text-[#171717]">Bedroom & Rest</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              King and queen bedframes, hydraulic storage options, tailored upholstery, nightstands, and certified orthopedic spring mattresses.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-3">
            <Briefcase className="w-8 h-8 text-[#8B6F47]" />
            <h3 className="text-base font-bold text-[#171717]">Office & Workspace</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              Managerial executive desks, ergonomic mesh task seating, conference tables, and modular filing systems tailored for corporate Pakistani workspaces.
            </p>
          </div>
        </div>
      </div>

      {/* Lahore Facilities & Presence */}
      <div className="bg-[#EDE8DF] rounded-2xl p-8 sm:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8B6F47]">Presence in Lahore</span>
          <h2 className="text-2xl sm:text-3xl font-editorial font-normal text-[#171717]">
            Showroom & Manufacturing
          </h2>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
            Interwood maintains both an extensive retail showroom in New Garden Town for customer consultations and modern facilities at Shalimar Town, Mehmood Booti for precision joinery, finishing, and logistics.
          </p>

          <div className="space-y-2 text-xs pt-2">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#8B6F47] shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block">Flagship Showroom:</strong>
                <span className="text-stone-600">7, Babar Block, New Garden Town, Lahore 54600, Pakistan</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Factory className="w-4 h-4 text-[#8B6F47] shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block">Head Office & Works:</strong>
                <span className="text-stone-600">56 Sultan Mehmood Road, Shalimar Town, Mehmood Booti, Lahore 54920</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#171717] hover:bg-[#8B6F47] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              <span>Visit Showroom</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden shadow-md">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80"
            alt="Interwood Showroom Experience"
            className="w-full h-80 object-cover"
          />
        </div>
      </div>
    </div>
  );
};
