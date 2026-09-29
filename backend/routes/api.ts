import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/db.js';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth.js';
import { Product, Order, Review, ContactMessage } from '../types.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'interwood_lahore_secure_jwt_secret_key_2026';

// ==================== AUTHENTICATION ====================

router.post('/auth/register', (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: 'Name, email, and password are required.' });
    return;
  }

  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    res.status(409).json({ message: 'An account with this email address already exists.' });
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const newUser = {
    _id: `usr-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: 'customer' as const,
    phone: phone || '',
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  db.save();

  const token = jwt.sign({ userId: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
  const { password: _, ...userWithoutPass } = newUser;

  res.status(201).json({
    token,
    user: userWithoutPass,
    message: 'Account registered successfully.'
  });
});

router.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required.' });
    return;
  }

  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || !user.password) {
    res.status(401).json({ message: 'Invalid email or password.' });
    return;
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    res.status(401).json({ message: 'Invalid email or password.' });
    return;
  }

  const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  const { password: _, ...userWithoutPass } = user;

  res.json({
    token,
    user: userWithoutPass,
    message: 'Logged in successfully.'
  });
});

router.get('/auth/me', authenticateToken, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated.' });
    return;
  }
  const { password: _, ...userWithoutPass } = req.user;
  res.json({ user: userWithoutPass });
});

router.put('/auth/profile', authenticateToken, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated.' });
    return;
  }

  const { name, phone, address } = req.body;
  const user = db.users.find(u => u._id === req.user!._id);
  if (!user) {
    res.status(404).json({ message: 'User not found.' });
    return;
  }

  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (address) user.address = address;

  db.save();
  const { password: _, ...userWithoutPass } = user;
  res.json({ user: userWithoutPass, message: 'Profile updated successfully.' });
});

// ==================== PRODUCTS ====================

router.get('/products', (req: Request, res: Response) => {
  let results = [...db.products];

  const search = (req.query.search as string)?.toLowerCase().trim();
  const category = req.query.category as string;
  const subcategory = req.query.subcategory as string;
  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
  const color = req.query.color as string;
  const material = req.query.material as string;
  const featured = req.query.featured === 'true';
  const bestseller = req.query.bestseller === 'true';
  const newArrival = req.query.newArrival === 'true';
  const sort = (req.query.sort as string) || 'featured';
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 16);

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

  // Sorting
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

  res.json({
    products: paginated,
    pagination: {
      total,
      page,
      limit,
      totalPages
    }
  });
});

router.get('/products/:identifier', (req: Request, res: Response) => {
  const { identifier } = req.params;
  const product = db.products.find(p => p._id === identifier || p.id === identifier || p.slug === identifier || p.SKU.toLowerCase() === identifier.toLowerCase());

  if (!product) {
    res.status(404).json({ message: 'Product not found.' });
    return;
  }

  // Related products from same category
  const related = db.products
    .filter(p => p.category === product.category && p._id !== product._id)
    .slice(0, 4);

  res.json({ product, related });
});

router.post('/products', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const pData = req.body;
  if (!pData.name || !pData.category || !pData.price) {
    res.status(400).json({ message: 'Product name, category, and price are required.' });
    return;
  }

  const slug = pData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const prefix = pData.category.substring(0, 3).toUpperCase();
  const SKU = pData.SKU || `IWD-${prefix}-${Date.now().toString().slice(-4)}`;

  const newProduct: Product = {
    _id: `prod-${Date.now()}`,
    id: `prod-${Date.now()}`,
    name: pData.name,
    slug,
    SKU,
    category: pData.category,
    subcategory: pData.subcategory || pData.category,
    brand: 'Interwood',
    description: pData.description || `Luxury ${pData.name} manufactured by Interwood Lahore.`,
    shortDescription: pData.shortDescription || `Interwood Lahore premium craftsmanship.`,
    price: Number(pData.price),
    compareAtPrice: pData.compareAtPrice ? Number(pData.compareAtPrice) : undefined,
    discount: pData.discount || 0,
    stock: pData.stock !== undefined ? Number(pData.stock) : 10,
    stockStatus: pData.stockStatus || 'In Stock',
    images: Array.isArray(pData.images) && pData.images.length ? pData.images : ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'],
    thumbnail: pData.thumbnail || pData.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    gallery: pData.gallery || pData.images || [],
    specifications: pData.specifications || [{ label: 'Brand', value: 'Interwood' }],
    dimensions: pData.dimensions || { length: 120, width: 60, height: 75, unit: 'cm' },
    material: pData.material || 'Solid Wood & Engineered Veneer',
    color: pData.color || 'Walnut',
    warranty: pData.warranty || '1-Year Structural Warranty (Sample / Demo Data)',
    rating: 5.0,
    reviewsCount: 0,
    featured: !!pData.featured,
    bestseller: !!pData.bestseller,
    newArrival: true,
    tags: pData.tags || [pData.category.toLowerCase(), 'interwood', 'lahore'],
    createdAt: new Date().toISOString()
  };

  db.products.unshift(newProduct);
  db.save();

  res.status(201).json({ product: newProduct, message: 'Product created successfully.' });
});

router.put('/products/:id', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.products.findIndex(p => p._id === id || p.id === id);

  if (index === -1) {
    res.status(404).json({ message: 'Product not found.' });
    return;
  }

  const existing = db.products[index];
  const updated: Product = {
    ...existing,
    ...req.body,
    _id: existing._id,
    id: existing.id
  };

  db.products[index] = updated;
  db.save();

  res.json({ product: updated, message: 'Product updated successfully.' });
});

router.delete('/products/:id', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const initialLen = db.products.length;
  const filtered = db.products.filter(p => p._id !== id && p.id !== id);

  if (filtered.length === initialLen) {
    res.status(404).json({ message: 'Product not found.' });
    return;
  }

  // Mutate in place
  db.products.splice(0, db.products.length, ...filtered);
  db.save();

  res.json({ message: 'Product deleted successfully.' });
});

// ==================== CATEGORIES ====================

router.get('/categories', (_req: Request, res: Response) => {
  // Update product counts dynamically
  const categoriesWithCounts = db.categories.map(cat => {
    const count = db.products.filter(p => p.category.toLowerCase() === cat.name.toLowerCase()).length;
    return { ...cat, productCount: count || cat.productCount };
  });
  res.json({ categories: categoriesWithCounts });
});

// ==================== ORDERS ====================

router.post('/orders', (req: Request, res: Response) => {
  const { customerName, customerEmail, customerPhone, shippingAddress, items, subtotal, deliveryFee, discount, total, paymentMethod } = req.body;

  if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !items || !items.length) {
    res.status(400).json({ message: 'Please provide all customer contact and shipping details.' });
    return;
  }

  const orderNum = `IWD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newOrder: Order = {
    _id: `ord-${Date.now()}`,
    orderNumber: orderNum,
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    items,
    subtotal: Number(subtotal),
    deliveryFee: Number(deliveryFee),
    discount: Number(discount || 0),
    total: Number(total),
    paymentMethod: paymentMethod || 'Cash on Delivery',
    paymentStatus: 'Pending',
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Decrement stock
  for (const item of items) {
    const prod = db.products.find(p => p._id === item.productId || p.id === item.productId);
    if (prod && prod.stock > 0) {
      prod.stock = Math.max(0, prod.stock - item.quantity);
      if (prod.stock === 0) {
        prod.stockStatus = 'Out of Stock';
      }
    }
  }

  db.orders.unshift(newOrder);
  db.save();

  res.status(201).json({ order: newOrder, message: 'Order created successfully.' });
});

router.get('/orders/my', authenticateToken, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated.' });
    return;
  }

  const userOrders = db.orders.filter(o =>
    (o.userId && o.userId === req.user!._id) ||
    o.customerEmail.toLowerCase() === req.user!.email.toLowerCase()
  );

  res.json({ orders: userOrders });
});

router.get('/orders', authenticateToken, requireAdmin, (_req: Request, res: Response) => {
  res.json({ orders: db.orders });
});

router.get('/orders/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const order = db.orders.find(o => o._id === id || o.orderNumber === id);
  if (!order) {
    res.status(404).json({ message: 'Order not found.' });
    return;
  }
  res.json({ order });
});

router.put('/orders/:id/status', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;

  const order = db.orders.find(o => o._id === id || o.orderNumber === id);
  if (!order) {
    res.status(404).json({ message: 'Order not found.' });
    return;
  }

  if (status) order.status = status;
  if (paymentStatus) order.paymentStatus = paymentStatus;
  order.updatedAt = new Date().toISOString();

  db.save();
  res.json({ order, message: 'Order status updated successfully.' });
});

// ==================== REVIEWS ====================

router.get('/products/:id/reviews', (req: Request, res: Response) => {
  const { id } = req.params;
  const reviews = db.reviews.filter(r => r.productId === id);
  res.json({ reviews });
});

router.post('/products/:id/reviews', (req: Request, res: Response) => {
  const { id } = req.params;
  const { userName, rating, title, comment } = req.body;

  if (!userName || !rating || !comment) {
    res.status(400).json({ message: 'Name, rating, and review text are required.' });
    return;
  }

  const newReview: Review = {
    _id: `rev-${Date.now()}`,
    productId: id,
    userName: `${userName} (Sample Review)`,
    rating: Number(rating),
    title: title || 'Verified Customer Review',
    comment,
    verifiedPurchase: true,
    createdAt: new Date().toISOString()
  };

  db.reviews.unshift(newReview);

  // Recalculate product rating
  const prod = db.products.find(p => p._id === id || p.id === id);
  if (prod) {
    const prodReviews = db.reviews.filter(r => r.productId === id);
    const sum = prodReviews.reduce((acc, curr) => acc + curr.rating, 0);
    prod.rating = Number((sum / prodReviews.length).toFixed(1));
    prod.reviewsCount = prodReviews.length;
  }

  db.save();
  res.status(201).json({ review: newReview, message: 'Review submitted successfully.' });
});

// ==================== COUPONS ====================

router.post('/coupons/validate', (req: Request, res: Response) => {
  const { code, subtotal } = req.body;
  if (!code) {
    res.status(400).json({ message: 'Coupon code required.' });
    return;
  }

  const coupon = db.coupons.find(c => c.code.toUpperCase() === code.toUpperCase().trim() && c.active);
  if (!coupon) {
    res.status(404).json({ message: 'Invalid or expired promo code.' });
    return;
  }

  if (subtotal && subtotal < coupon.minPurchase) {
    res.status(400).json({ message: `This coupon requires a minimum subtotal of Rs. ${coupon.minPurchase.toLocaleString()}` });
    return;
  }

  const discountAmount = Math.round((subtotal * coupon.discountPercent) / 100);

  res.json({
    valid: true,
    code: coupon.code,
    discountPercent: coupon.discountPercent,
    discountAmount,
    message: `Promo applied: ${coupon.discountPercent}% discount.`
  });
});

// ==================== CONTACT ====================

router.post('/contact', (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    res.status(400).json({ message: 'Name, email, and message are required.' });
    return;
  }

  const newContact: ContactMessage = {
    _id: `cnt-${Date.now()}`,
    name,
    email,
    phone: phone || '',
    subject: subject || 'General Showroom Inquiry',
    message,
    createdAt: new Date().toISOString(),
    status: 'unread'
  };

  db.contacts.unshift(newContact);
  db.save();

  res.status(201).json({ message: 'Thank you for reaching out to Interwood Lahore. Our team will contact you shortly.' });
});

// ==================== SETTINGS ====================

router.get('/settings', (_req: Request, res: Response) => {
  res.json({ settings: db.settings });
});

router.put('/settings', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const { whatsappNumber, announcementText, freeDeliveryThreshold, standardDeliveryFee } = req.body;

  if (whatsappNumber !== undefined) db.settings.whatsappNumber = whatsappNumber;
  if (announcementText !== undefined) db.settings.announcementText = announcementText;
  if (freeDeliveryThreshold !== undefined) db.settings.freeDeliveryThreshold = Number(freeDeliveryThreshold);
  if (standardDeliveryFee !== undefined) db.settings.standardDeliveryFee = Number(standardDeliveryFee);

  db.save();
  res.json({ settings: db.settings, message: 'Settings saved successfully.' });
});

// ==================== ADMIN DASHBOARD ====================

router.get('/admin/stats', authenticateToken, requireAdmin, (_req: Request, res: Response) => {
  const totalProducts = db.products.length;
  const totalOrders = db.orders.length;
  const totalCustomers = db.users.filter(u => u.role === 'customer').length;
  const pendingOrders = db.orders.filter(o => o.status === 'Pending').length;
  const completedOrders = db.orders.filter(o => o.status === 'Delivered').length;
  const totalRevenue = db.orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);
  const lowStockProducts = db.products.filter(p => p.stock < 5);

  // Category counts
  const categoryCounts = db.categories.map(c => ({
    name: c.name,
    count: db.products.filter(p => p.category.toLowerCase() === c.name.toLowerCase()).length
  }));

  res.json({
    totalProducts,
    totalOrders,
    totalCustomers,
    pendingOrders,
    completedOrders,
    totalRevenue,
    lowStockCount: lowStockProducts.length,
    lowStockProducts: lowStockProducts.slice(0, 8),
    categoryCounts
  });
});

export default router;
