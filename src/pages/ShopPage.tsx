import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronLeft, ChevronRight, SlidersHorizontal, RotateCcw } from 'lucide-react';
import api from '../services/api.js';
import { Product, Category } from '../types/index.js';
import { ProductCard } from '../components/common/ProductCard.js';
import { QuickViewModal } from '../components/common/QuickViewModal.js';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters from query
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'featured';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const limitParam = searchParams.get('limit') || '32';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const colorParam = searchParams.get('color') || 'all';
  const materialParam = searchParams.get('material') || 'all';
  const newArrivalParam = searchParams.get('newArrival') === 'true';
  const saleParam = searchParams.get('sale') === 'true';
  const featuredParam = searchParams.get('featured') === 'true';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchParam) params.set('search', searchParam);
        if (categoryParam && categoryParam !== 'all') params.set('category', categoryParam);
        if (minPriceParam) params.set('minPrice', minPriceParam);
        if (maxPriceParam) params.set('maxPrice', maxPriceParam);
        if (colorParam && colorParam !== 'all') params.set('color', colorParam);
        if (materialParam && materialParam !== 'all') params.set('material', materialParam);
        if (newArrivalParam) params.set('newArrival', 'true');
        if (featuredParam) params.set('featured', 'true');
        params.set('sort', sortParam);
        params.set('page', pageParam.toString());
        params.set('limit', limitParam === 'all' ? '200' : limitParam);

        const res = await api.get(`/products?${params.toString()}`);
        let fetched: Product[] = res.data.products || [];

        // If sale filter is active
        if (saleParam) {
          fetched = fetched.filter((p) => p.discount && p.discount > 0);
        }

        setProducts(fetched);
        setTotalPages(res.data.pagination?.totalPages || 1);
        setTotalCount(res.data.pagination?.total || fetched.length);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categoryParam, searchParam, sortParam, pageParam, limitParam, minPriceParam, maxPriceParam, colorParam, materialParam, newArrivalParam, saleParam, featuredParam]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set('page', '1'); // reset page on filter change
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const materials = ['Walnut', 'Solid Wood', 'Engineered Wood', 'Velvet', 'Leather', 'Linen', 'Marble', 'Metal'];
  const colors = ['Walnut', 'Charcoal', 'Oak', 'Cream', 'Beige', 'Grey', 'Black', 'Green'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb & Title */}
      <div className="mb-8">
        <div className="text-xs text-stone-500 mb-2">
          <span>Home</span> <span className="mx-1">/</span> <span className="text-[#171717] font-medium">Furniture Catalog</span>
          {categoryParam !== 'all' && (
            <>
              <span className="mx-1">/</span>
              <span className="text-[#8B6F47] font-semibold">{categoryParam}</span>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#171717]/10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-editorial font-normal text-[#171717]">
              {searchParam ? `Results for "${searchParam}"` : categoryParam !== 'all' ? categoryParam : 'Complete Furniture Catalog'}
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Showing {products.length} of {totalCount} authentic handcrafted products
            </p>
          </div>

          {/* Sort, Limit & Mobile Filter Trigger */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-3.5 py-2 border border-stone-300 rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-stone-50"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {limitParam !== 'all' ? (
              <button
                onClick={() => updateParam('limit', 'all')}
                className="px-3.5 py-2 bg-[#C9A66B] hover:bg-[#b59257] text-[#171717] rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
              >
                Show All 130+ Items
              </button>
            ) : (
              <button
                onClick={() => updateParam('limit', '32')}
                className="px-3.5 py-2 bg-stone-200 hover:bg-stone-300 text-[#171717] rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Show 32 Per Page
              </button>
            )}

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 hidden sm:inline">Per Page:</span>
              <select
                value={limitParam}
                onChange={(e) => updateParam('limit', e.target.value)}
                className="py-2 px-3 text-xs bg-white border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#8B6F47]"
              >
                <option value="16">16 Items</option>
                <option value="32">32 Items</option>
                <option value="64">64 Items</option>
                <option value="all">All 130+ Items</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 hidden sm:inline">Sort:</span>
              <select
                value={sortParam}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="py-2 px-3 text-xs bg-white border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#8B6F47]"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* DESKTOP SIDEBAR FILTERS */}
        <aside className="hidden lg:block space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717] flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#8B6F47]" />
              <span>Refine Catalog</span>
            </h3>
            {(categoryParam !== 'all' || minPriceParam || colorParam !== 'all' || materialParam !== 'all' || searchParam) && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] text-[#8B6F47] hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-semibold text-[#171717] mb-2 uppercase tracking-wide">
              Category
            </h4>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => updateParam('category', 'all')}
                className={`w-full text-left py-1 px-2 rounded-md transition-colors ${
                  categoryParam === 'all'
                    ? 'bg-[#171717] text-white font-medium'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                All Categories
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => updateParam('category', c.name)}
                  className={`w-full text-left py-1 px-2 rounded-md flex items-center justify-between transition-colors ${
                    categoryParam.toLowerCase() === c.name.toLowerCase()
                      ? 'bg-[#8B6F47] text-white font-medium'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                  <span className="text-[10px] opacity-75">{c.productCount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="pt-4 border-t border-stone-200">
            <h4 className="text-xs font-semibold text-[#171717] mb-2 uppercase tracking-wide">
              Price Range (PKR)
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <input
                type="number"
                placeholder="Min Rs"
                value={minPriceParam}
                onChange={(e) => updateParam('minPrice', e.target.value)}
                className="p-2 border border-stone-300 rounded-md focus:outline-hidden focus:border-[#8B6F47]"
              />
              <input
                type="number"
                placeholder="Max Rs"
                value={maxPriceParam}
                onChange={(e) => updateParam('maxPrice', e.target.value)}
                className="p-2 border border-stone-300 rounded-md focus:outline-hidden focus:border-[#8B6F47]"
              />
            </div>
          </div>

          {/* Material Filter */}
          <div className="pt-4 border-t border-stone-200">
            <h4 className="text-xs font-semibold text-[#171717] mb-2 uppercase tracking-wide">
              Material
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {materials.map((m) => (
                <button
                  key={m}
                  onClick={() => updateParam('material', materialParam === m ? 'all' : m)}
                  className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                    materialParam === m
                      ? 'bg-[#171717] text-white border-[#171717]'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div className="pt-4 border-t border-stone-200">
            <h4 className="text-xs font-semibold text-[#171717] mb-2 uppercase tracking-wide">
              Color Palette
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => updateParam('color', colorParam === c ? 'all' : c)}
                  className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                    colorParam === c
                      ? 'bg-[#8B6F47] text-white border-[#8B6F47]'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* PRODUCT CATALOG CONTENT */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-stone-200 p-4 space-y-3 animate-pulse">
                  <div className="aspect-square bg-stone-200 rounded-lg" />
                  <div className="h-3 bg-stone-200 rounded w-1/3" />
                  <div className="h-4 bg-stone-200 rounded w-3/4" />
                  <div className="h-4 bg-stone-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4">
              <h3 className="text-lg font-editorial font-bold text-[#171717]">
                No matching furniture found
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                We couldn't find items matching your selected criteria. Try resetting your filters or search query.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 bg-[#171717] text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#8B6F47] transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              {/* Product Grid: 4-col desktop, 3-col tablet, 2-col mobile */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && limitParam !== 'all' && (
                <div className="mt-12 pt-6 border-t border-stone-200 flex items-center justify-between">
                  <button
                    disabled={pageParam <= 1}
                    onClick={() => updateParam('page', (pageParam - 1).toString())}
                    className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-xs text-stone-600">
                    <span>Page</span>
                    <strong className="text-[#171717]">{pageParam}</strong>
                    <span>of</span>
                    <strong>{totalPages}</strong>
                  </div>

                  <button
                    disabled={pageParam >= totalPages}
                    onClick={() => updateParam('page', (pageParam + 1).toString())}
                    className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 flex items-center gap-1"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileFilterOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-sm font-bold text-[#171717]">Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div>
              <h4 className="text-xs font-semibold text-[#171717] mb-2 uppercase tracking-wide">Category</h4>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => { updateParam('category', 'all'); setMobileFilterOpen(false); }}
                  className="w-full text-left py-1.5 px-2 rounded hover:bg-stone-100"
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { updateParam('category', c.name); setMobileFilterOpen(false); }}
                    className="w-full text-left py-1.5 px-2 rounded flex justify-between hover:bg-stone-100 text-stone-700"
                  >
                    <span>{c.name}</span>
                    <span>{c.productCount}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200">
              <button
                onClick={() => { clearAllFilters(); setMobileFilterOpen(false); }}
                className="w-full py-2.5 bg-[#171717] text-white rounded-lg text-xs font-semibold uppercase tracking-wider"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
