import React from 'react';

export const Hero: React.FC = () => {
  return (
    <div style={{
      margin: '32px 0 40px 0',
      borderRadius: 'var(--radius-xl)',
      background: 'linear-gradient(135deg, rgba(19, 27, 46, 0.85) 0%, rgba(11, 15, 25, 0.95) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: 'var(--shadow-lg), 0 0 50px rgba(99, 102, 241, 0.15)',
      position: 'relative',
      overflow: 'hidden',
      padding: '52px 48px',
    }}>
      {/* Dynamic Ambient Glow Orbs */}
      <div style={{
        position: 'absolute', top: '-120px', right: '10%', width: '380px', height: '380px',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(236, 72, 153, 0.05) 60%, transparent 80%)',
        borderRadius: '50%', pointerEvents: 'none', filter: 'blur(30px)'
      }} />
      <div style={{
        position: 'absolute', bottom: '-100px', left: '5%', width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', filter: 'blur(25px)'
      }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px', alignItems: 'center', position: 'relative', zIndex: 2 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: 'var(--radius-full)', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', marginBottom: '20px' }}>
            <span style={{ fontSize: '0.9rem' }}>✨</span>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Next-Gen Cloud E-Commerce 2026
            </span>
          </div>

          <h1 style={{ fontSize: '3.2rem', lineHeight: '1.15', marginBottom: '18px', fontWeight: '800' }}>
            Khám Phá Công Nghệ <br />
            <span className="gradient-text">Đỉnh Cao & Đẳng Cấp</span>
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '32px', lineHeight: '1.7', maxWidth: '560px' }}>
            Trải nghiệm mua sắm siêu tốc được hỗ trợ bởi hệ sinh thái <strong>Spring Boot 3.x</strong> và cơ sở dữ liệu phân tán <strong>Neon PostgreSQL</strong>.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <a
              href="#products-section"
              className="btn btn-primary"
              style={{ borderRadius: 'var(--radius-full)', padding: '14px 34px', fontSize: '1.05rem', fontWeight: '700' }}
            >
              🔥 Khám Phá Bộ Sưu Tập
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              <span>⭐ Đánh giá 4.9/5 từ hơn 10.000+ khách hàng</span>
            </div>
          </div>

          {/* Value Propositions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '36px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>⚡</div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>Giao Siêu Tốc 2H</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Nội thành TP.HCM & HN</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🛡️</div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>Bảo Hành 100%</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Chính hãng & 1 Đổi 1</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>💳</div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>Trả Góp 0%</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Qua thẻ tín dụng / COD</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Featured Product Cards Mockup */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{
            position: 'relative', width: '280px', height: '340px',
            borderRadius: 'var(--radius-lg)', overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: 'var(--shadow-lg), 0 0 30px rgba(99, 102, 241, 0.25)',
            transform: 'rotate(-4deg)', transition: 'transform 0.4s ease'
          }}>
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
              alt="Wireless Headphones"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', bottom: 0, insetInline: 0, padding: '16px', background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95), transparent)' }}>
              <span className="badge badge-sale" style={{ marginBottom: '4px' }}>🔥 HOT DEAL</span>
              <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Âm Thanh Không Dây Cao Cấp</div>
            </div>
          </div>

          <div style={{
            position: 'absolute', right: '-10px', top: '30px', width: '220px', height: '280px',
            borderRadius: 'var(--radius-lg)', overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: 'var(--shadow-lg), 0 0 35px rgba(236, 72, 153, 0.3)',
            transform: 'rotate(6deg)', zIndex: 3
          }}>
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"
              alt="Smart Watch"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', bottom: 0, insetInline: 0, padding: '12px', background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95), transparent)' }}>
              <span className="badge badge-hot" style={{ marginBottom: '4px' }}>-25% GIẢM</span>
              <div style={{ fontWeight: '700', fontSize: '0.88rem' }}>Smartwatch Pro Series 9</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
