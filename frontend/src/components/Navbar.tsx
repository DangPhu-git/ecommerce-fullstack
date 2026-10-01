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
    <header className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 900 }}>
      <div
        className="app-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '68px',
          gap: '24px',
        }}
      >
        {/* Brand Identity */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', userSelect: 'none' }}
          onClick={() => setActiveView('home')}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-medium)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)',
              fontWeight: 800,
              fontSize: '1rem',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.05em',
            }}
          >
            NS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                fontFamily: 'var(--font-heading)',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: 'var(--text-primary)',
              }}
            >
              NeoStore
            </span>
            <span
              style={{
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                fontWeight: 500,
                letterSpacing: '0.04em',
              }}
            >
              Hardware & Tech
            </span>
          </div>
        </div>

        {/* Command Search Bar */}
        <div style={{ flex: 1, maxWidth: '440px', position: 'relative' }}>
          <svg
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '16px',
              height: '16px',
              color: 'var(--text-dim)',
              pointerEvents: 'none',
            }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            className="form-input"
            placeholder="Tìm kiếm thiết bị, thông số, phụ kiện..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              paddingLeft: '40px',
              paddingRight: searchTerm ? '38px' : '14px',
              fontSize: '0.88rem',
              height: '40px',
              borderRadius: 'var(--radius-sm)',
            }}
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                padding: '4px',
              }}
              aria-label="Xóa từ khóa"
            >
              ✕
            </button>
          )}
        </div>

        {/* Nav Views & User Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* View switcher */}
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-subtle)',
              padding: '3px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <button
              className="btn"
              style={{
                padding: '6px 14px',
                fontSize: '0.82rem',
                borderRadius: 'var(--radius-xs)',
                background: activeView === 'home' ? 'var(--bg-surface)' : 'transparent',
                color: activeView === 'home' ? 'var(--text-primary)' : 'var(--text-muted)',
                boxShadow: activeView === 'home' ? 'var(--shadow-sm)' : 'none',
              }}
              onClick={() => setActiveView('home')}
            >
              Cửa hàng
            </button>

            <button
              className="btn"
              style={{
                padding: '6px 14px',
                fontSize: '0.82rem',
                borderRadius: 'var(--radius-xs)',
                background: activeView === 'orders' ? 'var(--bg-surface)' : 'transparent',
                color: activeView === 'orders' ? 'var(--text-primary)' : 'var(--text-muted)',
                boxShadow: activeView === 'orders' ? 'var(--shadow-sm)' : 'none',
              }}
              onClick={() => {
                setActiveView('orders');
                onOpenOrders();
              }}
            >
              Đơn hàng
            </button>

            {isAdmin && (
              <button
                className="btn"
                style={{
                  padding: '6px 14px',
                  fontSize: '0.82rem',
                  borderRadius: 'var(--radius-xs)',
                  background: activeView === 'admin' ? 'var(--accent-primary)' : 'transparent',
                  color: activeView === 'admin' ? '#0a0d14' : 'var(--accent-primary)',
                  fontWeight: 700,
                }}
                onClick={() => {
                  setActiveView('admin');
                  onOpenAdmin();
                }}
              >
                Quản trị
              </button>
            )}
          </div>

          {/* Cart Trigger */}
          <button
            className="btn btn-secondary"
            style={{
              position: 'relative',
              height: '38px',
              padding: '0 14px',
              gap: '6px',
            }}
            onClick={onOpenCart}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span style={{ fontSize: '0.84rem' }}>Giỏ hàng</span>
            {itemCount > 0 && (
              <span
                style={{
                  background: 'var(--accent-primary)',
                  color: '#0a0d14',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  borderRadius: 'var(--radius-pill)',
                  padding: '1px 6px',
                  minWidth: '18px',
                  textAlign: 'center',
                }}
              >
                {itemCount}
              </span>
            )}
          </button>

          {/* User Profile or Login */}
          {user ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '4px 6px 4px 12px',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {user.fullName || user.username}
                </div>
                <div style={{ fontSize: '0.68rem', color: isAdmin ? 'var(--accent-primary)' : 'var(--text-dim)' }}>
                  {isAdmin ? 'Quản trị viên' : 'Thành viên'}
                </div>
              </div>
              <button
                className="btn btn-ghost"
                style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                onClick={logout}
              >
                Thoát
              </button>
            </div>
          ) : (
            <button
              className="btn btn-primary"
              style={{ height: '38px', padding: '0 16px', fontSize: '0.86rem' }}
              onClick={onOpenAuth}
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
