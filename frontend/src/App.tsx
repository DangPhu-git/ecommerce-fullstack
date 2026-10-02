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
import { PaymentResultModal } from './components/PaymentResultModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { api } from './services/api';

import type { Category, Product, PaymentCallbackResult } from './types';

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
  const [paymentResult, setPaymentResult] = useState<PaymentCallbackResult | null>(null);

  // VNPay callback detection
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('vnp_ResponseCode') && urlParams.has('vnp_TxnRef')) {
      const queryObj: Record<string, string> = {};
      urlParams.forEach((val, key) => {
        queryObj[key] = val;
      });

      api.processVNPayCallback(queryObj)
        .then((res) => {
          setPaymentResult(res as PaymentCallbackResult);
          setActiveView('orders');
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch((err) => {
          setPaymentResult({
            orderNumber: urlParams.get('vnp_TxnRef') || '',
            transactionNo: urlParams.get('vnp_TransactionNo') || '',
            amount: 0,
            status: 'FAILED',
            message: err.message || 'Xác thực thanh toán thất bại',
          });
          window.history.replaceState({}, document.title, window.location.pathname);
        });
    }
  }, []);

  // Data
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [size] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [cData, pData] = await Promise.all([
          api.getCategories(),
          api.getProducts(
            searchTerm,
            selectedCategory || undefined,
            page,
            size
          ),
        ]);

        setCategories(cData);
        setProducts(pData.content);
        setTotalPages(pData.totalPages);
        setTotalItems(pData.totalElements);
      } catch (err) {
        console.error('Error fetching catalog data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, selectedCategory, page, size]);

  useEffect(() => {
    setPage(0);
  }, [searchTerm, selectedCategory]);

  // Reset view only if logging out while viewing admin panel
  useEffect(() => {
    if (!user && activeView === 'admin') {
      setActiveView('home');
      setIsCartOpen(false);
      setIsCheckoutOpen(false);
    }
  }, [user, activeView]);

  // Sort products logic
  // const sortedProducts = [...products].sort((a, b) => {
  //   const priceA = a.discountPrice || a.price;
  //   const priceB = b.discountPrice || b.price;
  //   if (sortBy === 'price-asc') return priceA - priceB;
  //   if (sortBy === 'price-desc') return priceB - priceA;
  //   if (sortBy === 'name') return a.name.localeCompare(b.name);
  //   return 0;
  // });

  // Pagination: generate page numbers with ellipsis
  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }
    const delta = 2;
    const left = Math.max(0, page - delta);
    const right = Math.min(totalPages - 1, page + delta);
    const pages: (number | '...')[] = [];
    if (left > 0) {
      pages.push(0);
      if (left > 1) pages.push('...');
    }
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) {
      if (right < totalPages - 2) pages.push('...');
      pages.push(totalPages - 1);
    }
    return pages;
  };

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

      <main className="app-container" style={{ flex: 1, paddingBottom: '60px' }}>
        {activeView === 'orders' ? (
          <OrdersView
            onOpenAuth={() => setIsAuthOpen(true)}
            onGoToAdmin={() => setActiveView('admin')}
          />
        ) : activeView === 'admin' ? (
          <AdminView />
        ) : (
          <>
            {/* Hero Studio Showcase */}
            <Hero />

            {/* Catalog Filter & Sorting Toolbar */}
            <section id="products-section" style={{ margin: '36px 0 28px 0' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                {/* Category Pills */}
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    overflowX: 'auto',
                    maxWidth: '100%',
                    paddingBottom: '2px',
                  }}
                >
                  <button
                    className={`btn ${selectedCategory === null ? 'btn-primary' : 'btn-secondary'}`}
                    style={{
                      borderRadius: 'var(--radius-xs)',
                      padding: '7px 16px',
                      fontSize: '0.84rem',
                    }}
                    onClick={() => setSelectedCategory(null)}
                  >
                    Tất cả danh mục
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      className={`btn ${selectedCategory === cat.id ? 'btn-primary' : 'btn-secondary'}`}
                      style={{
                        borderRadius: 'var(--radius-xs)',
                        padding: '7px 16px',
                        fontSize: '0.84rem',
                      }}
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Counter & Sorting Filter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {totalItems} sản phẩm
                  </span>
                  <select
                    className="form-select"
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '0.84rem',
                      width: 'auto',
                      height: '36px',
                    }}
                  >
                    <option value="default">Sắp xếp: Mặc định</option>
                    <option value="price-asc">Giá: Thấp đến cao</option>
                    <option value="price-desc">Giá: Cao đến thấp</option>
                    <option value="name">Tên sản phẩm (A-Z)</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Product Grid / Empty State */}
            {loading ? (
              <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div
                  style={{
                    display: 'inline-block',
                    width: '32px',
                    height: '32px',
                    border: '2px solid var(--border-medium)',
                    borderTopColor: 'var(--accent-primary)',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    marginBottom: '16px',
                  }}
                />
                <p style={{ fontSize: '0.88rem' }}>Đang nạp dữ liệu danh mục...</p>
              </div>
            ) : products.length === 0 ? (
              <div
                className="glass-panel"
                style={{
                  padding: '64px 24px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  marginBottom: '60px',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-subtle)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    color: 'var(--text-dim)',
                  }}
                >
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Không tìm thấy sản phẩm phù hợp
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', maxWidth: '380px', margin: '0 auto 20px auto' }}>
                  Không có sản phẩm nào khớp với từ khóa tìm kiếm hoặc danh mục hiện tại.
                </p>
                <button
                  className="btn btn-secondary"
                  style={{ fontSize: '0.84rem' }}
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory(null);
                  }}
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid-products">
                {products.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onSelect={(p) => setSelectedProduct(p)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <nav className="pagination" aria-label="Phân trang sản phẩm">
                {/* Prev button */}
                <button
                  className="pagination-btn nav"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  aria-label="Trang trước"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Trước
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((p, idx) =>
                  p === '...' ? (
                    <span key={`ellipsis-${idx}`} className="pagination-ellipsis">···</span>
                  ) : (
                    <button
                      key={p}
                      className={`pagination-btn${page === p ? ' active' : ''}`}
                      onClick={() => setPage(p as number)}
                      aria-label={`Trang ${(p as number) + 1}`}
                      aria-current={page === p ? 'page' : undefined}
                    >
                      {(p as number) + 1}
                    </button>
                  )
                )}

                {/* Next button */}
                <button
                  className="pagination-btn nav"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  aria-label="Trang sau"
                >
                  Sau
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </nav>
            )}
          </>
        )}
      </main>

      {/* Modern Minimalist Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
          padding: '40px 0',
          marginTop: 'auto',
        }}
      >
        <div
          className="app-container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: 'var(--radius-xs)',
                background: 'var(--bg-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
                fontWeight: 800,
                fontSize: '0.8rem',
                fontFamily: 'var(--font-heading)',
              }}
            >
              NS
            </div>
            <span>
              NeoStore Platform · Spring Boot 3.x & Neon PostgreSQL
            </span>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#" style={{ transition: 'color 0.15s ease' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>
              Chính sách bảo hành
            </a>
            <a href="#" style={{ transition: 'color 0.15s ease' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>
              Giao hàng & Đổi trả
            </a>
            <a href="#" style={{ transition: 'color 0.15s ease' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>
              Hỗ trợ kỹ thuật
            </a>
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

      <PaymentResultModal
        isOpen={!!paymentResult}
        result={paymentResult}
        onClose={() => setPaymentResult(null)}
      />

      {/* Global Toast Alert */}
      {toastMessage && (
        <div className="toast-alert">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="var(--accent-primary)">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
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
