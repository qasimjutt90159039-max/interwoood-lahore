import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, MapPin, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import api from '../services/api.js';
import { Product, Category } from '../types/index.js';
import { ProductCard } from '../components/common/ProductCard.js';
import { QuickViewModal } from '../components/common/QuickViewModal.js';
import { ImageWithFallback } from '../components/common/ImageWithFallback.js';

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [activeCollectionTab, setActiveCollectionTab] = useState<'all' | 'living' | 'bedroom' | 'dining' | 'office'>('all');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [catsRes, featRes, newRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?featured=true&limit=8'),
          api.get('/products?newArrival=true&limit=8')
        ]);
        setCategories(catsRes.data.categories || []);
        setFeaturedProducts(featRes.data.products || []);
        setNewArrivals(newRes.data.products || []);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const collectionFilteredProducts = featuredProducts.filter((p) => {
    if (activeCollectionTab === 'all') return true;
    if (activeCollectionTab === 'living') return p.category.includes('Sofas') || p.category.includes('Chairs') || p.category.includes('Coffee');
    if (activeCollectionTab === 'bedroom') return p.category.includes('Beds') || p.category.includes('Bedside');
    if (activeCollectionTab === 'dining') return p.category.includes('Dining');
    if (activeCollectionTab === 'office') return p.category.includes('Office');
    return true;
  });

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[580px] lg:min-h-[700px] flex items-center bg-[#171717] overflow-hidden text-white">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=85"
            alt="Interwood Lahore Luxury Furniture"
            className="w-full h-full object-cover opacity-45 transform scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A66B]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interwood Lahore · Modern Pakistani Living</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight font-editorial text-balance">
              Furniture Designed for Modern Living
            </h1>

            <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed max-w-xl">
              Discover thoughtfully designed furniture for homes, offices and contemporary spaces. Handcrafted with seasoned timbers, precision veneers, and timeless Pakistani craftsmanship.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to="/shop"
                className="px-8 py-3.5 bg-[#C9A66B] hover:bg-[#b59257] text-[#171717] font-semibold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2"
              >
                <span>Shop Furniture</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/shop?featured=true"
                className="px-8 py-3.5 border border-white/30 hover:border-white text-white font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-2 hover:bg-white/10"
              >
                <span>Explore Collections</span>
              </Link>
            </div>

            {/* Quiet Showroom Kicker */}
            <div className="pt-6 border-t border-white/15 flex items-center gap-3 text-xs text-stone-400">
              <MapPin className="w-4 h-4 text-[#C9A66B] shrink-0" />
              <span>Lahore Flagship Showroom: 7, Babar Block, New Garden Town</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY SECTION (12 Categories Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#8B6F47] block mb-1">
              Architecture & Form
            </span>
            <h2 className="text-2xl sm:text-3xl font-normal font-editorial text-[#171717]">
              Curated Furniture Categories
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-[#8B6F47] hover:text-[#171717] transition-colors inline-flex items-center gap-1 uppercase tracking-wider"
          >
            <span>View All 130+ Products</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group relative flex flex-col bg-white border border-[#171717]/6 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-4/3 overflow-hidden bg-[#F7F5F1]">
                <ImageWithFallback
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold text-[#171717] group-hover:text-[#8B6F47] transition-colors">
                      {cat.name}
                    </h3>
                    <span className="text-[11px] text-stone-500 font-medium tabular-nums">
                      {cat.productCount} items
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#8B6F47]">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED COLLECTIONS TABS & GRID */}
      <section className="bg-white py-16 sm:py-20 border-y border-[#171717]/6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#8B6F47] block mb-1">
                Selected Work
              </span>
              <h2 className="text-2xl sm:text-3xl font-normal font-editorial text-[#171717]">
                Featured Masterpieces
              </h2>
            </div>

            {/* Filter buttons - functional segmented controls per frontend-design */}
            <div className="flex items-center gap-1.5 p-1 bg-[#F7F5F1] rounded-lg overflow-x-auto">
              {[
                { id: 'all', label: 'All Collections' },
                { id: 'living', label: 'Living' },
                { id: 'bedroom', label: 'Bedroom' },
                { id: 'dining', label: 'Dining' },
                { id: 'office', label: 'Office' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCollectionTab(tab.id as any)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    activeCollectionTab === tab.id
                      ? 'bg-white text-[#171717] shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-[#171717]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {collectionFilteredProducts.slice(0, 8).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#171717] hover:bg-[#8B6F47] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
            >
              <span>Explore Complete Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. EDITORIAL STORY SECTION: CRAFTSMANSHIP & LAHORE HERITAGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#EDE8DF] rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 items-center">
          <div className="p-8 sm:p-12 lg:p-16 space-y-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#8B6F47]">
              Crafted in Lahore
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal font-editorial text-[#171717] text-balance">
              Precision Engineering Meets Timeless Pakistani Craftsmanship
            </h2>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
              From our state-of-the-art facility at Shalimar Town, Mehmood Booti to our flagship showroom in New Garden Town, Interwood sets the benchmark in furniture manufacturing. Every piece undergoes rigorous seasoning, multi-step structural validation, and hand-finished polishing.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#171717]/10">
              <div>
                <div className="text-2xl font-bold font-editorial text-[#171717]">130+</div>
                <div className="text-xs text-stone-600 mt-0.5">Bespoke Catalog Items</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-editorial text-[#171717]">100%</div>
                <div className="text-xs text-stone-600 mt-0.5">White-Glove Assembly</div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#171717] hover:text-[#8B6F47] transition-colors"
              >
                <span>Read Brand Heritage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="h-full min-h-[360px] lg:min-h-[500px]">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1540518614846-7ede433c4b4d?auto=format&fit=crop&w=1200&q=80"
              alt="Interwood Lahore Bedroom Crafts"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 5. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#8B6F47] block mb-1">
              Fresh Off The Line
            </span>
            <h2 className="text-2xl sm:text-3xl font-normal font-editorial text-[#171717]">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/shop?newArrival=true"
            className="text-xs font-semibold text-[#8B6F47] hover:text-[#171717] inline-flex items-center gap-1 uppercase tracking-wider"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.slice(0, 4).map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* 6. LAHORE SHOWROOM VISIT PROMO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-[#171717] text-white rounded-2xl p-8 sm:p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A66B]">
              Showroom Consultation
            </span>
            <h2 className="text-2xl sm:text-3xl font-editorial font-normal leading-tight">
              Experience Interwood Live at New Garden Town, Lahore
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Explore tactile material swatches, test ergonomic recliners and mattresses in person, and consult with our seasoned interior consultants.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
              <a
                href="tel:+9242111203203"
                className="px-6 py-3 bg-[#C9A66B] text-[#171717] rounded-lg font-semibold uppercase tracking-wider hover:bg-[#b59257] transition-colors inline-flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call +92 42 111-203-203</span>
              </a>
              <Link
                to="/contact"
                className="px-6 py-3 border border-white/30 text-white rounded-lg font-semibold uppercase tracking-wider hover:bg-white/10 transition-colors"
              >
                Showroom Directions & Hours
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
