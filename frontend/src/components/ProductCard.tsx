import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart } = useCart();
  const [isLiked, setIsLiked] = useState(false);

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <article className="product-card">
      {/* Image Stage */}
      <div className="product-image-box" onClick={() => onSelect(product)} style={{ cursor: 'pointer' }}>
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
          alt={product.name}
          loading="lazy"
        />

        {/* Badges */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 2 }}>
          {discountPercent > 0 && (
            <span className="badge badge-sale">
              Giảm {discountPercent}%
            </span>
          )}
          {product.isFeatured && (
            <span className="badge badge-accent">
              Tuyển chọn
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          aria-label={isLiked ? 'Bỏ thích sản phẩm' : 'Thích sản phẩm'}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-xs)',
            background: 'rgba(10, 13, 20, 0.7)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isLiked ? '#ef4444' : 'var(--text-muted)',
            zIndex: 2,
            transition: 'color 0.2s ease, background 0.2s ease',
          }}
        >
          <svg width="16" height="16" fill={isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(10, 13, 20, 0.75)',
              backdropFilter: 'blur(2px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.85rem',
              letterSpacing: '0.04em',
            }}
          >
            Tạm hết hàng
          </div>
        )}
      </div>

      {/* Product Info & Actions */}
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          {product.category && (
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px' }}>
              {product.category.name}
            </div>
          )}

          <h3
            style={{
              fontSize: '0.98rem',
              fontWeight: 600,
              lineHeight: '1.4',
              marginBottom: '10px',
              cursor: 'pointer',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.8rem',
              color: 'var(--text-primary)',
            }}
            onClick={() => onSelect(product)}
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        <div>
          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
            <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
              {formatVND(product.discountPrice || product.price)}
            </span>
            {product.discountPrice && (
              <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                {formatVND(product.price)}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn btn-primary"
              style={{
                flex: 1,
                padding: '9px 12px',
                fontSize: '0.84rem',
                gap: '6px',
              }}
              onClick={() => addToCart(product.id, 1)}
              disabled={isOutOfStock}
            >
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Thêm vào giỏ</span>
            </button>
            <button
              className="btn btn-secondary"
              style={{
                padding: '9px 12px',
                fontSize: '0.84rem',
              }}
              onClick={() => onSelect(product)}
              title="Xem thông tin chi tiết"
            >
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
