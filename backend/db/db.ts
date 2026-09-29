import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { productsData } from '../data/products.js';
import { categoriesData } from '../data/categories.js';
import { User, Product, Category, Order, Review, Coupon, ContactMessage, StoreSettings } from '../types.js';

interface DatabaseSchema {
  users: User[];
  products: Product[];
  categories: Category[];
  orders: Order[];
  reviews: Review[];
  coupons: Coupon[];
  contacts: ContactMessage[];
  settings: StoreSettings;
}

const DATA_FILE = path.resolve(process.cwd(), 'database_store.json');

const defaultSettings: StoreSettings = {
  whatsappNumber: process.env.WHATSAPP_NUMBER || '+9242111203203',
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

const initialCoupons: Coupon[] = [
  { code: 'INTERWOOD10', discountPercent: 10, minPurchase: 50000, active: true },
  { code: 'LAHORE5', discountPercent: 5, minPurchase: 25000, active: true },
  { code: 'WELCOME15', discountPercent: 15, minPurchase: 100000, active: true }
];

const initialReviews: Review[] = [
  {
    _id: 'rev-01',
    productId: 'prod-sof-01',
    userName: 'Hamza Malik (Sample Review)',
    rating: 5,
    title: 'Superb quality and solid build',
    comment: 'The 3-seater sofa was delivered right to my apartment in Gulberg, Lahore. The velvet fabric is plush and the woodwork finish matches our interior perfectly.',
    verifiedPurchase: true,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    _id: 'rev-02',
    productId: 'prod-bed-01',
    userName: 'Ayesha Khan (Sample Review)',
    rating: 5,
    title: 'Modern King Bed exceeded expectations',
    comment: 'Impeccable craftsmanship. Assembly team was courteous and finished installation in under 45 minutes.',
    verifiedPurchase: true,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
  }
];

const initialOrders: Order[] = [
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
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const content = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(content);
        return {
          users: parsed.users || [],
          products: (parsed.products && parsed.products.length >= 100) ? parsed.products : productsData,
          categories: parsed.categories || categoriesData,
          orders: parsed.orders || initialOrders,
          reviews: parsed.reviews || initialReviews,
          coupons: parsed.coupons || initialCoupons,
          contacts: parsed.contacts || [],
          settings: { ...defaultSettings, ...(parsed.settings || {}) }
        };
      }
    } catch (err) {
      console.error('Error loading database file, seeding defaults:', err);
    }

    const salt = bcrypt.genSaltSync(10);
    const initialUsers: User[] = [
      {
        _id: 'usr-admin-01',
        name: 'Interwood Lahore Admin',
        email: 'admin@interwood.pk',
        password: bcrypt.hashSync('admin123', salt),
        role: 'admin',
        phone: '+92 42 111-203-203',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'usr-customer-01',
        name: 'Bilal Tariq',
        email: 'customer@interwood.pk',
        password: bcrypt.hashSync('customer123', salt),
        role: 'customer',
        phone: '+92 300 1234567',
        address: {
          street: 'House 42, Sector Y, Phase 3, DHA',
          city: 'Lahore',
          province: 'Punjab',
          postalCode: '54792'
        },
        createdAt: new Date().toISOString()
      }
    ];

    const initialData: DatabaseSchema = {
      users: initialUsers,
      products: productsData,
      categories: categoriesData,
      orders: initialOrders,
      reviews: initialReviews,
      coupons: initialCoupons,
      contacts: [],
      settings: defaultSettings
    };

    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write initial database file:', err);
    }

    return initialData;
  }

  public save(): void {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error persisting database:', err);
    }
  }

  // Collections accessors
  get users(): User[] { return this.data.users; }
  get products(): Product[] { return this.data.products; }
  get categories(): Category[] { return this.data.categories; }
  get orders(): Order[] { return this.data.orders; }
  get reviews(): Review[] { return this.data.reviews; }
  get coupons(): Coupon[] { return this.data.coupons; }
  get contacts(): ContactMessage[] { return this.data.contacts; }
  get settings(): StoreSettings { return this.data.settings; }
}

export const db = new Database();
