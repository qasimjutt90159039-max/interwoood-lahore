export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: 'customer' | 'admin';
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    province?: string;
    postalCode?: string;
  };
  createdAt: string;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  SKU: string;
  category: string;
  subcategory: string;
  brand: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  discount?: number;
  stock: number;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Made to Order';
  images: string[];
  thumbnail: string;
  gallery: string[];
  specifications: ProductSpecification[];
  dimensions: ProductDimensions;
  material: string;
  color: string;
  warranty: string;
  rating: number;
  reviewsCount: number;
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  tags: string[];
  createdAt: string;
}

export interface Category {
  _id: string;
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  subcategories: string[];
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  SKU: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  orderNotes?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: 'Cash on Delivery' | 'Lahore Showroom Payment' | 'Bank Transfer';
  paymentStatus: 'Pending' | 'Paid';
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  productId: string;
  userId?: string;
  userName: string;
  userEmail?: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minPurchase: number;
  active: boolean;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read' | 'replied';
}

export interface StoreSettings {
  whatsappNumber: string;
  announcementText: string;
  freeDeliveryThreshold: number;
  standardDeliveryFee: number;
  showroomAddress: string;
  headOfficeAddress: string;
  mainPhone: string;
  showroomPhone: string;
  complaintsEmail: string;
  corporateEmail: string;
}
