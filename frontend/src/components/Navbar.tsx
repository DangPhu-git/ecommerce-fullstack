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
    <nav className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 900, padding: '16px 0' }}>
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
        {/* Brand Logo with Glow */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', userSelect: 'none' }}
          onClick={() => setActiveView('home')}
        >
          <div style={{
            width: '44px', height: '44px', borderRadius: '14px',
            background: 'var(--accent-gradient)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontWeight: '900',
            fontSize: '1.45rem', color: '#fff', boxShadow: 'var(--shadow-glow)',
            transform: 'rotate(-4deg)', transition: 'transform 0.3s ease'
          }}>
            ⚡
          </div>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }} className="gradient-text">
              NeoStore
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.68rem', color: 'var(--text-dim)', letterSpacing: '0.08em', fontWeight: '700' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-emerald)', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
              CLOUD POWERED
            </span>
          </div>
        </div>

        {/* Dynamic Search Bar */}
        <div style={{ flex: 1, maxWidth: '520px', position: 'relative' }}>
          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem', color: 'var(--text-dim)', pointerEvents: 'none' }}>
            🔍
          </span>
          <input
            type="text"
            className="form-input"
            placeholder="Tìm kiếm điện thoại, laptop, thời trang, phụ kiện..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              borderRadius: 'var(--radius-full)',
              paddingLeft: '46px',
              paddingRight: searchTerm ? '40px' : '16px',
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.92rem'
            }}
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              style={{
                position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '0.9rem'
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Action Controls & Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Navigation Pill Links */}
          <button
            className={`btn ${activeView === 'home' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '9px 18px', fontSize: '0.9rem' }}
            onClick={() => setActiveView('home')}
          >
            🏠 Khám Phá
          </button>

          {user && (
            <button
              className={`btn ${activeView === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)', padding: '9px 18px', fontSize: '0.9rem' }}
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
              style={{
                borderRadius: 'var(--radius-full)', padding: '9px 18px', fontSize: '0.9rem',
                border: activeView === 'admin' ? 'none' : '1px solid rgba(245, 158, 11, 0.4)',
                color: activeView === 'admin' ? '#fff' : '#f59e0b'
              }}
              onClick={() => {
                setActiveView('admin');
                onOpenAdmin();
              }}
            >
              ⚡ Quản Trị
            </button>
          )}

          {/* Cart Trigger */}
          <button
            className="btn btn-secondary"
            style={{ position: 'relative', borderRadius: 'var(--radius-full)', padding: '9px 18px' }}
            onClick={onOpenCart}
          >
            🛒 Giỏ Hàng
            {itemCount > 0 && (
              <span className="badge badge-sale" style={{
                position: 'absolute', top: '-6px', right: '-6px',
                padding: '2px 8px', fontSize: '0.72rem', fontWeight: '800'
              }}>
                {itemCount}
              </span>
            )}
          </button>

          {/* User Profile or Login */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255, 255, 255, 0.04)', padding: '4px 6px 4px 14px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-glass)' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-main)', lineHeight: 1.2 }}>
                  {user.fullName || user.username}
                </div>
                <div style={{ fontSize: '0.72rem', color: isAdmin ? 'var(--warning)' : 'var(--text-dim)', fontWeight: '600' }}>
                  {isAdmin ? '🛡️ Administrator' : '💎 Khách hàng VIP'}
                </div>
              </div>
              <button
                className="btn btn-danger"
                style={{ borderRadius: 'var(--radius-full)', padding: '6px 14px', fontSize: '0.8rem' }}
                onClick={logout}
              >
                Đăng Xuất
              </button>
            </div>
          ) : (
            <button
              className="btn btn-primary"
              style={{ borderRadius: 'var(--radius-full)', padding: '9px 22px' }}
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
