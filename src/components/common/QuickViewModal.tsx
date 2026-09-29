import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, ShoppingBag, Star, Check } from 'lucide-react';
import { Product } from '../../types/index.js';
import { useCart } from '../../context/CartContext.js';
import { useWishlist } from '../../context/WishlistContext.js';
import { ImageWithFallback } from './ImageWithFallback.js';
import { WhatsAppButton } from './WhatsAppButton.js';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!product) return null;

  const isWishlisted = isInWishlist(product._id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden z-10 animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 z-20 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Images */}
          <div className="p-6 bg-[#F7F5F1] flex flex-col justify-center">
            <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-white border border-[#171717]/5">
              <ImageWithFallback
                src={product.images[selectedImage] || product.thumbnail}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-[#8B6F47]' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#8B6F47] mb-1">
                <span className="font-semibold uppercase tracking-wider">{product.category}</span>
                <span className="text-stone-500 font-mono text-[11px]">SKU: {product.SKU}</span>
              </div>

              <h2 className="text-lg md:text-xl font-bold text-[#171717] mb-2">{product.name}</h2>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-[#C9A66B]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-stone-500">
                  {product.rating.toFixed(1)} ({product.reviewsCount} reviews)
                </span>
                <span className="text-xs text-emerald-700 font-medium ml-2">● {product.stockStatus}</span>
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-xl font-bold text-[#171717] tabular-nums">
                  Rs. {product.price.toLocaleString()}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm text-stone-400 line-through tabular-nums">
                    Rs. {product.compareAtPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <p className="text-xs text-stone-600 leading-relaxed mb-4">
                {product.shortDescription || product.description}
              </p>

              {/* Quick Specs */}
              <div className="bg-[#F7F5F1] p-3 rounded-lg text-xs space-y-1 text-stone-700 mb-6">
                <div><strong>Material:</strong> {product.material}</div>
                <div><strong>Color:</strong> {product.color}</div>
                <div><strong>Dimensions:</strong> {product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height} {product.dimensions.unit}</div>
              </div>
            </div>

            <div className="space-y-3">
              {/* Stepper & Add to Bag */}
              <div className="flex gap-2">
                <div className="flex items-center border border-stone-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-stone-600 hover:bg-stone-100 rounded-l-lg"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-stone-600 hover:bg-stone-100 rounded-r-lg"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                    addedAnimation ? 'bg-emerald-700 text-white' : 'bg-[#171717] text-white hover:bg-[#8B6F47]'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className="p-2.5 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-700"
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#8B6F47] text-[#8B6F47]' : ''}`} />
                </button>
              </div>

              {/* WhatsApp Button */}
              <WhatsAppButton
                productName={product.name}
                productPrice={product.price}
                sku={product.SKU}
                variant="outline"
                className="w-full"
              />

              <div className="text-center pt-2">
                <Link
                  to={`/products/${product.slug}`}
                  onClick={onClose}
                  className="text-xs text-[#8B6F47] hover:underline font-semibold"
                >
                  View Full Product Specifications & Details &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
