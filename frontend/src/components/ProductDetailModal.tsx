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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '780px', display: 'flex', gap: '30px', flexWrap: 'wrap' }} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.4rem', cursor: 'pointer' }}
        >
          ✕
        </button>

        {/* Product Image */}
        <div style={{ flex: '1 1 300px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
          <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '340px', objectFit: 'cover' }} />
        </div>

        {/* Product Details */}
        <div style={{ flex: '1 1 360px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {product.category && (
              <span className="badge badge-primary" style={{ marginBottom: '8px' }}>
                {product.category.name}
              </span>
            )}
            <h2 style={{ fontSize: '1.6rem', marginBottom: '12px' }}>{product.name}</h2>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary-500)' }}>
                {formatVND(product.discountPrice || product.price)}
              </span>
              {product.discountPrice && (
                <span style={{ fontSize: '1.05rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                  {formatVND(product.price)}
                </span>
              )}
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px' }}>
              {product.description || 'Sản phẩm chính hãng cao cấp, đầy đủ chứng nhận và bảo hành chính hãng.'}
            </p>

            <div style={{ marginBottom: '20px', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
              Tình trạng: <strong style={{ color: product.stockQuantity > 0 ? 'var(--success)' : 'var(--danger)' }}>
                {product.stockQuantity > 0 ? `Còn hàng (${product.stockQuantity} sản phẩm)` : 'Hết hàng'}
              </strong>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <span style={{ fontWeight: '600', color: 'var(--text-muted)' }}>Số lượng:</span>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)' }}>
                <button
                  style={{ padding: '6px 14px', background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.1rem' }}
                  onClick={() => setQty(Math.max(1, qty - 1))}
                >
                  -
                </button>
                <span style={{ padding: '0 12px', fontWeight: '700' }}>{qty}</span>
                <button
                  style={{ padding: '6px 14px', background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.1rem' }}
                  onClick={() => setQty(qty + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', fontSize: '1.05rem' }}
              onClick={() => {
                addToCart(product.id, qty);
                onClose();
              }}
            >
              🛒 Thêm {qty} Sản Phẩm Vào Giỏ Hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
