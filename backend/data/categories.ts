import { Category } from '../types.js';

export const categoriesData: Category[] = [
  {
    _id: 'cat-sofas',
    id: 'sofas',
    name: 'Sofas',
    slug: 'sofas',
    description: 'Bespoke 3-seaters, sectional couches, corner suites, and modern lounge sofas crafted for comfort.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
    subcategories: ['3 Seater Sofas', 'Sectional Sofas', 'Corner Sofas', '2 Seater Sofas', 'Recliner Sofas', 'Lounge Suites'],
    productCount: 16
  },
  {
    _id: 'cat-chairs',
    id: 'chairs',
    name: 'Armchairs & Accent Chairs',
    slug: 'chairs',
    description: 'Sculptural lounge chairs, contemporary velvet accent seats, and ergonomic reading armchairs.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80',
    subcategories: ['Accent Chairs', 'Lounge Chairs', 'Velvet Chairs', 'Reading Chairs', 'Wooden Armchairs'],
    productCount: 12
  },
  {
    _id: 'cat-coffee-tables',
    id: 'coffee-tables',
    name: 'Coffee Tables',
    slug: 'coffee-tables',
    description: 'Solid walnut center tables, tempered glass coffee tables, nesting sets, and travertine designs.',
    image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=1000&q=80',
    subcategories: ['Walnut Tables', 'Round Coffee Tables', 'Nesting Tables', 'Marble Top Tables', 'Center Tables'],
    productCount: 10
  },
  {
    _id: 'cat-tv-units',
    id: 'tv-units',
    name: 'TV Units & Consoles',
    slug: 'tv-units',
    description: 'Minimalist floating consoles, family entertainment units, and walnut TV cabinets with cable management.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    subcategories: ['Floating TV Units', 'Media Consoles', 'Walnut Cabinets', 'Family Entertainment Units'],
    productCount: 8
  },
  {
    _id: 'cat-beds',
    id: 'beds',
    name: 'Beds',
    slug: 'beds',
    description: 'Master king beds, upholstered headboards, storage platform beds, and solid wood bedroom frames.',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80',
    subcategories: ['King Beds', 'Queen Beds', 'Storage Beds', 'Upholstered Beds', 'Platform Beds'],
    productCount: 16
  },
  {
    _id: 'cat-bedroom-storage',
    id: 'bedroom-storage',
    name: 'Bedside Tables & Dressers',
    slug: 'bedside-tables-dressers',
    description: 'Walnut bedside nightstands, 6-drawer bedroom dressers, vanity dressing tables, and drawer chests.',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1000&q=80',
    subcategories: ['Bedside Tables', 'Nightstands', 'Chest of Drawers', 'Dressing Tables', 'Bedroom Storage'],
    productCount: 12
  },
  {
    _id: 'cat-wardrobes',
    id: 'wardrobes',
    name: 'Wardrobes & Closets',
    slug: 'wardrobes',
    description: 'Sliding door wardrobes, 3-door modular storage, master bedroom almirahs, and minimalist closets.',
    image: 'https://images.unsplash.com/photo-1558997519-83ea9252def8?auto=format&fit=crop&w=1000&q=80',
    subcategories: ['2 Door Wardrobes', '3 Door Wardrobes', 'Sliding Door Wardrobes', 'Modular Storage'],
    productCount: 8
  },
  {
    _id: 'cat-dining-tables',
    id: 'dining-tables',
    name: 'Dining Tables',
    slug: 'dining-tables',
    description: 'Grand 6-seater and 8-seater solid wood tables, round contemporary dining tables, and marble finishes.',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1000&q=80',
    subcategories: ['4 Seater Tables', '6 Seater Tables', '8 Seater Tables', 'Round Dining Tables', 'Extendable Tables'],
    productCount: 10
  },
  {
    _id: 'cat-dining-chairs',
    id: 'dining-chairs',
    name: 'Dining Chairs',
    slug: 'dining-chairs',
    description: 'Ergonomic upholstered dining seats, classic solid wood dining chairs, and velvet dining armchairs.',
    image: 'https://images.unsplash.com/photo-1519947486513-ce62b9a383d6?auto=format&fit=crop&w=1000&q=80',
    subcategories: ['Upholstered Chairs', 'Wooden Dining Chairs', 'Velvet Chairs', 'Minimalist Chairs'],
    productCount: 8
  },
  {
    _id: 'cat-office',
    id: 'office',
    name: 'Office Furniture',
    slug: 'office-furniture',
    description: 'Executive managerial desks, high-back ergonomic mesh chairs, conference tables, and filing credenzas.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
    subcategories: ['Executive Desks', 'Ergonomic Chairs', 'Conference Tables', 'Workstations', 'Filing Cabinets'],
    productCount: 15
  },
  {
    _id: 'cat-mattresses',
    id: 'mattresses',
    name: 'Mattresses',
    slug: 'mattresses',
    description: 'High-density orthopedic mattresses, pocket spring support, cool gel memory foam, and luxury comfort.',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80',
    subcategories: ['Orthopedic Mattresses', 'Pocket Spring', 'Memory Foam', 'King Size Mattresses', 'Queen Size Mattresses'],
    productCount: 10
  },
  {
    _id: 'cat-decor',
    id: 'decor',
    name: 'Home Decor & Lighting',
    slug: 'home-decor',
    description: 'Floor-standing architectural lamps, brass decorative mirrors, woven area rugs, and accent ornaments.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80',
    subcategories: ['Wall Mirrors', 'Floor Lamps', 'Table Lamps', 'Area Rugs', 'Decorative Cushions', 'Vases'],
    productCount: 10
  }
];
