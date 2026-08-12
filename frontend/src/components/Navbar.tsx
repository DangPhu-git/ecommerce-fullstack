import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  onOpenAdmin: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  activeView: 'home' | 'orders' | 'admin';
  setActiveView: (view: 'home' | 'orders' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenCart,
  onOpenOrders,
  onOpenAdmin,
  searchTerm,
  onSearchChange,
  activeView,
  setActiveView,
}) => {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();

  return (
    <nav className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 900, padding: '14px 0' }}>
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
        {/* Brand Logo */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => setActiveView('home')}
        >
          <div style={{
            width: '42px', height: '42px', borderRadius: '12px',
            background: 'var(--accent-gradient)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontWeight: '800',
            fontSize: '1.4rem', color: '#fff', boxShadow: 'var(--shadow-glow)'
          }}>
            E
          </div>
          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: '800', fontFamily: 'var(--font-display)', letterSpacing: '-0.5px' }} className="gradient-text">
              NeoStore
            </span>
            <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '-4px', fontWeight: '600' }}>
              CLOUD POWERED
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ flex: 1, maxWidth: '480px', position: 'relative' }}>
          <input
            type="text"
            className="form-input"
            placeholder="🔍 Tìm kiếm sản phẩm công nghệ, thời trang..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ borderRadius: 'var(--radius-full)', paddingLeft: '44px', background: 'rgba(15, 23, 42, 0.6)' }}
          />
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Navigation Links */}
          <button
            className={`btn ${activeView === 'home' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '8px 16px', fontSize: '0.88rem' }}
            onClick={() => setActiveView('home')}
          >
            🏠 Trang Chủ
          </button>

          {user && (
            <button
              className={`btn ${activeView === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)', padding: '8px 16px', fontSize: '0.88rem' }}
              onClick={() => {
                setActiveView('orders');
                onOpenOrders();
              }}
            >
              📦 Đơn Hàng
            </button>
          )}

          {isAdmin && (
            <button
              className={`btn ${activeView === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)', padding: '8px 16px', fontSize: '0.88rem' }}
              onClick={() => {
                setActiveView('admin');
                onOpenAdmin();
              }}
            >
              ⚡ Quản Trị
            </button>
          )}

          {/* Cart Button */}
          <button
            className="btn btn-secondary"
            style={{ position: 'relative', borderRadius: 'var(--radius-full)', padding: '8px 16px' }}
            onClick={onOpenCart}
          >
            🛒 Giỏ Hàng
            {itemCount > 0 && (
              <span className="badge badge-primary" style={{
                position: 'absolute', top: '-6px', right: '-6px',
                padding: '2px 8px', fontSize: '0.72rem', background: '#ec4899', color: 'white'
              }}>
                {itemCount}
              </span>
            )}
          </button>

          {/* User Account */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-main)' }}>{user.fullName || user.username}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{isAdmin ? 'Quản trị viên' : 'Khách hàng'}</div>
              </div>
              <button
                className="btn btn-danger"
                style={{ borderRadius: 'var(--radius-full)', padding: '6px 12px', fontSize: '0.8rem' }}
                onClick={logout}
              >
                Đăng Xuất
              </button>
            </div>
          ) : (
            <button
              className="btn btn-primary"
              style={{ borderRadius: 'var(--radius-full)', padding: '8px 20px' }}
              onClick={onOpenAuth}
            >
              🔑 Đăng Nhập
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
