import React from 'react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onOpenCheckout }) => {
  const { cart, totalPrice, updateQuantity, removeItem } = useCart();

  if (!isOpen) return null;

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="drawer-container"
        style={{ padding: '28px 24px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.4rem' }}>🛒</span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Giỏ Hàng Của Bạn</h2>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-glass)', color: 'var(--text-muted)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>

        {/* Content list */}
        {!cart?.items || cart.items.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '16px', filter: 'grayscale(0.5)' }}>🛍️</div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Giỏ hàng chưa có sản phẩm nào!</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)' }}>Hãy chọn thêm các mặt hàng yêu thích của bạn nhé.</p>
          </div>
        ) : (
          <>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', paddingRight: '4px' }}>
              {cart.items.map((item) => {
                const price = item.product.discountPrice || item.product.price;
                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex', gap: '14px', alignItems: 'center', background: 'rgba(19, 27, 46, 0.7)',
                      padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)'
                    }}
                  >
                    <img
                      src={item.product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
                      alt={item.product.name}
                      style={{ width: '68px', height: '68px', objectFit: 'cover', borderRadius: 'var(--radius-xs)', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: '700', marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.product.name}
                      </h4>
                      <div style={{ fontSize: '0.92rem', color: 'var(--text-main)', fontWeight: '800' }}>
                        {formatVND(price)}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(11, 15, 25, 0.8)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-xs)', padding: '2px' }}>
                      <button
                        style={{ padding: '3px 8px', background: 'none', color: 'white', cursor: 'pointer', fontSize: '0.9rem' }}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span style={{ fontWeight: '700', fontSize: '0.88rem', minWidth: '20px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        style={{ padding: '3px 8px', background: 'none', color: 'white', cursor: 'pointer', fontSize: '0.9rem' }}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '1rem', padding: '4px', transition: 'color 0.2s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-dim)')}
                      title="Xóa khỏi giỏ hàng"
                    >
                      🗑️
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer Summary & Checkout */}
            <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-glass)', paddingTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Tổng cộng:</span>
                <span style={{ fontSize: '1.65rem', fontWeight: '900', color: 'var(--text-main)' }}>
                  {formatVND(totalPrice)}
                </span>
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', fontSize: '1.05rem', fontWeight: '700' }}
                onClick={() => {
                  onClose();
                  onOpenCheckout();
                }}
              >
                💳 Tiến Hành Đặt Hàng
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
