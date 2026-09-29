import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronRight,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Truck,
  Wrench,
  CheckCircle2,
  Star,
  Award,
  Clock,
  Layers,
  Percent,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import api from '../services/api.js';
import { Product, Category } from '../types/index.js';
import { ProductCard } from '../components/common/ProductCard.js';
import { QuickViewModal } from '../components/common/QuickViewModal.js';
import { ImageWithFallback } from '../components/common/ImageWithFallback.js';

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestsellerProducts, setBestsellerProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [activeCollectionTab, setActiveCollectionTab] = useState<'all' | 'living' | 'bedroom' | 'dining' | 'office' | 'decor'>('all');
  const [visibleFeaturedCount, setVisibleFeaturedCount] = useState<number>(12);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [catsRes, featRes, bestRes, newRes, allRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?featured=true&limit=36'),
          api.get('/products?bestseller=true&limit=16'),
          api.get('/products?newArrival=true&limit=12'),
          api.get('/products?limit=130')
        ]);

        const fetchedCats = catsRes.data.categories || [];
        const fetchedFeat = featRes.data.products || [];
        const fetchedBest = bestRes.data.products || [];
        const fetchedNew = newRes.data.products || [];
        const fetchedAll: Product[] = allRes.data.products || [];

        setCategories(fetchedCats);
        setFeaturedProducts(fetchedFeat.length > 0 ? fetchedFeat : fetchedAll.filter(p => p.featured));
        setBestsellerProducts(fetchedBest.length > 0 ? fetchedBest : fetchedAll.filter(p => p.bestseller));
        setNewArrivals(fetchedNew.length > 0 ? fetchedNew : fetchedAll.filter(p => p.newArrival));
        setSaleProducts(fetchedAll.filter(p => p.discount && p.discount > 0).slice(0, 8));
        setAllProducts(fetchedAll);
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
    if (activeCollectionTab === 'living') return p.category.includes('Sofas') || p.category.includes('Chairs') || p.category.includes('Coffee') || p.category.includes('TV');
    if (activeCollectionTab === 'bedroom') return p.category.includes('Beds') || p.category.includes('Bedside') || p.category.includes('Wardrobes') || p.category.includes('Mattresses');
    if (activeCollectionTab === 'dining') return p.category.includes('Dining');
    if (activeCollectionTab === 'office') return p.category.includes('Office');
    if (activeCollectionTab === 'decor') return p.category.includes('Decor') || p.category.includes('Lighting');
    return true;
  });

  const displayedFeatured = collectionFilteredProducts.slice(0, visibleFeaturedCount);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 0. ANNOUNCEMENT & TRUST TICKER */}
      <section className="bg-[#171717] text-white/90 text-xs border-b border-white/10 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <Truck className="w-3.5 h-3.5 text-[#C9A66B]" />
            <span>Complimentary White-Glove Delivery & Installation in Lahore on Orders Above Rs. 100,000</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[11px] text-stone-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A66B]" />
              Seasoned Timbers & 10-Yr Stability
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C9A66B]" />
              7, Babar Block, New Garden Town, Lahore
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#C9A66B]" />
              +92 42 111-203-203
            </span>
          </div>
        </div>
      </section>

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[620px] lg:min-h-[720px] flex items-center bg-[#171717] overflow-hidden text-white">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=85"
            alt="Interwood Lahore Luxury Furniture"
            className="w-full h-full object-cover opacity-45 transform scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/35" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A66B]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interwood Lahore · Modern Architecture & Timeless Craft</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight font-editorial text-balance">
              Furniture Designed for Architectural Elegance & Modern Living
            </h1>

            <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed max-w-2xl">
              Explore thoughtfully curated furniture for discerning homes, executive suites, and luxury living spaces. Handcrafted with kiln-seasoned hardwoods, precision Italian veneers, and enduring Pakistani craftsmanship.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to="/shop"
                className="px-8 py-3.5 bg-[#C9A66B] hover:bg-[#b59257] text-[#171717] font-semibold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2"
              >
                <span>Browse All 130+ Masterpieces</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/shop?featured=true"
                className="px-8 py-3.5 border border-white/30 hover:border-white text-white font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-2 hover:bg-white/10"
              >
                <span>Explore Curated Collections</span>
              </Link>
            </div>

            {/* Live Store Stats Strip */}
            <div className="pt-8 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <div className="text-2xl font-bold font-editorial text-[#C9A66B]">130+</div>
                <div className="text-stone-300 mt-0.5">Handcrafted Products</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-editorial text-[#C9A66B]">12</div>
                <div className="text-stone-300 mt-0.5">Curated Categories</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-editorial text-[#C9A66B]">100%</div>
                <div className="text-stone-300 mt-0.5">White-Glove Assembly</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-editorial text-[#C9A66B]">45+ Yrs</div>
                <div className="text-stone-300 mt-0.5">Lahore Heritage</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PILLARS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#F7F5F1] p-5 rounded-xl border border-stone-200/80 flex items-start gap-4">
            <div className="p-2.5 bg-white rounded-lg shadow-xs text-[#8B6F47] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#171717] uppercase tracking-wider">Free Lahore Delivery</h4>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">Direct dispatch across DHA, Gulberg, Bahria Town & all Lahore sectors on orders over Rs. 100k.</p>
            </div>
          </div>

          <div className="bg-[#F7F5F1] p-5 rounded-xl border border-stone-200/80 flex items-start gap-4">
            <div className="p-2.5 bg-white rounded-lg shadow-xs text-[#8B6F47] shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#171717] uppercase tracking-wider">White-Glove Assembly</h4>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">Certified factory technicians assemble, level, and place every piece in your desired room.</p>
            </div>
          </div>

          <div className="bg-[#F7F5F1] p-5 rounded-xl border border-stone-200/80 flex items-start gap-4">
            <div className="p-2.5 bg-white rounded-lg shadow-xs text-[#8B6F47] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#171717] uppercase tracking-wider">Kiln-Seasoned Timbers</h4>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">Scientifically conditioned wood built to withstand Lahore humidity without warping or cracking.</p>
            </div>
          </div>

          <div className="bg-[#F7F5F1] p-5 rounded-xl border border-stone-200/80 flex items-start gap-4">
            <div className="p-2.5 bg-white rounded-lg shadow-xs text-[#8B6F47] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#171717] uppercase tracking-wider">Flagship Showroom</h4>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">Touch fabrics, test recliners, and meet our senior interior consultants in New Garden Town.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY DIRECTORY (All 12 Curated Categories) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#8B6F47] block mb-1">
              Architecture & Form
            </span>
            <h2 className="text-2xl sm:text-3xl font-normal font-editorial text-[#171717]">
              All 12 Furniture Categories
            </h2>
            <p className="text-xs text-stone-500 mt-1">Browse our complete collection of handcrafted furniture pieces.</p>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-[#8B6F47] hover:text-[#171717] transition-colors inline-flex items-center gap-1 uppercase tracking-wider"
          >
            <span>View Complete 130+ Catalog</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id || cat._id}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group relative flex flex-col bg-white border border-[#171717]/8 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-4/3 overflow-hidden bg-[#F7F5F1]">
                <ImageWithFallback
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
              </div>

              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-sm font-bold text-[#171717] group-hover:text-[#8B6F47] transition-colors">
                      {cat.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-[#8B6F47] bg-[#F7F5F1] px-2 py-0.5 rounded-full tabular-nums">
                      {cat.productCount} items
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#8B6F47]">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. EXPANDABLE FEATURED MASTERPIECES */}
      <section className="bg-white py-16 sm:py-20 border-y border-[#171717]/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#8B6F47] block mb-1">
                Selected Work
              </span>
              <h2 className="text-2xl sm:text-3xl font-normal font-editorial text-[#171717]">
                Featured Masterpieces
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Showing {displayedFeatured.length} of {collectionFilteredProducts.length} curated designs
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-[#F7F5F1] rounded-lg overflow-x-auto">
              {[
                { id: 'all', label: 'All Furniture' },
                { id: 'living', label: 'Living Room' },
                { id: 'bedroom', label: 'Bedroom' },
                { id: 'dining', label: 'Dining' },
                { id: 'office', label: 'Office' },
                { id: 'decor', label: 'Decor & Lamps' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveCollectionTab(tab.id as any);
                    setVisibleFeaturedCount(12);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    activeCollectionTab === tab.id
                      ? 'bg-[#171717] text-white shadow-xs font-semibold'
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
            {displayedFeatured.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>

          {/* Show More / Expand Button */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            {visibleFeaturedCount < collectionFilteredProducts.length && (
              <button
                onClick={() => setVisibleFeaturedCount((prev) => prev + 12)}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C9A66B] hover:bg-[#b59257] text-[#171717] font-semibold rounded-lg text-xs uppercase tracking-wider transition-colors shadow-xs"
              >
                <span>Load More Furniture (+12 Items)</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            )}

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#171717] hover:bg-[#8B6F47] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
            >
              <span>Explore Complete 130+ Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. BESTSELLERS IN LAHORE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#8B6F47] mb-1">
              <Award className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-normal font-editorial text-[#171717]">
              Bestsellers in Lahore Homes
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Our most celebrated and reviewed furniture pieces across DHA, Gulberg, and Bahria Town.
            </p>
          </div>
          <Link
            to="/shop?sort=rating"
            className="text-xs font-semibold text-[#8B6F47] hover:text-[#171717] inline-flex items-center gap-1 uppercase tracking-wider"
          >
            <span>View All Bestsellers</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestsellerProducts.slice(0, 8).map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* 6. ROOM-BY-ROOM SIGNATURE INSPIRATION LOOKBOOK */}
      <section className="bg-[#EDE8DF] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#8B6F47]">
              Signature Interior Concepts
            </span>
            <h2 className="text-2xl sm:text-4xl font-normal font-editorial text-[#171717]">
              Furnish by Room with Cohesive Architecture
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              Every Interwood collection is engineered with matching timber veneers, brass hardware, and fabric palettes for effortless interior harmony.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Living Room */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between">
              <div>
                <div className="aspect-16/10 overflow-hidden relative">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80"
                    alt="Living Room Sanctuary"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#171717]/80 backdrop-blur-xs text-white text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                    Living Sanctuary
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="text-base font-editorial font-bold text-[#171717]">The Modern Living Room</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Sculptural 3-seater velvet sofas, solid walnut center tables, and fluted acoustic media consoles engineered for Lahore entertainment.
                  </p>
                  <ul className="text-[11px] text-stone-600 pt-2 space-y-1 border-t border-stone-100">
                    <li className="flex items-center gap-1.5">✓ 3-Seater & Sectional Couches</li>
                    <li className="flex items-center gap-1.5">✓ Walnut & Travertine Center Tables</li>
                    <li className="flex items-center gap-1.5">✓ Soundbar & TV Consoles</li>
                  </ul>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Link
                  to="/shop?category=Sofas"
                  className="w-full py-2.5 bg-[#F7F5F1] hover:bg-[#171717] hover:text-white text-[#171717] text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors uppercase tracking-wider"
                >
                  <span>Shop Living Room</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Bedroom */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between">
              <div>
                <div className="aspect-16/10 overflow-hidden relative">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1540518614846-7ede433c4b4d?auto=format&fit=crop&w=800&q=80"
                    alt="Master Bedroom Suite"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#171717]/80 backdrop-blur-xs text-white text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                    Master Haven
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="text-base font-editorial font-bold text-[#171717]">The Master Suite Bedroom</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    King size upholstered headboards, smooth gas-lift hydraulic storage beds, marble nightstands, and German-track sliding wardrobes.
                  </p>
                  <ul className="text-[11px] text-stone-600 pt-2 space-y-1 border-t border-stone-100">
                    <li className="flex items-center gap-1.5">✓ King & Queen Storage Beds</li>
                    <li className="flex items-center gap-1.5">✓ 2 & 3-Door Modular Wardrobes</li>
                    <li className="flex items-center gap-1.5">✓ Orthopedic Spring Mattresses</li>
                  </ul>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Link
                  to="/shop?category=Beds"
                  className="w-full py-2.5 bg-[#F7F5F1] hover:bg-[#171717] hover:text-white text-[#171717] text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors uppercase tracking-wider"
                >
                  <span>Shop Bedroom Suite</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Office */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between">
              <div>
                <div className="aspect-16/10 overflow-hidden relative">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
                    alt="Executive Office"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#171717]/80 backdrop-blur-xs text-white text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                    Executive Suite
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="text-base font-editorial font-bold text-[#171717]">The Executive Workspace</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Commanding managerial desks with leather inlays, wire management ports, Korean mesh ergonomic chairs, and file credenzas.
                  </p>
                  <ul className="text-[11px] text-stone-600 pt-2 space-y-1 border-t border-stone-100">
                    <li className="flex items-center gap-1.5">✓ Executive Managerial Desks</li>
                    <li className="flex items-center gap-1.5">✓ High-Back Ergonomic Chairs</li>
                    <li className="flex items-center gap-1.5">✓ Conference & Meeting Tables</li>
                  </ul>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Link
                  to="/shop?category=Office%20Furniture"
                  className="w-full py-2.5 bg-[#F7F5F1] hover:bg-[#171717] hover:text-white text-[#171717] text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors uppercase tracking-wider"
                >
                  <span>Shop Executive Office</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SPECIAL OFFERS / SALE SECTION */}
      {saleProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#F7F5F1] border border-[#171717]/10 rounded-2xl p-6 sm:p-10 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#8B6F47] mb-1">
                  <Percent className="w-3.5 h-3.5 text-[#C9A66B]" />
                  <span>Limited Time Privileges</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-normal font-editorial text-[#171717]">
                  Special Promotional Deals
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Save up to Rs. 45,000 on selected factory showroom pieces with direct dispatch in Lahore.
                </p>
              </div>
              <Link
                to="/shop?sale=true"
                className="text-xs font-semibold text-[#8B6F47] hover:text-[#171717] inline-flex items-center gap-1 uppercase tracking-wider"
              >
                <span>View All Offers</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {saleProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. EDITORIAL STORY SECTION: CRAFTSMANSHIP & LAHORE HERITAGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#171717] text-white rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 items-center">
          <div className="p-8 sm:p-12 lg:p-16 space-y-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A66B]">
              Crafted in Lahore · Since 1974
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal font-editorial text-white text-balance">
              Precision Engineering Meets Timeless Pakistani Craftsmanship
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
              From our industrial manufacturing complex at Shalimar Town, Mehmood Booti to our flagship showroom in New Garden Town, Interwood sets Pakistan’s benchmark in high-end furniture manufacturing. Every timber board undergoes multi-stage seasoning, moisture-controlled kiln drying, and hand-rubbed lacquering.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/15">
              <div>
                <div className="text-2xl font-bold font-editorial text-[#C9A66B]">130+</div>
                <div className="text-xs text-stone-400 mt-0.5">Bespoke Catalog Items</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-editorial text-[#C9A66B]">100%</div>
                <div className="text-xs text-stone-400 mt-0.5">White-Glove Assembly</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-editorial text-[#C9A66B]">Kiln-Dried</div>
                <div className="text-xs text-stone-400 mt-0.5">Moisture Resilient Wood</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-editorial text-[#C9A66B]">New Garden Town</div>
                <div className="text-xs text-stone-400 mt-0.5">Flagship Experience Center</div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9A66B] hover:text-white transition-colors"
              >
                <span>Read Brand Heritage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-300 hover:text-white transition-colors"
              >
                <span>Book Factory / Showroom Consultation</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="h-full min-h-[380px] lg:min-h-[520px]">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1540518614846-7ede433c4b4d?auto=format&fit=crop&w=1200&q=80"
              alt="Interwood Lahore Bedroom Crafts"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 9. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#8B6F47] block mb-1">
              Fresh Off The Line
            </span>
            <h2 className="text-2xl sm:text-3xl font-normal font-editorial text-[#171717]">
              New Arrivals
            </h2>
            <p className="text-xs text-stone-500 mt-1">Our latest handcrafted designs just released from the Shalimar facility.</p>
          </div>
          <Link
            to="/shop?newArrival=true"
            className="text-xs font-semibold text-[#8B6F47] hover:text-[#171717] inline-flex items-center gap-1 uppercase tracking-wider"
          >
            <span>View All New</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.slice(0, 8).map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* 10. VERIFIED CUSTOMER REVIEWS FROM LAHORE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#8B6F47]">
            Trusted in Lahore
          </span>
          <h2 className="text-2xl sm:text-3xl font-normal font-editorial text-[#171717]">
            Words From Our Clients
          </h2>
          <p className="text-xs text-stone-500">
            Real feedback from homeowners, corporate offices, and architects across Lahore.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#F7F5F1] p-6 rounded-xl border border-stone-200/80 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex text-[#C9A66B]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <h4 className="text-sm font-bold text-[#171717]">Impeccable velvet upholstery</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                "We ordered the 3-Seater Sofa and Center Table for our lounge in DHA Phase 5. The white-glove delivery crew was polite, unwrapped everything carefully, and placed it perfectly. The finish is hotel-grade."
              </p>
            </div>
            <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-[#171717]">Hamza Tariq</span>
              <span className="text-[11px] text-stone-500">DHA Phase 5, Lahore</span>
            </div>
          </div>

          <div className="bg-[#F7F5F1] p-6 rounded-xl border border-stone-200/80 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex text-[#C9A66B]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <h4 className="text-sm font-bold text-[#171717]">Solid Wood Master Bed is stunning</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                "Visited the Babar Block showroom to check mattress firmness and timber colors. The sales consultant helped us customize dimensions. Delivery happened in 4 days with complete assembly. Highly recommended!"
              </p>
            </div>
            <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-[#171717]">Dr. Ayesha Malik</span>
              <span className="text-[11px] text-stone-500">Gulberg III, Lahore</span>
            </div>
          </div>

          <div className="bg-[#F7F5F1] p-6 rounded-xl border border-stone-200/80 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex text-[#C9A66B]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <h4 className="text-sm font-bold text-[#171717]">Best Executive Desk in Pakistan</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                "Fitted our entire corporate floor in Gulberg with Interwood workstations and manager desks. Built-in cable portals and soft-close drawers make it look clutter-free and professional."
              </p>
            </div>
            <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-[#171717]">Usman Farooq</span>
              <span className="text-[11px] text-stone-500">New Garden Town, Lahore</span>
            </div>
          </div>
        </div>
      </section>

      {/* 11. LAHORE SHOWROOM VISIT PROMO & CONTACT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#171717] text-white rounded-2xl p-8 sm:p-14 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-5">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A66B]">
              Showroom Consultation & Live Experience
            </span>
            <h2 className="text-2xl sm:text-4xl font-editorial font-normal leading-tight">
              Experience Interwood Live at 7 Babar Block, New Garden Town, Lahore
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Explore tactile fabric swatches, test ergonomic recliners and orthopedic mattresses in person, and consult with our seasoned interior consultants for bespoke residences.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
              <a
                href="tel:+9242111203203"
                className="px-6 py-3.5 bg-[#C9A66B] text-[#171717] rounded-lg font-semibold uppercase tracking-wider hover:bg-[#b59257] transition-colors inline-flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call +92 42 111-203-203</span>
              </a>
              <Link
                to="/contact"
                className="px-6 py-3.5 border border-white/30 text-white rounded-lg font-semibold uppercase tracking-wider hover:bg-white/10 transition-colors inline-flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                <span>Showroom Directions & Hours</span>
              </Link>
            </div>

            <div className="pt-4 border-t border-white/15 flex flex-wrap gap-6 text-[11px] text-stone-400">
              <div>
                <strong className="text-white block">Opening Hours:</strong>
                Monday - Saturday: 10:30 AM – 9:00 PM | Sunday: 2:00 PM – 8:00 PM
              </div>
              <div>
                <strong className="text-white block">Flagship Location:</strong>
                7, Babar Block, New Garden Town, Lahore 54600
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FAQ PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#8B6F47]">
            Assistance & Guidelines
          </span>
          <h2 className="text-2xl font-normal font-editorial text-[#171717]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto text-xs">
          <div className="bg-[#F7F5F1] p-5 rounded-xl border border-stone-200">
            <h4 className="font-bold text-[#171717] mb-1.5">How does White-Glove delivery work in Lahore?</h4>
            <p className="text-stone-600 leading-relaxed font-light">
              Orders above Rs. 100,000 receive complimentary door-step transport, room positioning, and complete on-site assembly by our certified technicians across Lahore.
            </p>
          </div>
          <div className="bg-[#F7F5F1] p-5 rounded-xl border border-stone-200">
            <h4 className="font-bold text-[#171717] mb-1.5">Can I customize dimensions or fabrics?</h4>
            <p className="text-stone-600 leading-relaxed font-light">
              Yes, our New Garden Town showroom maintains a complete fabric and veneer library with over 150 tactile materials for custom residential orders.
            </p>
          </div>
          <div className="bg-[#F7F5F1] p-5 rounded-xl border border-stone-200">
            <h4 className="font-bold text-[#171717] mb-1.5">What is the warranty coverage?</h4>
            <p className="text-stone-600 leading-relaxed font-light">
              All Interwood furniture includes structural assurance covering kiln-seasoned hardwoods, joinery, and hydraulic hardware against manufacturing defects.
            </p>
          </div>
          <div className="bg-[#F7F5F1] p-5 rounded-xl border border-stone-200">
            <h4 className="font-bold text-[#171717] mb-1.5">What payment methods are supported?</h4>
            <p className="text-stone-600 leading-relaxed font-light">
              We accept Cash on Delivery (COD), direct bank transfer, and showroom credit/debit card transactions with official GST invoices.
            </p>
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
