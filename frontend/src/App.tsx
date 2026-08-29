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
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name'>('default');

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

  // Logout reset
  useEffect(() => {
    if (!user) {
      setActiveView('home');
      setIsCartOpen(false);
      setIsCheckoutOpen(false);
    }
  }, [user]);

  // Sort products logic
  const sortedProducts = [...products].sort((a, b) => {
    const priceA = a.discountPrice || a.price;
    const priceB = b.discountPrice || b.price;
    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

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

            {/* Category Filter & Sorting Toolbar */}
            <div id="products-section" style={{ margin: '36px 0 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              {/* Category Pills */}
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px', maxWidth: '100%' }}>
                <button
                  className={`btn ${selectedCategory === null ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: 'var(--radius-full)', padding: '9px 22px', fontSize: '0.9rem' }}
                  onClick={() => setSelectedCategory(null)}
                >
                  ⚡ Tất Cả Sản Phẩm
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`btn ${selectedCategory === cat.id ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ borderRadius: 'var(--radius-full)', padding: '9px 22px', fontSize: '0.9rem' }}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Sorting Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>Sắp xếp theo:</span>
                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  style={{ padding: '8px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.88rem', width: 'auto' }}
                >
                  <option value="default">Mặc định (Phổ biến nhất)</option>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                  <option value="name">Tên sản phẩm (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Product Grid / Empty State */}
            {loading ? (
              <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '14px', animation: 'spin 1.5s linear infinite' }}>⏳</div>
                <p>Đang tải danh sách sản phẩm tuyệt đỉnh...</p>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="glass-panel" style={{ padding: '70px 24px', textAlign: 'center', color: 'var(--text-muted)', marginBottom: '60px' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🔎</div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Không tìm thấy sản phẩm phù hợp!</h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-dim)' }}>Hãy thử từ khóa tìm kiếm khác hoặc chuyển danh mục sản phẩm.</p>
              </div>
            ) : (
              <div className="grid-products" style={{ marginBottom: '80px' }}>
                {sortedProducts.map((prod) => (
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
      <footer style={{ borderTop: '1px solid var(--border-glass)', background: 'rgba(11, 15, 25, 0.95)', padding: '36px 0', marginTop: 'auto' }}>
        <div className="app-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>⚡</span>
            <span>© 2026 <strong>NeoStore Cloud Platform</strong>. Spring Boot 3.x & Neon PostgreSQL.</span>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-dim)')}>Chính sách bảo mật</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-dim)')}>Điều khoản dịch vụ</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-dim)')}>Hỗ trợ 24/7</span>
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
          <span>✨</span>
          <span>{toastMessage}</span>
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
