import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext.js';
import { useCart } from '../context/CartContext.js';
import { ImageWithFallback } from '../components/common/ImageWithFallback.js';

export const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 bg-[#F7F5F1] text-[#8B6F47] rounded-full mx-auto flex items-center justify-center">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-editorial font-bold text-[#171717]">Your Wishlist is Empty</h2>
        <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
          Keep track of your favorite bedroom suites, modular sofas, and executive office furniture pieces.
        </p>
        <Link to="/shop" className="inline-block px-8 py-3 bg-[#171717] hover:bg-[#8B6F47] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors">
          Browse Furniture Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-[#171717]/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-editorial font-normal text-[#171717]">
            Saved Wishlist
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {wishlist.length} saved furniture {wishlist.length === 1 ? 'piece' : 'pieces'}
          </p>
        </div>
        <button
          onClick={clearWishlist}
          className="text-xs text-red-600 hover:underline"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {wishlist.map((product) => (
          <div key={product._id} className="bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col justify-between p-3 sm:p-4 group">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-[#F7F5F1] mb-3">
              <Link to={`/products/${product.slug}`}>
                <ImageWithFallback
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <button
                onClick={() => toggleWishlist(product)}
                className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-stone-500 hover:text-red-600 shadow-xs"
                aria-label="Remove from wishlist"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1 mb-3">
              <span className="text-[10px] font-bold text-[#8B6F47] uppercase tracking-wider block">
                {product.category}
              </span>
              <Link
                to={`/products/${product.slug}`}
                className="text-xs font-semibold text-[#171717] hover:text-[#8B6F47] line-clamp-1"
              >
                {product.name}
              </Link>
              <div className="text-xs font-bold text-[#171717] tabular-nums">
                Rs. {product.price.toLocaleString()}
              </div>
            </div>

            <button
              onClick={() => addToCart(product, 1)}
              className="w-full py-2 bg-[#171717] hover:bg-[#8B6F47] text-white rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Bag</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
