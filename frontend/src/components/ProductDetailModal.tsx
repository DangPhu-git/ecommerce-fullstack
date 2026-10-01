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

  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{
          maxWidth: '800px',
          padding: '32px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '36px',
          alignItems: 'start',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Đóng cửa sổ"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-xs)',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          ✕
        </button>

        {/* Product Image Stage */}
        <div
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)',
            background: '#090d16',
          }}
        >
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
            alt={product.name}
            style={{ width: '100%', height: '360px', objectFit: 'cover' }}
          />

          {discountPercent > 0 && (
            <span
              className="badge badge-sale"
              style={{ position: 'absolute', top: '14px', left: '14px' }}
            >
              Tiết kiệm {discountPercent}%
            </span>
          )}
        </div>

        {/* Product Information */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '360px' }}>
          <div>
            {product.category && (
              <span className="badge badge-neutral" style={{ marginBottom: '10px' }}>
                {product.category.name}
              </span>
            )}

            <h2
              style={{
                fontSize: '1.45rem',
                lineHeight: '1.3',
                marginBottom: '12px',
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}
            >
              {product.name}
            </h2>

            {/* Price Box */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '10px',
                marginBottom: '16px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <span
                style={{
                  fontSize: '1.45rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {formatVND(product.discountPrice || product.price)}
              </span>
              {product.discountPrice && (
                <span style={{ fontSize: '0.95rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                  {formatVND(product.price)}
                </span>
              )}
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '20px' }}>
              {product.description || 'Sản phẩm chính hãng với bảo hành 12 tháng, chứng nhận nguồn gốc xuất xứ đầy đủ.'}
            </p>

            {/* Stock status indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '0.86rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Tình trạng:</span>
              <span className={product.stockQuantity > 0 ? 'badge badge-success' : 'badge badge-sale'}>
                {product.stockQuantity > 0 ? `Còn hàng trong kho (${product.stockQuantity})` : 'Tạm hết hàng'}
              </span>
            </div>
          </div>

          <div>
            {/* Quantity Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Số lượng:</span>
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
                  style={{
                    padding: '6px 14px',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                  }}
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  disabled={qty <= 1}
                  aria-label="Giảm số lượng"
                >
                  −
                </button>
                <span
                  style={{
                    padding: '0 12px',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    minWidth: '32px',
                    textAlign: 'center',
                  }}
                >
                  {qty}
                </span>
                <button
                  style={{
                    padding: '6px 14px',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                  }}
                  onClick={() => setQty(qty + 1)}
                  disabled={isOutOfStock || qty >= product.stockQuantity}
                  aria-label="Tăng số lượng"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart CTA */}
            <button
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '13px',
                fontSize: '0.92rem',
                gap: '8px',
              }}
              onClick={() => {
                addToCart(product.id, qty);
                onClose();
              }}
              disabled={isOutOfStock}
            >
              <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Thêm {qty} sản phẩm vào giỏ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
