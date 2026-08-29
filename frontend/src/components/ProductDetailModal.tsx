import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [qty, setQty] = useState<number>(1);

  if (!product) return null;

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '840px', padding: '36px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '36px', alignItems: 'start' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '18px', right: '18px', width: '36px', height: '36px',
            borderRadius: '50%', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid var(--border-glass)',
            color: 'var(--text-muted)', fontSize: '1.1rem', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', zIndex: 10
          }}
        >
          ✕
        </button>

        {/* Product Image Gallery Box */}
        <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-glass)', background: '#090d16' }}>
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
            alt={product.name}
            style={{ width: '100%', height: '380px', objectFit: 'cover' }}
          />

          {discountPercent > 0 && (
            <span className="badge badge-sale" style={{ position: 'absolute', top: '16px', left: '16px' }}>
              🔥 TIẾT KIỆM {discountPercent}%
            </span>
          )}
        </div>

        {/* Product Information & Purchase Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
          <div>
            {product.category && (
              <span className="badge badge-primary" style={{ marginBottom: '12px' }}>
                📁 {product.category.name}
              </span>
            )}

            <h2 style={{ fontSize: '1.75rem', lineHeight: '1.3', marginBottom: '14px', fontWeight: '800' }}>
              {product.name}
            </h2>

            {/* Price section */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px', padding: '14px 18px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-glass)' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)' }}>
                {formatVND(product.discountPrice || product.price)}
              </span>
              {product.discountPrice && (
                <span style={{ fontSize: '1.05rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                  {formatVND(product.price)}
                </span>
              )}
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: '1.6', marginBottom: '24px' }}>
              {product.description || 'Sản phẩm chính hãng với bảo hành đầy đủ, cam kết chất lượng tuyệt hảo và dịch vụ chăm sóc khách hàng chuyên nghiệp.'}
            </p>

            {/* Stock status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', fontSize: '0.92rem' }}>
              <span style={{ color: 'var(--text-dim)' }}>Tình trạng:</span>
              <span className={product.stockQuantity > 0 ? 'badge badge-success' : 'badge badge-hot'}>
                {product.stockQuantity > 0 ? `Còn hàng (${product.stockQuantity} sản phẩm)` : 'Tạm hết hàng'}
              </span>
            </div>
          </div>

          <div>
            {/* Quantity Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '20px' }}>
              <span style={{ fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Số lượng:</span>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)' }}>
                <button
                  style={{ padding: '8px 16px', background: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}
                  onClick={() => setQty(Math.max(1, qty - 1))}
                >
                  -
                </button>
                <span style={{ padding: '0 14px', fontWeight: '700', fontSize: '1rem', minWidth: '40px', textAlign: 'center' }}>
                  {qty}
                </span>
                <button
                  style={{ padding: '8px 16px', background: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}
                  onClick={() => setQty(qty + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '15px', borderRadius: 'var(--radius-md)', fontSize: '1.05rem', fontWeight: '700' }}
              onClick={() => {
                addToCart(product.id, qty);
                onClose();
              }}
              disabled={product.stockQuantity <= 0}
            >
              🛒 Thêm {qty} Sản Phẩm Vào Giỏ Hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
