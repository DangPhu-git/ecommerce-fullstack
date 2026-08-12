import React from 'react';

export const Hero: React.FC = () => {
  return (
    <div style={{
      margin: '28px 0',
      padding: '48px 40px',
      borderRadius: 'var(--radius-lg)',
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
      border: '1px solid var(--border-glass)',
      boxShadow: 'var(--shadow-lg)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '30px'
    }}>
      {/* Glow Effect */}
      <div style={{
        position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px',
        background: 'var(--accent-glow)', borderRadius: '50%', pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '640px', zIndex: 1 }}>
        <span className="badge badge-primary" style={{ marginBottom: '16px', display: 'inline-block' }}>
          🚀 Công Nghệ Cloud Neon PostgreSQL
        </span>
        <h1 style={{ fontSize: '2.8rem', lineHeight: '1.2', marginBottom: '16px' }}>
          Trải Nghiệm Mua Sắm <br />
          <span className="gradient-text">Hiện Đại & Đẳng Cấp</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '28px', lineHeight: '1.6' }}>
          Khám phá những sản phẩm công nghệ đỉnh cao, thời trang cao cấp và thiết bị gia dụng thông minh với ưu đãi giảm giá tốt nhất cùng dịch vụ giao hàng siêu tốc.
        </p>
        <div style={{ display: 'flex', gap: '16px' }}>
          <a href="#products-section" className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)', padding: '12px 28px' }}>
            🛒 Khám Phá Ngay
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <span>✅ Bảo hành chính hãng</span>
            <span>•</span>
            <span>🚚 Miễn phí vận chuyển</span>
          </div>
        </div>
      </div>

      <div style={{ zIndex: 1, display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <img
          src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=80"
          alt="Featured Product"
          style={{ width: '220px', height: '260px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', boxShadow: 'var(--shadow-md)' }}
        />
        <img
          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80"
          alt="Featured Headphones"
          style={{ width: '220px', height: '260px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', boxShadow: 'var(--shadow-md)', marginTop: '24px' }}
        />
      </div>
    </div>
  );
};
