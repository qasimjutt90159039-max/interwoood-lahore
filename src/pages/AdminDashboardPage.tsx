import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package, ShoppingBag, Users, Clock, CheckCircle2, TrendingUp,
  AlertTriangle, Settings, Plus, Edit2, Trash2, Phone, Save
} from 'lucide-react';
import api from '../services/api.js';
import { Product, Order, StoreSettings } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';

export const AdminDashboardPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'settings'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // New / Edit Product Modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    SKU: '',
    category: 'Sofas',
    subcategory: '3 Seater Sofas',
    price: '',
    compareAtPrice: '',
    material: '',
    color: '',
    stock: '10',
    description: '',
    featured: false,
    bestseller: false,
    length: '120',
    width: '60',
    height: '75',
    unit: 'cm',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'
  });

  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const [statsRes, prodRes, ordRes, settRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/products?limit=100'),
          api.get('/orders'),
          api.get('/settings')
        ]);
        setStats(statsRes.data);
        setProducts(prodRes.data.products || []);
        setOrders(ordRes.data.orders || []);
        setSettings(settRes.data.settings);
      } catch (err) {
        console.error('Failed to fetch admin data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-xl font-bold font-editorial text-[#171717]">Admin Privileges Required</h2>
        <p className="text-xs text-stone-500">Sign in with administrative credentials to access the backend console.</p>
        <Link to="/login?admin=true" className="inline-block px-6 py-2.5 bg-[#171717] text-white rounded-lg text-xs font-semibold uppercase">
          Admin Sign In
        </Link>
      </div>
    );
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setStatusUpdating(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map((o) => (o._id === orderId ? { ...o, status: newStatus as any } : o)));
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to remove this product from the live catalog?')) return;
    try {
      await api.delete(`/products/${productId}`);
      setProducts(products.filter((p) => p._id !== productId));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      SKU: '',
      category: 'Sofas',
      subcategory: '3 Seater Sofas',
      price: '',
      compareAtPrice: '',
      material: 'Solid Wood & Premium Fabric',
      color: 'Walnut',
      stock: '15',
      description: '',
      featured: false,
      bestseller: false,
      length: '180',
      width: '90',
      height: '80',
      unit: 'cm',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'
    });
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      SKU: p.SKU,
      category: p.category,
      subcategory: p.subcategory,
      price: p.price.toString(),
      compareAtPrice: p.compareAtPrice ? p.compareAtPrice.toString() : '',
      material: p.material,
      color: p.color,
      stock: p.stock.toString(),
      description: p.description,
      featured: p.featured,
      bestseller: p.bestseller,
      length: p.dimensions.length.toString(),
      width: p.dimensions.width.toString(),
      height: p.dimensions.height.toString(),
      unit: p.dimensions.unit,
      image: p.images[0] || ''
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: productForm.name,
        SKU: productForm.SKU,
        category: productForm.category,
        subcategory: productForm.subcategory,
        price: Number(productForm.price),
        compareAtPrice: productForm.compareAtPrice ? Number(productForm.compareAtPrice) : undefined,
        material: productForm.material,
        color: productForm.color,
        stock: Number(productForm.stock),
        description: productForm.description,
        featured: productForm.featured,
        bestseller: productForm.bestseller,
        dimensions: {
          length: Number(productForm.length),
          width: Number(productForm.width),
          height: Number(productForm.height),
          unit: productForm.unit
        },
        images: [productForm.image]
      };

      if (editingProduct) {
        const res = await api.put(`/products/${editingProduct._id}`, payload);
        setProducts(products.map((p) => (p._id === editingProduct._id ? res.data.product : p)));
      } else {
        const res = await api.post('/products', payload);
        setProducts([res.data.product, ...products]);
      }

      setShowProductModal(false);
    } catch (err) {
      console.error('Failed to save product', err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      const res = await api.put('/settings', settings);
      setSettings(res.data.settings);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch (err) {
      console.error('Failed to update settings', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#171717]/10 gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B6F47]">
            Interwood Management Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-[#171717]">
            Admin Dashboard
          </h1>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg text-xs font-semibold">
          {[
            { id: 'overview', label: 'Overview & Analytics' },
            { id: 'products', label: `Products (${products.length})` },
            { id: 'orders', label: `Orders (${orders.length})` },
            { id: 'settings', label: 'Store Settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-[#171717] shadow-xs'
                  : 'text-stone-600 hover:text-[#171717]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-stone-500">Loading admin system data...</div>
      ) : (
        <>
          {/* TAB 1: OVERVIEW & ANALYTICS */}
          {activeTab === 'overview' && stats && (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="text-xs font-bold uppercase">Total Products</span>
                    <Package className="w-4 h-4 text-[#8B6F47]" />
                  </div>
                  <div className="text-2xl font-bold font-editorial text-[#171717]">
                    {stats.totalProducts}
                  </div>
                  <span className="text-[11px] text-stone-500 block">Catalog size across 12 categories</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="text-xs font-bold uppercase">Total Orders</span>
                    <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold font-editorial text-[#171717]">
                    {stats.totalOrders}
                  </div>
                  <span className="text-[11px] text-stone-500 block">{stats.pendingOrders} pending fulfillment</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="text-xs font-bold uppercase">Total Revenue</span>
                    <TrendingUp className="w-4 h-4 text-[#C9A66B]" />
                  </div>
                  <div className="text-2xl font-bold font-editorial text-[#171717] tabular-nums">
                    Rs. {stats.totalRevenue.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-stone-500 block">From confirmed & active orders</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="text-xs font-bold uppercase">Low Stock Alerts</span>
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-bold font-editorial text-amber-700">
                    {stats.lowStockCount}
                  </div>
                  <span className="text-[11px] text-stone-500 block">Items with &lt; 5 units in warehouse</span>
                </div>
              </div>

              {/* Category Breakdown & Low Stock */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Category Inventory Spread */}
                <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
                  <h3 className="text-sm font-bold text-[#171717] uppercase tracking-wider">
                    Category Inventory Spread
                  </h3>
                  <div className="space-y-2.5 text-xs">
                    {stats.categoryCounts?.map((cat: any) => (
                      <div key={cat.name} className="flex items-center justify-between">
                        <span className="text-stone-700">{cat.name}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 h-2 bg-stone-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#8B6F47]"
                              style={{ width: `${Math.min(100, (cat.count / 20) * 100)}%` }}
                            />
                          </div>
                          <span className="font-semibold tabular-nums text-stone-900 w-8 text-right">
                            {cat.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Low Stock Watchlist */}
                <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
                  <h3 className="text-sm font-bold text-[#171717] uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Low Stock Watchlist</span>
                  </h3>
                  <div className="divide-y divide-stone-100 text-xs">
                    {stats.lowStockProducts?.length === 0 ? (
                      <p className="text-stone-400 py-4">All catalog items have healthy stock levels.</p>
                    ) : (
                      stats.lowStockProducts.map((p: any) => (
                        <div key={p._id} className="py-2.5 flex items-center justify-between">
                          <div className="truncate pr-2">
                            <p className="font-semibold text-[#171717] truncate">{p.name}</p>
                            <span className="text-[11px] text-stone-400">SKU: {p.SKU} · {p.category}</span>
                          </div>
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded font-bold text-[11px]">
                            {p.stock} in stock
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCT MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-500">
                  Managing {products.length} live catalog items
                </span>
                <button
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2 bg-[#171717] hover:bg-[#8B6F47] text-white rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F7F5F1] text-stone-600 uppercase font-semibold text-[10px] tracking-wider border-b border-stone-200">
                      <tr>
                        <th className="p-4">Item</th>
                        <th className="p-4">SKU</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price (PKR)</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4">Tags</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {products.map((p) => (
                        <tr key={p._id} className="hover:bg-stone-50 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0" />
                            <div>
                              <p className="font-semibold text-[#171717] line-clamp-1">{p.name}</p>
                              <span className="text-[11px] text-stone-400">{p.material}</span>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-stone-500">{p.SKU}</td>
                          <td className="p-4 text-stone-700">{p.category}</td>
                          <td className="p-4 font-semibold text-[#171717] tabular-nums">
                            Rs. {p.price.toLocaleString()}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              p.stock > 5 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'
                            }`}>
                              {p.stock}
                            </span>
                          </td>
                          <td className="p-4 space-x-1">
                            {p.featured && <span className="text-[10px] bg-stone-100 px-1.5 py-0.5 rounded">Featured</span>}
                            {p.bestseller && <span className="text-[10px] bg-stone-100 px-1.5 py-0.5 rounded">Bestseller</span>}
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              className="p-1.5 text-stone-500 hover:text-[#8B6F47] hover:bg-stone-100 rounded"
                              aria-label="Edit product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p._id)}
                              className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded"
                              aria-label="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ORDER MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <span className="text-xs text-stone-500">
                {orders.length} total customer orders recorded
              </span>

              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F7F5F1] text-stone-600 uppercase font-semibold text-[10px] tracking-wider border-b border-stone-200">
                      <tr>
                        <th className="p-4">Order #</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">City</th>
                        <th className="p-4">Items</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Payment</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {orders.map((o) => (
                        <tr key={o._id} className="hover:bg-stone-50 transition-colors">
                          <td className="p-4 font-mono font-bold text-[#171717]">{o.orderNumber}</td>
                          <td className="p-4">
                            <p className="font-semibold text-[#171717]">{o.customerName}</p>
                            <span className="text-[11px] text-stone-400">{o.customerPhone}</span>
                          </td>
                          <td className="p-4 text-stone-700">{o.shippingAddress.city}</td>
                          <td className="p-4 text-stone-600">{o.items.length} pieces</td>
                          <td className="p-4 font-bold text-[#171717] tabular-nums">
                            Rs. {o.total.toLocaleString()}
                          </td>
                          <td className="p-4 text-stone-600 text-[11px]">{o.paymentMethod}</td>
                          <td className="p-4">
                            <select
                              value={o.status}
                              disabled={statusUpdating === o._id}
                              onChange={(e) => handleStatusChange(o._id, e.target.value)}
                              className="p-1.5 border border-stone-300 rounded text-xs bg-white font-medium focus:outline-hidden"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STORE SETTINGS */}
          {activeTab === 'settings' && settings && (
            <div className="max-w-2xl bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#171717] pb-2 border-b border-stone-100">
                Store Settings & WhatsApp Integration
              </h2>

              {settingsSaved && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Store settings updated successfully.</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                <div>
                  <label className="block text-stone-600 mb-1 font-semibold">
                    WHATSAPP_NUMBER (Business Inquiry Hotline)
                  </label>
                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#8B6F47]"
                    placeholder="+9242111203203"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">Configures all automated product inquiry buttons.</p>
                </div>

                <div>
                  <label className="block text-stone-600 mb-1 font-semibold">
                    Announcement Banner Text
                  </label>
                  <input
                    type="text"
                    value={settings.announcementText}
                    onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#8B6F47]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-600 mb-1 font-semibold">
                      Free Delivery Threshold (PKR)
                    </label>
                    <input
                      type="number"
                      value={settings.freeDeliveryThreshold}
                      onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                      className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#8B6F47]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-1 font-semibold">
                      Standard Delivery Fee (PKR)
                    </label>
                    <input
                      type="number"
                      value={settings.standardDeliveryFee}
                      onChange={(e) => setSettings({ ...settings, standardDeliveryFee: Number(e.target.value) })}
                      className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:border-[#8B6F47]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#171717] hover:bg-[#8B6F47] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Store Settings</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}

      {/* Add / Edit Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowProductModal(false)} />
          <div className="relative bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 z-10 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-[#171717] pb-2 border-b border-stone-100">
              {editingProduct ? 'Edit Furniture Item' : 'Add New Furniture Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full p-2 border border-stone-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">SKU</label>
                  <input
                    type="text"
                    value={productForm.SKU}
                    onChange={(e) => setProductForm({ ...productForm, SKU: e.target.value })}
                    placeholder="e.g. IWD-SOF-199"
                    className="w-full p-2 border border-stone-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-600 mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full p-2 border border-stone-300 rounded-md"
                  >
                    <option value="Sofas">Sofas</option>
                    <option value="Armchairs & Accent Chairs">Armchairs & Accent Chairs</option>
                    <option value="Coffee Tables">Coffee Tables</option>
                    <option value="TV Units & Consoles">TV Units & Consoles</option>
                    <option value="Beds">Beds</option>
                    <option value="Bedside Tables & Dressers">Bedside Tables & Dressers</option>
                    <option value="Wardrobes & Closets">Wardrobes & Closets</option>
                    <option value="Dining Tables">Dining Tables</option>
                    <option value="Dining Chairs">Dining Chairs</option>
                    <option value="Office Furniture">Office Furniture</option>
                    <option value="Mattresses">Mattresses</option>
                    <option value="Home Decor & Lighting">Home Decor & Lighting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full p-2 border border-stone-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full p-2 border border-stone-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 mb-1">Material</label>
                  <input
                    type="text"
                    value={productForm.material}
                    onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                    className="w-full p-2 border border-stone-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">Color / Polish</label>
                  <input
                    type="text"
                    value={productForm.color}
                    onChange={(e) => setProductForm({ ...productForm, color: e.target.value })}
                    className="w-full p-2 border border-stone-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-600 mb-1">Length (cm)</label>
                  <input
                    type="number"
                    value={productForm.length}
                    onChange={(e) => setProductForm({ ...productForm, length: e.target.value })}
                    className="w-full p-2 border border-stone-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">Width (cm)</label>
                  <input
                    type="number"
                    value={productForm.width}
                    onChange={(e) => setProductForm({ ...productForm, width: e.target.value })}
                    className="w-full p-2 border border-stone-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={productForm.height}
                    onChange={(e) => setProductForm({ ...productForm, height: e.target.value })}
                    className="w-full p-2 border border-stone-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 mb-1">Image URL</label>
                <input
                  type="text"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full p-2 border border-stone-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full p-2 border border-stone-300 rounded-md"
                  placeholder="Detailed craftsmanship and structural description..."
                />
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.featured}
                    onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                  />
                  <span>Mark as Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.bestseller}
                    onChange={(e) => setProductForm({ ...productForm, bestseller: e.target.checked })}
                  />
                  <span>Mark as Bestseller</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#171717] hover:bg-[#8B6F47] text-white rounded-md font-semibold uppercase tracking-wider"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
