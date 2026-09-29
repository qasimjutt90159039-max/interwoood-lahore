import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle2, ChevronRight, Phone } from 'lucide-react';
import api from '../services/api.js';
import { Order } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';

export const MyOrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my');
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold font-editorial text-[#171717]">Sign In Required</h2>
        <p className="text-xs text-stone-500">Please sign in to view your orders.</p>
        <Link to="/login" className="inline-block px-6 py-2.5 bg-[#171717] text-white rounded-lg text-xs font-semibold uppercase">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-[#171717]/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-editorial font-normal text-[#171717]">
            Order History
          </h1>
          <p className="text-xs text-stone-500 mt-1">Track manufacturing, transit status and delivery</p>
        </div>
        <Link to="/shop" className="text-xs font-semibold text-[#8B6F47] hover:underline">
          &larr; Shop More Furniture
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-stone-200 rounded-xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-[#F7F5F1] text-[#8B6F47] rounded-full mx-auto flex items-center justify-center">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold font-editorial text-[#171717]">No Orders Found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            You haven't placed any furniture orders yet.
          </p>
          <Link to="/shop" className="inline-block px-6 py-2.5 bg-[#171717] text-white rounded-lg text-xs font-semibold uppercase">
            Browse Furniture
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-3 gap-2">
                <div>
                  <span className="text-[11px] text-stone-400 block">Order Number</span>
                  <strong className="text-sm font-mono text-[#171717]">{o.orderNumber}</strong>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[11px] text-stone-400 block">Placed On</span>
                    <span className="text-xs text-stone-700">{new Date(o.createdAt).toLocaleDateString()}</span>
                  </div>

                  <span className={`px-2.5 py-1 rounded text-xs font-bold tracking-wide uppercase ${
                    o.status === 'Delivered'
                      ? 'bg-emerald-50 text-emerald-700'
                      : o.status === 'Cancelled'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-amber-50 text-amber-800'
                  }`}>
                    {o.status}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="divide-y divide-stone-50">
                {o.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt="" className="w-12 h-12 rounded object-cover bg-stone-100" />
                      <div>
                        <p className="font-semibold text-[#171717]">{item.name}</p>
                        <span className="text-stone-400 text-[11px]">Qty: {item.quantity} · SKU: {item.SKU}</span>
                      </div>
                    </div>
                    <span className="font-semibold tabular-nums text-[#171717]">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-stone-100 text-xs text-stone-600 gap-2">
                <div>
                  <span>Destination: </span>
                  <strong className="text-stone-800">{o.shippingAddress.address}, {o.shippingAddress.city}</strong>
                  <span className="text-stone-400 ml-2">({o.paymentMethod})</span>
                </div>
                <div className="text-right text-sm">
                  <span>Total Amount: </span>
                  <strong className="text-[#171717] font-bold tabular-nums">Rs. {o.total.toLocaleString()}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
