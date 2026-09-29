import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, MapPin, Building, Lock } from 'lucide-react';
import api from '../services/api.js';
import { useCart } from '../context/CartContext.js';
import { useAuth } from '../context/AuthContext.js';

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, deliveryFee, discount, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: user?.name.split(' ')[0] || '',
    lastName: user?.name.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address?.street || '',
    city: user?.address?.city || 'Lahore',
    province: user?.address?.province || 'Punjab',
    postalCode: user?.address?.postalCode || '54600',
    orderNotes: '',
    paymentMethod: 'Cash on Delivery'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-editorial font-bold text-[#171717]">No Items in Bag</h2>
        <p className="text-xs text-stone-500">Please select furniture items before accessing checkout.</p>
        <Link to="/shop" className="inline-block px-6 py-2.5 bg-[#171717] text-white rounded-lg text-xs font-semibold uppercase">
          Go to Furniture Catalog
        </Link>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const orderPayload = {
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode,
          orderNotes: formData.orderNotes
        },
        items: items.map((i) => ({
          productId: i.product._id,
          name: i.product.name,
          SKU: i.product.SKU,
          price: i.product.price,
          quantity: i.quantity,
          image: i.product.images[0],
          color: i.selectedColor || i.product.color
        })),
        subtotal,
        deliveryFee,
        discount,
        total,
        paymentMethod: formData.paymentMethod
      };

      const res = await api.post('/orders', orderPayload);
      const createdOrder = res.data.order;
      clearCart();
      navigate(`/order-success/${createdOrder._id || createdOrder.orderNumber}`);
    } catch (err: any) {
      console.error('Order placement failed:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to place order. Please review your information.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pakistaniCities = [
    'Lahore',
    'Karachi',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
    'Multan',
    'Peshawar',
    'Sialkot',
    'Gujranwala',
    'Quetta',
    'Bahawalpur',
    'Sargodha'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-editorial font-normal text-[#171717]">
          Delivery & Checkout
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Complete your delivery details for white-glove transport and assembly.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Customer & Address Fields */}
        <div className="lg:col-span-2 space-y-8 bg-white p-6 sm:p-8 rounded-2xl border border-[#171717]/6 shadow-xs">
          {/* Contact Details */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#171717] mb-4 pb-2 border-b border-stone-100">
              1. Customer Contact
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-stone-600 mb-1">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#8B6F47]"
                  placeholder="e.g. Asad"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-1">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#8B6F47]"
                  placeholder="e.g. Rehman"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-1">Phone Number (Pakistani Mobile) *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#8B6F47]"
                  placeholder="0300-1234567"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#8B6F47]"
                  placeholder="name@example.com"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#171717] mb-4 pb-2 border-b border-stone-100">
              2. Shipping Address
            </h2>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-600 mb-1">Street Address, House / Plot Number, Sector *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#8B6F47]"
                  placeholder="House 14, Block C, Gulberg III"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone-600 mb-1">City *</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#8B6F47]"
                  >
                    {pakistaniCities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">Province *</label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#8B6F47]"
                  >
                    <option value="Punjab">Punjab</option>
                    <option value="Sindh">Sindh</option>
                    <option value="Islamabad Capital Territory">Islamabad Capital</option>
                    <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                    <option value="Balochistan">Balochistan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#8B6F47]"
                    placeholder="54600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 mb-1">Special Order / Delivery Notes (Floor, Lift, Gate Access)</label>
                <textarea
                  name="orderNotes"
                  value={formData.orderNotes}
                  onChange={handleChange}
                  rows={2}
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#8B6F47]"
                  placeholder="e.g. 2nd floor, elevator available, please call 1 hour prior to arrival."
                />
              </div>
            </div>
          </div>

          {/* Payment Options */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#171717] mb-4 pb-2 border-b border-stone-100">
              3. Payment Selection
            </h2>
            <div className="space-y-3 text-xs">
              <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                formData.paymentMethod === 'Cash on Delivery'
                  ? 'border-[#8B6F47] bg-[#F7F5F1]'
                  : 'border-stone-200 hover:border-stone-300'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked={formData.paymentMethod === 'Cash on Delivery'}
                  onChange={handleChange}
                  className="mt-0.5 text-[#8B6F47]"
                />
                <div>
                  <strong className="text-[#171717] block">Cash on Delivery (Standard COD)</strong>
                  <span className="text-stone-500 text-[11px]">Pay upon delivery and on-site assembly inspection across Pakistan.</span>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                formData.paymentMethod === 'Lahore Showroom Payment'
                  ? 'border-[#8B6F47] bg-[#F7F5F1]'
                  : 'border-stone-200 hover:border-stone-300'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Lahore Showroom Payment"
                  checked={formData.paymentMethod === 'Lahore Showroom Payment'}
                  onChange={handleChange}
                  className="mt-0.5 text-[#8B6F47]"
                />
                <div>
                  <strong className="text-[#171717] block">Lahore Showroom Payment & Inspection</strong>
                  <span className="text-stone-500 text-[11px]">
                    Settle payment in person at 7, Babar Block, New Garden Town, Lahore prior to dispatch.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary & Place Order */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#171717]/6 p-6 space-y-6 shadow-xs">
            <h2 className="text-base font-bold text-[#171717] pb-3 border-b border-stone-200">
              Order Review ({items.length})
            </h2>

            {/* Item list */}
            <div className="divide-y divide-stone-100 max-h-60 overflow-y-auto pr-1">
              {items.map((i) => (
                <div key={i.product._id} className="py-2.5 flex justify-between gap-3 text-xs">
                  <div className="truncate">
                    <p className="font-semibold text-[#171717] truncate">{i.product.name}</p>
                    <span className="text-stone-400 text-[11px]">Qty: {i.quantity} · {i.selectedColor || i.product.color}</span>
                  </div>
                  <span className="font-semibold tabular-nums text-[#171717] shrink-0">
                    Rs. {(i.product.price * i.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 text-xs text-stone-600 pt-3 border-t border-stone-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#171717] tabular-nums">
                  Rs. {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery (White-Glove)</span>
                <span className="font-semibold text-[#171717] tabular-nums">
                  {deliveryFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `Rs. ${deliveryFee.toLocaleString()}`}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#8B6F47]">
                  <span>Voucher Discount</span>
                  <span className="font-semibold tabular-nums">-Rs. {discount.toLocaleString()}</span>
                </div>
              )}
              <div className="pt-3 border-t border-stone-200 flex justify-between text-base font-bold text-[#171717]">
                <span>Total Payable</span>
                <span className="tabular-nums">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-[#171717] hover:bg-[#8B6F47] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{isSubmitting ? 'Recording Order...' : 'Place Order'}</span>
            </button>

            <div className="space-y-2 text-[11px] text-stone-500 pt-2 border-t border-stone-100">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#8B6F47] shrink-0" />
                <span>Complimentary Lahore assembly service</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#8B6F47] shrink-0" />
                <span>Showroom pickup option available at New Garden Town</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8B6F47] shrink-0" />
                <span>No online credit card required for COD orders</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
