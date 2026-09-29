import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Truck, Shield, Ruler, CheckCircle2, ChevronRight } from 'lucide-react';
import api from '../services/api.js';
import { Product, Review } from '../types/index.js';
import { useCart } from '../context/CartContext.js';
import { useWishlist } from '../context/WishlistContext.js';
import { ImageWithFallback } from '../components/common/ImageWithFallback.js';
import { WhatsAppButton } from '../components/common/WhatsAppButton.js';
import { ProductCard } from '../components/common/ProductCard.js';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'dims' | 'materials' | 'reviews' | 'delivery'>('desc');

  // Review form
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${slug}`);
        setProduct(res.data.product);
        setRelatedProducts(res.data.related || []);

        if (res.data.product) {
          const revRes = await api.get(`/products/${res.data.product._id}/reviews`);
          setReviews(revRes.data.reviews || []);
        }
      } catch (err) {
        console.error('Failed to load product detail', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-8">
        <div className="h-6 bg-stone-200 rounded w-1/4" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-stone-200 rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 bg-stone-200 rounded w-3/4" />
            <div className="h-6 bg-stone-200 rounded w-1/3" />
            <div className="h-20 bg-stone-200 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-editorial font-bold text-[#171717]">Product Not Found</h2>
        <p className="text-xs text-stone-500">The furniture item you requested may have been relocated or updated.</p>
        <Link to="/shop" className="inline-block px-6 py-2.5 bg-[#171717] text-white rounded-lg text-xs font-semibold uppercase">
          Back to Shop
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product._id);

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !reviewComment) return;

    try {
      const res = await api.post(`/products/${product._id}/reviews`, {
        userName: reviewerName,
        rating: reviewRating,
        comment: reviewComment
      });
      setReviews([res.data.review, ...reviews]);
      setReviewSubmitted(true);
      setReviewerName('');
      setReviewComment('');
    } catch (err) {
      console.error('Failed to submit review', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Breadcrumb */}
      <div className="text-xs text-stone-500 flex items-center gap-1.5 flex-wrap">
        <Link to="/" className="hover:text-[#171717]">Home</Link>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <Link to="/shop" className="hover:text-[#171717]">Furniture</Link>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-[#171717]">
          {product.category}
        </Link>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <span className="text-[#171717] font-medium truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Contiguous Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* Gallery / Image Display */}
        <div className="space-y-4">
          <div className="relative aspect-4/3 sm:aspect-square bg-[#F7F5F1] rounded-2xl overflow-hidden border border-[#171717]/5 shadow-xs">
            <ImageWithFallback
              src={product.images[selectedImage] || product.thumbnail}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discount && product.discount > 0 && (
              <span className="absolute top-4 left-4 bg-white/95 text-[#8B6F47] px-2.5 py-1 rounded text-xs font-bold tracking-wider shadow-xs">
                {product.discount}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === idx ? 'border-[#8B6F47] shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Purchase Info Column */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-[#8B6F47] mb-2">
              <span className="font-bold uppercase tracking-widest">{product.category}</span>
              <span className="font-mono text-stone-500">SKU: {product.SKU}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-editorial font-normal text-[#171717] mb-3">
              {product.name}
            </h1>

            {/* Ratings & Stock */}
            <div className="flex items-center gap-3 text-xs text-stone-600 mb-4">
              <div className="flex text-[#C9A66B]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="font-semibold text-[#171717]">{product.rating.toFixed(1)}</span>
              <span>·</span>
              <a href="#reviews" onClick={() => setActiveTab('reviews')} className="hover:underline">
                {reviews.length || product.reviewsCount} Customer Reviews
              </a>
              <span>·</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{product.stockStatus} ({product.stock} available)</span>
              </span>
            </div>

            {/* Price Block */}
            <div className="flex items-baseline gap-4 py-3 border-y border-[#171717]/10">
              <span className="text-2xl sm:text-3xl font-bold text-[#171717] tabular-nums">
                Rs. {product.price.toLocaleString()}
              </span>
              {product.compareAtPrice && (
                <span className="text-base text-stone-400 line-through tabular-nums">
                  Rs. {product.compareAtPrice.toLocaleString()}
                </span>
              )}
              <span className="text-xs text-stone-500">Inclusive of all local taxes</span>
            </div>
          </div>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#F7F5F1] rounded-lg">
              <span className="text-stone-500 block text-[11px]">Primary Material</span>
              <span className="font-semibold text-[#171717]">{product.material}</span>
            </div>
            <div className="p-3 bg-[#F7F5F1] rounded-lg">
              <span className="text-stone-500 block text-[11px]">Color / Finish</span>
              <span className="font-semibold text-[#171717]">{product.color}</span>
            </div>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-stone-300 rounded-lg bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2.5 text-stone-600 hover:bg-stone-100 rounded-l-lg"
                >
                  -
                </button>
                <span className="px-4 text-sm font-semibold text-[#171717] tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-2.5 text-stone-600 hover:bg-stone-100 rounded-r-lg"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                onClick={() => addToCart(product, quantity)}
                className="flex-1 py-3 px-6 bg-[#171717] hover:bg-[#8B6F47] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>

              {/* Wishlist */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-label="Wishlist"
                className="p-3 border border-stone-300 rounded-lg hover:bg-stone-50 text-stone-700 transition-colors"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#8B6F47] text-[#8B6F47]' : ''}`} />
              </button>
            </div>

            {/* Buy Now Fast Checkout */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full py-3 px-6 bg-[#8B6F47] hover:bg-[#725a38] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
            >
              Buy Now — Instant Checkout
            </button>

            {/* WhatsApp Inquiry Button with prefilled message */}
            <WhatsAppButton
              productName={product.name}
              productPrice={product.price}
              sku={product.SKU}
              variant="outline"
              className="w-full py-3"
            />
          </div>

          {/* Trust Guarantees */}
          <div className="pt-4 border-t border-stone-200 space-y-2.5 text-xs text-stone-600">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#8B6F47] shrink-0" />
              <span>Complimentary White-Glove delivery in Lahore on orders above Rs. 100,000</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-[#8B6F47] shrink-0" />
              <span>{product.warranty}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Ruler className="w-4 h-4 text-[#8B6F47] shrink-0" />
              <span>Dimensions: {product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height} {product.dimensions.unit}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Tabs Module */}
      <section id="reviews" className="bg-white rounded-2xl border border-[#171717]/6 p-6 sm:p-10 shadow-xs">
        {/* Tab Controls */}
        <div className="flex border-b border-stone-200 overflow-x-auto gap-4 sm:gap-8 pb-3">
          {[
            { id: 'desc', label: 'Description' },
            { id: 'specs', label: 'Specifications' },
            { id: 'dims', label: 'Dimensions' },
            { id: 'materials', label: 'Materials & Care' },
            { id: 'reviews', label: `Reviews (${reviews.length || product.reviewsCount})` },
            { id: 'delivery', label: 'Delivery Information' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 -mb-3.5 ${
                activeTab === tab.id
                  ? 'border-[#8B6F47] text-[#171717]'
                  : 'border-transparent text-stone-500 hover:text-[#171717]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Panes */}
        <div className="pt-8">
          {activeTab === 'desc' && (
            <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
              <p>{product.description}</p>
              <p>Designed and built at the Interwood Lahore works, this piece marries structural integrity with contemporary ergonomics. Carefully proportioned to fit both modern Pakistani apartments and spacious executive suites.</p>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-2xl">
              <div className="divide-y divide-stone-100 text-xs sm:text-sm">
                {product.specifications.map((spec, i) => (
                  <div key={i} className="py-2.5 flex justify-between">
                    <span className="font-semibold text-stone-600">{spec.label}</span>
                    <span className="text-[#171717]">{spec.value}</span>
                  </div>
                ))}
                <div className="py-2.5 flex justify-between">
                  <span className="font-semibold text-stone-600">Model SKU</span>
                  <span className="text-[#171717] font-mono">{product.SKU}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dims' && (
            <div className="max-w-2xl space-y-4 text-xs sm:text-sm text-stone-700">
              <div className="grid grid-cols-3 gap-4 p-4 bg-[#F7F5F1] rounded-xl text-center">
                <div>
                  <span className="block text-stone-500 text-[11px]">Length</span>
                  <strong className="text-base text-[#171717]">{product.dimensions.length} {product.dimensions.unit}</strong>
                </div>
                <div>
                  <span className="block text-stone-500 text-[11px]">Width / Depth</span>
                  <strong className="text-base text-[#171717]">{product.dimensions.width} {product.dimensions.unit}</strong>
                </div>
                <div>
                  <span className="block text-stone-500 text-[11px]">Height</span>
                  <strong className="text-base text-[#171717]">{product.dimensions.height} {product.dimensions.unit}</strong>
                </div>
              </div>
              <p className="text-xs text-stone-500">
                Please verify door clearance, stairwells, and lift dimensions prior to delivery.
              </p>
            </div>
          )}

          {activeTab === 'materials' && (
            <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
              <h4 className="font-bold text-[#171717]">Materials & Finishes</h4>
              <p>Constructed with {product.material.toLowerCase()}. All wooden joints are reinforced with precision dowels and high-strength polymer bonding for lifelong rigidity.</p>
              <h4 className="font-bold text-[#171717] pt-2">Maintenance Advice</h4>
              <ul className="list-disc pl-5 space-y-1 text-xs text-stone-600">
                <li>Dust regularly with a dry microfibre cloth.</li>
                <li>Keep away from prolonged direct harsh sunlight to preserve veneer sheen.</li>
                <li>Clean spills immediately with an absorbent towel.</li>
              </ul>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Existing Reviews */}
              <div className="space-y-4 max-w-3xl">
                {reviews.length === 0 ? (
                  <p className="text-xs text-stone-500">No customer reviews yet. Be the first to review this piece.</p>
                ) : (
                  reviews.map((r) => (
                    <div key={r._id} className="p-4 bg-[#F7F5F1] rounded-xl space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#171717]">{r.userName}</span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Verified Purchase</span>
                        </div>
                        <span className="text-[11px] text-stone-400">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex text-[#C9A66B]">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <p className="font-semibold text-[#171717]">{r.title}</p>
                      <p className="text-stone-600 leading-relaxed">{r.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Review Form */}
              <div className="max-w-xl p-6 border border-stone-200 rounded-xl space-y-4">
                <h4 className="text-sm font-bold text-[#171717]">Submit Customer Feedback</h4>
                {reviewSubmitted ? (
                  <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg">
                    Thank you! Your feedback has been recorded for this product.
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-stone-600 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        required
                        className="w-full p-2 border border-stone-300 rounded-md"
                        placeholder="e.g. Asad Rehman"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 mb-1">Rating</label>
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="w-full p-2 border border-stone-300 rounded-md"
                      >
                        <option value={5}>5 Stars — Outstanding</option>
                        <option value={4}>4 Stars — Very Good</option>
                        <option value={3}>3 Stars — Average</option>
                        <option value={2}>2 Stars — Needs Improvement</option>
                        <option value={1}>1 Star — Poor</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-stone-600 mb-1">Your Review</label>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        required
                        rows={3}
                        className="w-full p-2 border border-stone-300 rounded-md"
                        placeholder="Share your experience regarding material quality, finish and delivery..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#171717] text-white rounded-md text-xs font-semibold uppercase tracking-wider hover:bg-[#8B6F47]"
                    >
                      Post Review
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
              <h4 className="font-bold text-[#171717]">Lahore Metropolitan Region</h4>
              <p>Delivery is carried out by Interwood's specialized transit team. Complimentary delivery is automatically applied to orders of Rs. 100,000 or greater. Professional on-site assembly is included.</p>
              <h4 className="font-bold text-[#171717] pt-2">Rest of Pakistan</h4>
              <p>For Karachi, Islamabad, Rawalpindi, Peshawar, Faisalabad, and other major cities, items are securely crated and dispatched via bonded logistics providers. Tracking details will be shared via SMS and email.</p>
            </div>
          )}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-editorial text-[#171717]">
              Complementary Pieces
            </h2>
            <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="text-xs font-semibold text-[#8B6F47] hover:underline">
              View All {product.category} &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
