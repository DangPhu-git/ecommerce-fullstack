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
        className="modal-content"
        style={{ maxWidth: '540px', width: '100%', borderRadius: 'var(--radius-lg)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
          <h2 style={{ fontSize: '1.4rem' }}>🛒 Giỏ Hàng Của Bạn</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
        </div>

        {!cart?.items || cart.items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🛍️</div>
            <p style={{ fontSize: '1.05rem' }}>Giỏ hàng của bạn đang trống!</p>
          </div>
        ) : (
          <>
            <div style={{ maxHeight: '360px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '6px' }}>
              {cart.items.map((item) => {
                const price = item.product.discountPrice || item.product.price;
                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex', gap: '14px', alignItems: 'center', background: 'rgba(15, 23, 42, 0.6)',
                      padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)'
                    }}
                  >
                    <img src={item.product.imageUrl} alt={item.product.name} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.95rem', marginBottom: '4px' }}>{item.product.name}</h4>
                      <div style={{ fontSize: '0.9rem', color: 'var(--primary-500)', fontWeight: '700' }}>
                        {formatVND(price)}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '2px 8px' }}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{item.quantity}</span>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '2px 8px' }}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.1rem', marginLeft: '8px' }}
                    >
                      🗑️
                    </button>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-glass)', paddingTop: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Tổng Tiền:</span>
                <span style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary-500)' }}>
                  {formatVND(totalPrice)}
                </span>
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', fontSize: '1.05rem' }}
                onClick={() => {
                  onClose();
                  onOpenCheckout();
                }}
              >
                💳 Tiến Hành Thanh Toán
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
