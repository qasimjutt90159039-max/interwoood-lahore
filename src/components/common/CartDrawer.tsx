import React from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext.js';
import { ImageWithFallback } from './ImageWithFallback.js';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    total
  } = useCart();

  if (!isCartDrawerOpen) return null;

  const freeDeliveryThreshold = 100000;
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));
  const remainingForFreeDelivery = freeDeliveryThreshold - subtotal;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-[#171717]/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#8B6F47]" />
              <h2 className="text-base font-semibold text-[#171717]">Shopping Bag</h2>
              <span className="text-xs text-stone-500 font-medium">({items.length} items)</span>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-lg text-stone-500 hover:text-[#171717] hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          <div className="bg-[#F7F5F1] px-5 py-3 border-b border-[#171717]/5">
            <div className="flex justify-between text-xs text-stone-600 mb-1.5">
              <span>
                {remainingForFreeDelivery <= 0 ? (
                  <strong className="text-[#8B6F47]">Complimentary Lahore Delivery Unlocked!</strong>
                ) : (
                  <>Add <strong>Rs. {remainingForFreeDelivery.toLocaleString()}</strong> for free delivery</>
                )}
              </span>
              <span className="font-semibold text-[#171717]">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8B6F47] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-[#171717]/5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-[#F7F5F1] flex items-center justify-center mb-4 text-[#8B6F47]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-[#171717] mb-1">Your bag is empty</h3>
                <p className="text-xs text-stone-500 mb-6 max-w-xs">
                  Discover handcrafted Pakistani luxury sofas, dining sets, and executive furniture.
                </p>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="px-6 py-2.5 bg-[#171717] text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-[#8B6F47] transition-colors"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product._id} className="py-4 flex gap-3">
                  <div className="w-20 h-20 shrink-0 bg-[#F7F5F1] rounded-lg overflow-hidden border border-[#171717]/5">
                    <ImageWithFallback
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          to={`/products/${item.product.slug}`}
                          onClick={() => setIsCartDrawerOpen(false)}
                          className="text-xs font-semibold text-[#171717] hover:text-[#8B6F47] line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          className="text-stone-400 hover:text-red-600 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-[11px] text-stone-500 block">
                        {item.selectedColor || item.product.color}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-200 rounded-md">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="p-1 hover:bg-stone-100 text-stone-600"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold tabular-nums text-[#171717]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="p-1 hover:bg-stone-100 text-stone-600"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-xs font-bold text-[#171717] tabular-nums">
                        Rs. {(item.product.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#171717]/10 bg-[#F7F5F1]">
              <div className="space-y-1.5 text-xs text-stone-600 mb-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#171717] tabular-nums">
                    Rs. {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="font-semibold text-[#171717] tabular-nums">
                    {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#171717] pt-2 border-t border-stone-200">
                  <span>Estimated Total</span>
                  <span className="tabular-nums">Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="py-2.5 px-3 text-center border border-[#171717] text-[#171717] text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-white transition-colors"
                >
                  View Cart
                </Link>
                <Link
                  to="/checkout"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="py-2.5 px-3 text-center bg-[#171717] text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-[#8B6F47] transition-colors flex items-center justify-center gap-1"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
