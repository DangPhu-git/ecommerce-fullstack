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

  return (
    <div className="product-card">
      <div className="product-image-box" onClick={() => onSelect(product)} style={{ cursor: 'pointer' }}>
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
          alt={product.name}
          loading="lazy"
        />

        {/* Floating Badges */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 2 }}>
          {discountPercent > 0 && (
            <span className="badge badge-sale">
              🔥 -{discountPercent}%
            </span>
          )}
          {product.isFeatured && (
            <span className="badge badge-hot">
              ⚡ NỔI BẬT
            </span>
          )}
        </div>

        {/* Wishlist Floating Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          style={{
            position: 'absolute', top: '12px', right: '12px', width: '36px', height: '36px',
            borderRadius: '50%', background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.15)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', zIndex: 2, transition: 'transform 0.2s ease',
            color: isLiked ? '#ec4899' : 'var(--text-muted)'
          }}
        >
          {isLiked ? '❤️' : '🤍'}
        </button>

        {/* Stock status overlay when out of stock */}
        {product.stockQuantity <= 0 && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#f87171', fontWeight: '800', fontSize: '1rem', letterSpacing: '0.05em'
          }}>
            TẠM HẾT HÀNG
          </div>
        )}
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          {product.category && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary-400)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {product.category.name}
              </span>
            </div>
          )}

          <h3
            style={{
              fontSize: '1.05rem', fontWeight: '700', lineHeight: '1.4', marginBottom: '12px',
              cursor: 'pointer', display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.8rem'
            }}
            onClick={() => onSelect(product)}
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        <div>
          {/* Price Section */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
              {formatVND(product.discountPrice || product.price)}
            </span>
            {product.discountPrice && (
              <span style={{ fontSize: '0.88rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                {formatVND(product.price)}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn btn-primary"
              style={{ flex: 1, borderRadius: 'var(--radius-sm)', padding: '10px', fontSize: '0.88rem' }}
              onClick={() => addToCart(product.id, 1)}
              disabled={product.stockQuantity <= 0}
            >
              🛒 Thêm Vào Giỏ
            </button>
            <button
              className="btn btn-secondary"
              style={{ borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: '0.88rem' }}
              onClick={() => onSelect(product)}
              title="Xem chi tiết"
            >
              👁️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
