import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { CartProvider } from './context/CartContext.js';
import { WishlistProvider } from './context/WishlistContext.js';

import { Header } from './components/common/Header.js';
import { Footer } from './components/common/Footer.js';
import { CartDrawer } from './components/common/CartDrawer.js';
import { WhatsAppButton } from './components/common/WhatsAppButton.js';

import { HomePage } from './pages/HomePage.js';
import { ShopPage } from './pages/ShopPage.js';
import { ProductDetailPage } from './pages/ProductDetailPage.js';
import { CartPage } from './pages/CartPage.js';
import { CheckoutPage } from './pages/CheckoutPage.js';
import { OrderSuccessPage } from './pages/OrderSuccessPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { MyAccountPage } from './pages/MyAccountPage.js';
import { MyOrdersPage } from './pages/MyOrdersPage.js';
import { WishlistPage } from './pages/WishlistPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { ContactPage } from './pages/ContactPage.js';
import { FAQPage } from './pages/FAQPage.js';
import { AdminDashboardPage } from './pages/AdminDashboardPage.js';
import { NotFoundPage } from './pages/NotFoundPage.js';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="min-h-screen flex flex-col bg-[#F7F5F1] text-[#222222]">
              {/* Header */}
              <Header />

              {/* Main Content Area */}
              <main className="flex-1">
                <Routes>
                  {/* Core storefront routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/categories" element={<Navigate to="/shop" replace />} />
                  <Route path="/products/:slug" element={<ProductDetailPage />} />

                  {/* Dedicated Category shortcut routes */}
                  <Route path="/living-room" element={<Navigate to="/shop?category=Sofas" replace />} />
                  <Route path="/bedroom" element={<Navigate to="/shop?category=Beds" replace />} />
                  <Route path="/dining" element={<Navigate to="/shop?category=Dining+Tables" replace />} />
                  <Route path="/office" element={<Navigate to="/shop?category=Office+Furniture" replace />} />
                  <Route path="/mattresses" element={<Navigate to="/shop?category=Mattresses" replace />} />
                  <Route path="/decor" element={<Navigate to="/shop?category=Home+Decor+%26+Lighting" replace />} />
                  <Route path="/new-arrivals" element={<Navigate to="/shop?newArrival=true" replace />} />
                  <Route path="/sale" element={<Navigate to="/shop?sale=true" replace />} />

                  {/* Informational pages */}
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/shipping-and-delivery" element={<Navigate to="/faq" replace />} />
                  <Route path="/returns" element={<Navigate to="/faq" replace />} />

                  {/* Ecommerce checkout & bag */}
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-success/:id" element={<OrderSuccessPage />} />

                  {/* Customer portal */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/account" element={<MyAccountPage />} />
                  <Route path="/orders" element={<MyOrdersPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />

                  {/* Admin console */}
                  <Route path="/admin" element={<AdminDashboardPage />} />

                  {/* 404 handler */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>

              {/* Global Floating Elements & Slide-outs */}
              <CartDrawer />
              <WhatsAppButton variant="floating" />

              {/* Footer */}
              <Footer />
            </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
