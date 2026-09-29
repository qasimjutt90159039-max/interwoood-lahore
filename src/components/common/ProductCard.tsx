import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../../types/index.js';
import { useCart } from '../../context/CartContext.js';
import { useWishlist } from '../../context/WishlistContext.js';
import { ImageWithFallback } from './ImageWithFallback.js';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product._id);

  const formattedPrice = `Rs. ${product.price.toLocaleString('en-PK')}`;
  const formattedOriginalPrice = product.compareAtPrice
    ? `Rs. ${product.compareAtPrice.toLocaleString('en-PK')}`
    : null;

  return (
    <div className="group relative flex flex-col bg-white border border-[#171717]/6 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Product Image Stage */}
      <div className="relative aspect-4/3 sm:aspect-square bg-[#F7F5F1] overflow-hidden">
        <Link to={`/products/${product.slug}`} className="block w-full h-full">
          <ImageWithFallback
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Minimal text badge if discounted */}
        {product.discount && product.discount > 0 ? (
          <div className="absolute top-3 left-3 text-[11px] font-semibold tracking-wider text-[#8B6F47] bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded shadow-xs">
            {product.discount}% OFF
          </div>
        ) : product.bestseller ? (
          <div className="absolute top-3 left-3 text-[11px] font-medium tracking-wider text-[#171717] bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded shadow-xs">
            BESTSELLER
          </div>
        ) : null}

        {/* Quick action buttons floating on image */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            className="p-2 rounded-full bg-white text-[#171717] hover:text-[#8B6F47] shadow-sm hover:shadow transition-colors"
          >
            <Heart
              className={`w-4 h-4 ${isWishlisted ? 'fill-[#8B6F47] text-[#8B6F47]' : 'text-stone-700'}`}
            />
          </button>

          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              aria-label="Quick view"
              className="p-2 rounded-full bg-white text-[#171717] hover:text-[#8B6F47] shadow-sm hover:shadow transition-colors"
            >
              <Eye className="w-4 h-4 text-stone-700" />
            </button>
          )}
        </div>

        {/* Hover Quick Add to Cart Bar */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-200 hidden sm:block">
          <button
            type="button"
            onClick={() => addToCart(product, 1)}
            className="w-full py-2 px-3 bg-white hover:bg-[#171717] text-[#171717] hover:text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1">
        {/* Unboxed Category & Rating */}
        <div className="flex items-center justify-between text-xs text-[#8B6F47] mb-1">
          <span className="font-medium uppercase tracking-wider text-[11px] truncate">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-[#171717] text-[11px] font-medium shrink-0">
            <Star className="w-3 h-3 fill-[#C9A66B] text-[#C9A66B]" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Product Title */}
        <Link
          to={`/products/${product.slug}`}
          className="text-sm font-semibold text-[#171717] group-hover:text-[#8B6F47] line-clamp-1 transition-colors mb-1.5"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Material & Dimension callout */}
        <p className="text-xs text-stone-500 line-clamp-1 mb-3">
          {product.material}
        </p>

        {/* Price & Mobile Add Button */}
        <div className="mt-auto pt-2 border-t border-[#171717]/6 flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-[#171717] tabular-nums">
              {formattedPrice}
            </div>
            {formattedOriginalPrice && (
              <div className="text-xs text-stone-400 line-through tabular-nums">
                {formattedOriginalPrice}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => addToCart(product, 1)}
            className="sm:hidden p-2 rounded-lg bg-[#171717] text-white hover:bg-[#8B6F47] transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
