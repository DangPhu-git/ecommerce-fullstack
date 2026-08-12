import React from 'react';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart } = useCart();

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="product-card">
      <div className="product-image-box" onClick={() => onSelect(product)} style={{ cursor: 'pointer' }}>
        <img src={product.imageUrl || 'https://via.placeholder.com/300'} alt={product.name} />

        {/* Badges */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {discountPercent > 0 && (
            <span className="badge badge-primary" style={{ background: '#ec4899', color: 'white' }}>
              -{discountPercent}%
            </span>
          )}
          {product.isFeatured && (
            <span className="badge badge-success">🔥 HOT</span>
          )}
        </div>
      </div>

      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          {product.category && (
            <span style={{ fontSize: '0.75rem', color: 'var(--primary-500)', fontWeight: '700', textTransform: 'uppercase' }}>
              {product.category.name}
            </span>
          )}
          <h3
            style={{ fontSize: '1.05rem', margin: '6px 0 10px 0', cursor: 'pointer', lineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
            onClick={() => onSelect(product)}
          >
            {product.name}
          </h3>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)' }}>
              {formatVND(product.discountPrice || product.price)}
            </span>
            {product.discountPrice && (
              <span style={{ fontSize: '0.88rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                {formatVND(product.price)}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn btn-primary"
              style={{ flex: 1, borderRadius: 'var(--radius-sm)', padding: '8px 12px', fontSize: '0.85rem' }}
              onClick={() => addToCart(product.id, 1)}
            >
              🛒 Thêm Vào Giỏ
            </button>
            <button
              className="btn btn-secondary"
              style={{ borderRadius: 'var(--radius-sm)', padding: '8px 12px', fontSize: '0.85rem' }}
              onClick={() => onSelect(product)}
            >
              👁️ Xem
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
