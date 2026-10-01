import React from 'react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onOpenCheckout }) => {
  const { cart, totalPrice, updateQuantity, removeItem, itemCount } = useCart();

  if (!isOpen) return null;

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="drawer-container"
        style={{ padding: '24px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Giỏ hàng
            </h2>
            <span className="badge badge-neutral">
              {itemCount} món
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Đóng giỏ hàng"
            style={{
              width: '30px',
              height: '30px',
              borderRadius: 'var(--radius-xs)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Cart Items List */}
        {!cart?.items || cart.items.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: 'var(--text-muted)',
              padding: '24px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
                color: 'var(--text-dim)',
              }}
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Giỏ hàng chưa có sản phẩm
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', maxWidth: '240px', marginBottom: '20px' }}>
              Khám phá các thiết bị công nghệ chọn lọc và thêm vào giỏ hàng của bạn.
            </p>
            <button
              className="btn btn-secondary"
              style={{ fontSize: '0.84rem', padding: '8px 16px' }}
              onClick={onClose}
            >
              Xem danh mục sản phẩm
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                paddingRight: '4px',
              }}
            >
              {cart.items.map((item) => {
                const price = item.product.discountPrice || item.product.price;
                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center',
                      background: 'var(--bg-card)',
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <img
                      src={item.product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
                      alt={item.product.name}
                      style={{
                        width: '58px',
                        height: '58px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-xs)',
                        border: '1px solid var(--border-subtle)',
                        background: '#0d121c',
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4
                        style={{
                          fontSize: '0.86rem',
                          fontWeight: 600,
                          marginBottom: '4px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {item.product.name}
                      </h4>
                      <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                        {formatVND(price)}
                      </div>
                    </div>

                    {/* Stepper */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'var(--bg-subtle)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-xs)',
                      }}
                    >
                      <button
                        style={{ padding: '3px 8px', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Giảm số lượng"
                      >
                        −
                      </button>
                      <span style={{ fontWeight: 600, fontSize: '0.82rem', minWidth: '18px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        style={{ padding: '3px 8px', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Tăng số lượng"
                      >
                        +
                      </button>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        color: 'var(--text-muted)',
                        padding: '4px',
                        transition: 'color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                      title="Xóa sản phẩm"
                    >
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer Summary & Checkout */}
            <div
              style={{
                marginTop: '16px',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Tổng cộng:</span>
                <span
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  {formatVND(totalPrice)}
                </span>
              </div>

              <button
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '13px',
                  fontSize: '0.92rem',
                }}
                onClick={() => {
                  onClose();
                  onOpenCheckout();
                }}
              >
                Tiến hành thanh toán
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
