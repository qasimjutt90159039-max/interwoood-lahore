import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext.js';
import { ImageWithFallback } from '../components/common/ImageWithFallback.js';

export const CartPage: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    discount,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    setCouponMessage(null);
    const result = await applyCoupon(couponCode.trim());
    setIsApplyingCoupon(false);

    if (result.success) {
      setCouponMessage({ type: 'success', text: result.message });
      setCouponCode('');
    } else {
      setCouponMessage({ type: 'error', text: result.message });
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-[#F7F5F1] text-[#8B6F47] mx-auto flex items-center justify-center">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-editorial font-bold text-[#171717]">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
          Explore our handcrafted Pakistani furniture catalog to elevate your home or corporate executive workspace.
        </p>
        <div className="pt-2">
          <Link
            to="/shop"
            className="px-8 py-3 bg-[#171717] hover:bg-[#8B6F47] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors inline-block"
          >
            Explore Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-[#171717]/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-editorial font-normal text-[#171717]">
            Shopping Bag
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            {items.length} unique furniture {items.length === 1 ? 'item' : 'items'} selected
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:underline font-medium"
        >
          Clear Bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-[#171717]/6 divide-y divide-stone-100 overflow-hidden shadow-xs">
            {items.map((item) => (
              <div key={item.product._id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-[#F7F5F1] border border-stone-100">
                  <ImageWithFallback
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <span className="text-[11px] font-bold text-[#8B6F47] uppercase tracking-wider block">
                    {item.product.category}
                  </span>
                  <Link
                    to={`/products/${item.product.slug}`}
                    className="text-sm font-semibold text-[#171717] hover:text-[#8B6F47] transition-colors line-clamp-1"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-xs text-stone-500">
                    Finish: {item.selectedColor || item.product.color} · SKU: {item.product.SKU}
                  </p>
                  <div className="text-xs text-stone-600 pt-1">
                    Unit Price: <span className="font-semibold tabular-nums">Rs. {item.product.price.toLocaleString()}</span>
                  </div>
                </div>

                {/* Stepper & Line Price */}
                <div className="flex items-center sm:flex-col sm:items-end justify-between w-full sm:w-auto gap-4 pt-2 sm:pt-0">
                  <div className="flex items-center border border-stone-300 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 rounded-l-lg"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-semibold tabular-nums text-[#171717]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 rounded-r-lg"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-[#171717] tabular-nums">
                      Rs. {(item.product.price * item.quantity).toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="text-stone-400 hover:text-red-600 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              to="/shop"
              className="text-xs font-semibold text-[#8B6F47] hover:underline"
            >
              &larr; Continue Exploring Furniture
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#171717]/6 p-6 space-y-6 shadow-xs">
            <h2 className="text-base font-bold text-[#171717] pb-3 border-b border-stone-200">
              Order Summary
            </h2>

            {/* Subtotal, delivery, discounts */}
            <div className="space-y-3 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#171717] tabular-nums">
                  Rs. {subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Delivery (White-Glove)</span>
                <span className="font-semibold text-[#171717] tabular-nums">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    `Rs. ${deliveryFee.toLocaleString()}`
                  )}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-[#8B6F47]">
                  <span>Promo Discount ({appliedCoupon?.code})</span>
                  <span className="font-semibold tabular-nums">-Rs. {discount.toLocaleString()}</span>
                </div>
              )}

              <div className="pt-3 border-t border-stone-200 flex justify-between text-base font-bold text-[#171717]">
                <span>Grand Total</span>
                <span className="tabular-nums">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Coupon Code Input */}
            <div className="pt-2 border-t border-stone-100">
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-[#F7F5F1] rounded-lg text-xs">
                  <div className="flex items-center gap-1.5 text-[#8B6F47] font-semibold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{appliedCoupon.code} applied ({appliedCoupon.discountPercent}% off)</span>
                  </div>
                  <button onClick={removeCoupon} className="text-stone-400 hover:text-red-600">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wider">
                    Promotional Voucher
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. INTERWOOD10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 p-2 text-xs uppercase border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#8B6F47]"
                    />
                    <button
                      type="submit"
                      disabled={isApplyingCoupon}
                      className="px-4 py-2 bg-[#171717] text-white text-xs font-semibold rounded-lg hover:bg-[#8B6F47] transition-colors disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                  {couponMessage && (
                    <p className={`text-[11px] mt-1 ${couponMessage.type === 'success' ? 'text-emerald-700' : 'text-red-600'}`}>
                      {couponMessage.text}
                    </p>
                  )}
                  <p className="text-[11px] text-stone-400">Try demo code: <strong className="text-stone-700">INTERWOOD10</strong></p>
                </form>
              )}
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 px-6 bg-[#171717] hover:bg-[#8B6F47] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-2 border-t border-stone-100">
              <ShieldCheck className="w-4 h-4 text-[#8B6F47] shrink-0" />
              <span>Safe & Verified Pakistani Checkout · Cash on Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
