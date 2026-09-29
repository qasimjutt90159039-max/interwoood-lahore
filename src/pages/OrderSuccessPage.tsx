import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Phone, MapPin, Package, ArrowRight } from 'lucide-react';
import api from '../services/api.js';
import { Order } from '../types/index.js';

export const OrderSuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20 space-y-8">
      {/* Success Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 text-center space-y-4 shadow-xs">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-[#8B6F47]">
          Order Confirmed
        </span>

        <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-[#171717]">
          Thank You for Choosing Interwood
        </h1>

        <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto leading-relaxed font-light">
          Your order has been recorded in our production and fulfillment system. Our Lahore concierge team will contact you shortly to coordinate delivery logistics and on-site assembly.
        </p>

        {order && (
          <div className="p-4 bg-[#F7F5F1] rounded-xl max-w-md mx-auto text-left space-y-2 text-xs">
            <div className="flex justify-between border-b border-stone-200 pb-2">
              <span className="text-stone-500">Order Number</span>
              <strong className="text-[#171717] font-mono">{order.orderNumber}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Customer</span>
              <span className="font-semibold text-[#171717]">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Contact</span>
              <span className="text-[#171717]">{order.customerPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Delivery City</span>
              <span className="text-[#171717]">{order.shippingAddress.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Payment Mode</span>
              <span className="text-[#8B6F47] font-semibold">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between border-t border-stone-200 pt-2 font-bold text-sm text-[#171717]">
              <span>Total Payable</span>
              <span className="tabular-nums">Rs. {order.total.toLocaleString()}</span>
            </div>
          </div>
        )}

        <div className="pt-4 flex flex-wrap justify-center gap-3">
          <Link
            to="/shop"
            className="px-6 py-2.5 bg-[#171717] hover:bg-[#8B6F47] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Continue Shopping
          </Link>
          <a
            href="tel:+9242111203203"
            className="px-6 py-2.5 border border-stone-300 hover:border-stone-400 text-stone-700 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Showroom Concierge</span>
          </a>
        </div>
      </div>
    </div>
  );
};
