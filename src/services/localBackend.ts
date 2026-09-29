import { productsData } from '../data/products.js';
import { categoriesData } from '../data/categories.js';
import { Product, Category, Order, Review, User, StoreSettings } from '../types/index.js';

const STORAGE_KEYS = {
  PRODUCTS: 'iwd_store_products',
  ORDERS: 'iwd_store_orders',
  REVIEWS: 'iwd_store_reviews',
  USERS: 'iwd_store_users',
  SETTINGS: 'iwd_store_settings',
  TOKEN: 'interwood_auth_token'
};

const defaultSettings: StoreSettings = {
  whatsappNumber: '+9242111203203',
  announcementText: 'Complimentary white-glove delivery & professional assembly in Lahore on orders above Rs. 100,000',
  freeDeliveryThreshold: 100000,
  standardDeliveryFee: 3500,
  showroomAddress: '7, Babar Block, New Garden Town, Lahore 54600, Pakistan',
  headOfficeAddress: '56 Sultan Mehmood Road, Shalimar Town, Mehmood Booti, Lahore 54920, Pakistan',
  mainPhone: '+92 42 111-203-203',
  showroomPhone: '+92 42 35831800',
  complaintsEmail: 'complaints@interwoodmobel.com',
  corporateEmail: 'corporate@interwoodmobel.com'
};

const defaultCoupons = [
  { code: 'INTERWOOD10', discountPercent: 10, minPurchase: 50000, active: true },
  { code: 'LAHORE5', discountPercent: 5, minPurchase: 25000, active: true },
  { code: 'WELCOME15', discountPercent: 15, minPurchase: 100000, active: true }
];

function getStoredList<T>(key: string, defaults: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaults;
  } catch {
    return defaults;
  }
}

function saveList<T>(key: string, list: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function handleLocalRequest(method: string, url: string, data?: any): { status: number; data: any } {
  const normMethod = (method || 'get').toLowerCase();
  // Strip origin and baseURL if present
  let cleanUrl = url;
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    try {
      const u = new URL(cleanUrl);
      cleanUrl = u.pathname + u.search;
    } catch {
      // ignore
    }
  }
  if (cleanUrl.startsWith('/api')) {
    cleanUrl = cleanUrl.substring(4);
  }
  if (!cleanUrl.startsWith('/')) {
    cleanUrl = '/' + cleanUrl;
  }

  const [path, queryString] = cleanUrl.split('?');
  const params = new URLSearchParams(queryString || '');

  let products = getStoredList<Product>(STORAGE_KEYS.PRODUCTS, productsData);
  let orders = getStoredList<Order>(STORAGE_KEYS.ORDERS, [
    {
      _id: 'ord-1001',
      orderNumber: 'IWD-2026-1001',
      customerName: 'Bilal Tariq',
      customerEmail: 'customer@interwood.pk',
      customerPhone: '+92 300 1234567',
      shippingAddress: {
        firstName: 'Bilal',
        lastName: 'Tariq',
        phone: '+92 300 1234567',
        email: 'customer@interwood.pk',
        address: 'House 42, Sector Y, Phase 3, DHA',
        city: 'Lahore',
        province: 'Punjab',
        postalCode: '54792',
        orderNotes: 'Please call before arrival for gate pass entry.'
      },
      items: [
        {
          productId: 'prod-sof-01',
          name: 'Modern 3 Seater Sofa',
          SKU: 'IWD-SOF-101',
          price: 145000,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
          color: 'Charcoal Grey'
        }
      ],
      subtotal: 145000,
      deliveryFee: 0,
      discount: 14500,
      total: 130500,
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      status: 'Processing',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
    }
  ]);
  let reviews = getStoredList<Review>(STORAGE_KEYS.REVIEWS, [
    {
      _id: 'rev-01',
      productId: 'prod-sof-01',
      userName: 'Hamza Malik (Lahore)',
      rating: 5,
      title: 'Superb quality and solid build',
      comment: 'The 3-seater sofa was delivered right to my apartment in Gulberg, Lahore. The velvet fabric is plush and the woodwork finish matches our interior perfectly.',
      verifiedPurchase: true,
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
    },
    {
      _id: 'rev-02',
      productId: 'prod-bed-01',
      userName: 'Ayesha Khan (DHA Lahore)',
      rating: 5,
      title: 'Modern King Bed exceeded expectations',
      comment: 'Impeccable craftsmanship. Assembly team was courteous and finished installation in under 45 minutes.',
      verifiedPurchase: true,
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
    }
  ]);

  // 1. GET /categories
  if (normMethod === 'get' && path === '/categories') {
    const catsWithCounts = categoriesData.map(cat => {
      const count = products.filter(p => p.category.toLowerCase() === cat.name.toLowerCase()).length;
      return { ...cat, productCount: count || cat.productCount };
    });
    return { status: 200, data: { categories: catsWithCounts } };
  }

  // 2. GET /products
  if (normMethod === 'get' && path === '/products') {
    let results = [...products];

    const search = params.get('search')?.toLowerCase().trim();
    const category = params.get('category');
    const subcategory = params.get('subcategory');
    const minPrice = params.get('minPrice') ? Number(params.get('minPrice')) : undefined;
    const maxPrice = params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined;
    const color = params.get('color');
    const material = params.get('material');
    const featured = params.get('featured') === 'true';
    const bestseller = params.get('bestseller') === 'true';
    const newArrival = params.get('newArrival') === 'true';
    const sort = params.get('sort') || 'featured';
    const page = Math.max(1, Number(params.get('page')) || 1);
    const limit = Math.max(1, Number(params.get('limit')) || 16);

    if (search) {
      results = results.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.SKU.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search) ||
        p.subcategory.toLowerCase().includes(search) ||
        p.material.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.tags.some(t => t.toLowerCase().includes(search))
      );
    }

    if (category && category !== 'all') {
      results = results.filter(p =>
        p.category.toLowerCase() === category.toLowerCase() ||
        p.slug.includes(category.toLowerCase())
      );
    }

    if (subcategory && subcategory !== 'all') {
      results = results.filter(p => p.subcategory.toLowerCase() === subcategory.toLowerCase());
    }

    if (minPrice !== undefined && !isNaN(minPrice)) {
      results = results.filter(p => p.price >= minPrice);
    }

    if (maxPrice !== undefined && !isNaN(maxPrice)) {
      results = results.filter(p => p.price <= maxPrice);
    }

    if (color && color !== 'all') {
      results = results.filter(p => p.color.toLowerCase().includes(color.toLowerCase()));
    }

    if (material && material !== 'all') {
      results = results.filter(p => p.material.toLowerCase().includes(material.toLowerCase()));
    }

    if (featured) {
      results = results.filter(p => p.featured);
    }
    if (bestseller) {
      results = results.filter(p => p.bestseller);
    }
    if (newArrival) {
      results = results.filter(p => p.newArrival);
    }

    switch (sort) {
      case 'price-asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'featured':
      default:
        results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    const total = results.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginated = results.slice(startIndex, startIndex + limit);

    return {
      status: 200,
      data: {
        products: paginated,
        pagination: {
          total,
          page,
          limit,
          totalPages
        }
      }
    };
  }

  // 3. GET /products/:identifier/reviews & POST /products/:identifier/reviews
  const reviewsMatch = path.match(/^\/products\/([^/]+)\/reviews$/);
  if (reviewsMatch) {
    const prodId = reviewsMatch[1];
    if (normMethod === 'get') {
      const prodReviews = reviews.filter(r => r.productId === prodId || r.productId === `prod-${prodId}`);
      return { status: 200, data: { reviews: prodReviews } };
    }
    if (normMethod === 'post') {
      const { userName, rating, title, comment } = data || {};
      const newRev: Review = {
        _id: `rev-${Date.now()}`,
        productId: prodId,
        userName: userName || 'Verified Lahore Buyer',
        rating: Number(rating) || 5,
        title: title || 'Customer Review',
        comment: comment || '',
        verifiedPurchase: true,
        createdAt: new Date().toISOString()
      };
      reviews.unshift(newRev);
      saveList(STORAGE_KEYS.REVIEWS, reviews);
      return { status: 201, data: { review: newRev, message: 'Review submitted successfully.' } };
    }
  }

  // 4. GET /products/:identifier
  const productMatch = path.match(/^\/products\/([^/]+)$/);
  if (normMethod === 'get' && productMatch) {
    const identifier = decodeURIComponent(productMatch[1]);
    const product = products.find(p =>
      p._id === identifier ||
      p.id === identifier ||
      p.slug === identifier ||
      p.SKU.toLowerCase() === identifier.toLowerCase()
    );

    if (!product) {
      return { status: 404, data: { message: 'Product not found.' } };
    }

    const related = products
      .filter(p => p.category === product.category && p._id !== product._id)
      .slice(0, 4);

    return { status: 200, data: { product, related } };
  }

  // 5. POST /coupons/validate
  if (normMethod === 'post' && path === '/coupons/validate') {
    const { code, subtotal } = data || {};
    const coupon = defaultCoupons.find(c => c.code.toUpperCase() === (code || '').toUpperCase().trim() && c.active);
    if (!coupon) {
      return { status: 404, data: { message: 'Invalid or expired promo code.' } };
    }
    if (subtotal && subtotal < coupon.minPurchase) {
      return { status: 400, data: { message: `This coupon requires a minimum subtotal of Rs. ${coupon.minPurchase.toLocaleString()}` } };
    }
    const discountAmount = Math.round((subtotal * coupon.discountPercent) / 100);
    return {
      status: 200,
      data: {
        valid: true,
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        discountAmount,
        message: `Promo applied: ${coupon.discountPercent}% discount.`
      }
    };
  }

  // 6. POST /orders
  if (normMethod === 'post' && path === '/orders') {
    const { customerName, customerEmail, customerPhone, shippingAddress, items, subtotal, deliveryFee, discount, total, paymentMethod } = data || {};
    const orderNum = `IWD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      _id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      customerName: customerName || 'Valued Customer',
      customerEmail: customerEmail || '',
      customerPhone: customerPhone || '',
      shippingAddress: shippingAddress || {},
      items: items || [],
      subtotal: Number(subtotal) || 0,
      deliveryFee: Number(deliveryFee) || 0,
      discount: Number(discount || 0),
      total: Number(total) || 0,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus: 'Pending',
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.unshift(newOrder);
    saveList(STORAGE_KEYS.ORDERS, orders);

    return { status: 201, data: { order: newOrder, message: 'Order created successfully.' } };
  }

  // 7. GET /orders/:id
  const orderMatch = path.match(/^\/orders\/([^/]+)$/);
  if (normMethod === 'get' && orderMatch) {
    const id = orderMatch[1];
    if (id === 'my') {
      return { status: 200, data: { orders } };
    }
    const order = orders.find(o => o._id === id || o.orderNumber === id);
    if (!order) {
      return { status: 404, data: { message: 'Order not found.' } };
    }
    return { status: 200, data: { order } };
  }

  // 8. GET /orders
  if (normMethod === 'get' && path === '/orders') {
    return { status: 200, data: { orders } };
  }

  // 9. AUTH
  if (normMethod === 'post' && path === '/auth/login') {
    const { email, password } = data || {};
    const mockUser: User = {
      _id: 'usr-customer-01',
      name: email?.includes('admin') ? 'Interwood Lahore Admin' : 'Valued Customer',
      email: email || 'customer@interwood.pk',
      role: email?.includes('admin') ? 'admin' : 'customer',
      phone: '+92 300 1234567',
      address: {
        street: 'House 42, Sector Y, Phase 3, DHA',
        city: 'Lahore',
        province: 'Punjab',
        postalCode: '54792'
      },
      createdAt: new Date().toISOString()
    };
    const token = 'mock-jwt-token-' + Date.now();
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    return { status: 200, data: { token, user: mockUser, message: 'Logged in successfully.' } };
  }

  if (normMethod === 'post' && path === '/auth/register') {
    const { name, email, phone } = data || {};
    const newUser: User = {
      _id: `usr-${Date.now()}`,
      name: name || 'New Customer',
      email: email || '',
      phone: phone || '',
      role: 'customer',
      createdAt: new Date().toISOString()
    };
    const token = 'mock-jwt-token-' + Date.now();
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    return { status: 201, data: { token, user: newUser, message: 'Account registered successfully.' } };
  }

  if (normMethod === 'get' && path === '/auth/me') {
    const mockUser: User = {
      _id: 'usr-customer-01',
      name: 'Valued Customer',
      email: 'customer@interwood.pk',
      role: 'customer',
      phone: '+92 300 1234567',
      address: {
        street: 'House 42, Sector Y, Phase 3, DHA',
        city: 'Lahore',
        province: 'Punjab',
        postalCode: '54792'
      },
      createdAt: new Date().toISOString()
    };
    return { status: 200, data: { user: mockUser } };
  }

  if (normMethod === 'put' && path === '/auth/profile') {
    return { status: 200, data: { user: data, message: 'Profile updated successfully.' } };
  }

  // 10. POST /contact
  if (normMethod === 'post' && path === '/contact') {
    return { status: 201, data: { message: 'Thank you for reaching out to Interwood Lahore. Our team will contact you shortly.' } };
  }

  // 11. SETTINGS
  if (normMethod === 'get' && path === '/settings') {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return { status: 200, data: { settings: saved ? JSON.parse(saved) : defaultSettings } };
    } catch {
      return { status: 200, data: { settings: defaultSettings } };
    }
  }

  if (normMethod === 'put' && path === '/settings') {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data));
    } catch {
      // ignore
    }
    return { status: 200, data: { settings: data, message: 'Settings saved successfully.' } };
  }

  // 12. ADMIN STATS
  if (normMethod === 'get' && path === '/admin/stats') {
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);
    const lowStockProducts = products.filter(p => p.stock < 5);
    const categoryCounts = categoriesData.map(c => ({
      name: c.name,
      count: products.filter(p => p.category.toLowerCase() === c.name.toLowerCase()).length
    }));

    return {
      status: 200,
      data: {
        totalProducts,
        totalOrders,
        totalCustomers: 128,
        pendingOrders: orders.filter(o => o.status === 'Pending').length,
        completedOrders: orders.filter(o => o.status === 'Delivered').length,
        totalRevenue,
        lowStockCount: lowStockProducts.length,
        lowStockProducts: lowStockProducts.slice(0, 8),
        categoryCounts
      }
    };
  }

  // 13. ADMIN CRUD FOR PRODUCTS
  if (normMethod === 'post' && path === '/products') {
    const newProduct: Product = {
      _id: `prod-${Date.now()}`,
      id: `prod-${Date.now()}`,
      name: data.name,
      slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      SKU: data.SKU || `IWD-NEW-${Date.now().toString().slice(-4)}`,
      category: data.category,
      subcategory: data.subcategory || data.category,
      brand: 'Interwood',
      description: data.description || `Handcrafted ${data.name} by Interwood Lahore.`,
      shortDescription: data.shortDescription || 'Interwood Lahore premium furniture.',
      price: Number(data.price),
      compareAtPrice: data.compareAtPrice ? Number(data.compareAtPrice) : undefined,
      discount: data.discount || 0,
      stock: Number(data.stock) || 10,
      stockStatus: 'In Stock',
      images: Array.isArray(data.images) && data.images.length ? data.images : ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'],
      thumbnail: data.thumbnail || data.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
      gallery: data.gallery || data.images || [],
      specifications: data.specifications || [{ label: 'Brand', value: 'Interwood' }],
      dimensions: data.dimensions || { length: 120, width: 60, height: 75, unit: 'cm' },
      material: data.material || 'Solid Wood & Veneer',
      color: data.color || 'Walnut',
      warranty: '1-Year Structural Warranty',
      rating: 5.0,
      reviewsCount: 0,
      featured: !!data.featured,
      bestseller: !!data.bestseller,
      newArrival: true,
      tags: data.tags || [data.category.toLowerCase(), 'interwood', 'lahore'],
      createdAt: new Date().toISOString()
    };
    products.unshift(newProduct);
    saveList(STORAGE_KEYS.PRODUCTS, products);
    return { status: 201, data: { product: newProduct, message: 'Product created successfully.' } };
  }

  const prodPutDelete = path.match(/^\/products\/([^/]+)$/);
  if (prodPutDelete) {
    const pid = prodPutDelete[1];
    if (normMethod === 'put') {
      const idx = products.findIndex(p => p._id === pid || p.id === pid);
      if (idx > -1) {
        products[idx] = { ...products[idx], ...data };
        saveList(STORAGE_KEYS.PRODUCTS, products);
        return { status: 200, data: { product: products[idx], message: 'Product updated.' } };
      }
    }
    if (normMethod === 'delete') {
      products = products.filter(p => p._id !== pid && p.id !== pid);
      saveList(STORAGE_KEYS.PRODUCTS, products);
      return { status: 200, data: { message: 'Product deleted.' } };
    }
  }

  // Default 404
  return { status: 404, data: { message: `Not found: ${method} ${path}` } };
}
