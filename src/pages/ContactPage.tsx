import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Navigation } from 'lucide-react';
import api from '../services/api.js';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Showroom Visit Inquiry',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/contact', formData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Showroom Visit Inquiry',
        message: ''
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#8B6F47]">
          Connect With Us
        </span>
        <h1 className="text-3xl sm:text-4xl font-editorial font-normal text-[#171717]">
          Lahore Showroom & Customer Concierge
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
          Visit our flagship showroom at New Garden Town or reach our corporate and complaints desks for immediate assistance.
        </p>
      </div>

      {/* Main Grid: Showroom Info Cards & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contact Info & Direct Actions */}
        <div className="space-y-6">
          {/* Flagship Showroom Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8B6F47]">
              <MapPin className="w-4 h-4" />
              <span>Lahore Showroom</span>
            </div>

            <p className="text-sm font-semibold text-[#171717]">
              7, Babar Block, New Garden Town, Lahore 54600, Pakistan
            </p>

            <div className="space-y-2 text-xs text-stone-600 pt-2 border-t border-stone-100">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#8B6F47]" />
                <span>Showroom Direct: <a href="tel:+924235831800" className="font-semibold text-[#171717] hover:underline">+92 42 35831800</a></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#8B6F47]" />
                <span>UAN Helpline: <a href="tel:+9242111203203" className="font-semibold text-[#171717] hover:underline">+92 42 111-203-203</a></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#8B6F47]" />
                <span>Mon – Sat: 10:30 AM to 8:30 PM (Sunday Closed)</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <a
                href="https://maps.google.com/?q=7+Babar+Block+New+Garden+Town+Lahore"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 bg-[#171717] hover:bg-[#8B6F47] text-white text-center rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions</span>
              </a>
              <a
                href="tel:+924235831800"
                className="py-2 px-4 border border-stone-300 hover:bg-stone-100 text-[#171717] rounded-lg text-xs font-semibold inline-flex items-center"
              >
                Call
              </a>
            </div>
          </div>

          {/* Head Office & Plant Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-500">
              <MapPin className="w-4 h-4" />
              <span>Head Office & Factory</span>
            </div>

            <p className="text-xs text-stone-700">
              56 Sultan Mehmood Road, Shalimar Town, Mehmood Booti, Lahore 54920, Pakistan
            </p>

            <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-100">
              <div>
                <span className="text-stone-400 block text-[11px]">Complaints & Inquiries:</span>
                <a href="mailto:complaints@interwoodmobel.com" className="font-semibold text-[#8B6F47] hover:underline">
                  complaints@interwoodmobel.com
                </a>
              </div>
              <div className="pt-1">
                <span className="text-stone-400 block text-[11px]">Corporate & Commercial:</span>
                <a href="mailto:corporate@interwoodmobel.com" className="font-semibold text-[#8B6F47] hover:underline">
                  corporate@interwoodmobel.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 sm:p-10 shadow-xs">
          <h2 className="text-xl font-editorial font-bold text-[#171717] mb-2">
            Send Showroom Inquiry
          </h2>
          <p className="text-xs text-stone-500 mb-6">
            Leave a message regarding custom sizing, showroom walk-throughs, or corporate turnkey projects.
          </p>

          {submitted && (
            <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl mb-6 flex items-start gap-3 text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Message Dispatched Successfully</strong>
                <span>Thank you. Our Lahore showroom support team will contact you within standard working hours.</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-600 mb-1 font-medium">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#8B6F47]"
                  placeholder="e.g. Asad Rehman"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-1 font-medium">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#8B6F47]"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-600 mb-1 font-medium">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#8B6F47]"
                  placeholder="0300-1234567"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-1 font-medium">Inquiry Topic</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#8B6F47]"
                >
                  <option value="Showroom Visit Inquiry">Showroom Visit & Consultation</option>
                  <option value="Product Availability & Sizing">Product Availability & Sizing</option>
                  <option value="Corporate / Bulk Office Orders">Corporate / Bulk Office Orders</option>
                  <option value="Delivery & Assembly Status">Delivery & Assembly Support</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-stone-600 mb-1 font-medium">Your Message *</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#8B6F47]"
                placeholder="Please describe the pieces or interior requirements you wish to discuss..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#171717] hover:bg-[#8B6F47] text-white rounded-lg font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 inline-flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Sending Message...' : 'Submit Message'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
