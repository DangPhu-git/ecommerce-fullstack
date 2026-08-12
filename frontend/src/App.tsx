import React, { useEffect, useState } from 'react';
import { AdminView } from './components/AdminView';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { OrdersView } from './components/OrdersView';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { api } from './services/api';

import type { Category, Product } from './types';

const MainContent: React.FC = () => {
  const { toastMessage } = useCart();
  const { user } = useAuth();

  // Navigation and Views state
  const [activeView, setActiveView] = useState<'home' | 'orders' | 'admin'>('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Data
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cData, pData] = await Promise.all([
          api.getCategories(),
          api.getProducts(searchTerm, selectedCategory || undefined),
        ]);
        setCategories(cData);
        setProducts(pData);
      } catch (err) {
        console.error('Error fetching catalog data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, selectedCategory]);

  // Khi đăng xuất (user = null), tự động về trang chủ
  useEffect(() => {
    if (!user) {
      setActiveView('home');
      setIsCartOpen(false);
      setIsCheckoutOpen(false);
    }
  }, [user]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setActiveView('orders')}
        onOpenAdmin={() => setActiveView('admin')}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      <main className="app-container" style={{ flex: 1 }}>
        {activeView === 'orders' ? (
          <OrdersView />
        ) : activeView === 'admin' ? (
          <AdminView />
        ) : (
          <>
            {/* Hero Section */}
            <Hero />

            {/* Category Filter Pills */}
            <div id="products-section" style={{ margin: '32px 0 24px 0', display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
              <button
                className={`btn ${selectedCategory === null ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-full)', padding: '8px 20px', fontSize: '0.9rem' }}
                onClick={() => setSelectedCategory(null)}
              >
                Tất Cả Sản Phẩm
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`btn ${selectedCategory === cat.id ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: 'var(--radius-full)', padding: '8px 20px', fontSize: '0.9rem' }}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            {loading ? (
              <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                Đang tải danh sách sản phẩm...
              </div>
            ) : products.length === 0 ? (
              <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔎</div>
                <h3>Không tìm thấy sản phẩm nào!</h3>
              </div>
            ) : (
              <div className="grid-products" style={{ marginBottom: '60px' }}>
                {products.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onSelect={(p) => setSelectedProduct(p)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-glass)', background: 'rgba(15, 23, 42, 0.9)', padding: '32px 0', marginTop: 'auto' }}>
        <div className="app-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <div>
            © 2026 <strong>NeoStore E-Commerce</strong>. Điện toán đám mây Neon PostgreSQL & Spring Boot.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Chính sách bảo mật</span>
            <span>Điều khoản dịch vụ</span>
            <span>Hỗ trợ 24/7</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={() => {
          setIsCheckoutOpen(false);
          setActiveView('orders');
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Global Toast Alert */}
      {toastMessage && (
        <div className="toast-alert">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainContent />
      </CartProvider>
    </AuthProvider>
  );
}
