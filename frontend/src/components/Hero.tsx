import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section
      style={{
        margin: '28px 0 44px 0',
        padding: '48px 40px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.15fr 0.85fr',
          gap: '48px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Left Editorial Copy */}
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px',
              borderRadius: 'var(--radius-xs)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '20px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--accent-primary)',
                display: 'inline-block',
              }}
            />
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                letterSpacing: '0.02em',
              }}
            >
              Bộ sưu tập công nghệ chọn lọc 2026
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
              lineHeight: '1.12',
              marginBottom: '20px',
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              color: 'var(--text-primary)',
              letterSpacing: '-0.035em',
            }}
          >
            Thiết bị chuẩn xác cho không gian làm việc hiện đại
          </h1>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1.05rem',
              lineHeight: '1.65',
              marginBottom: '32px',
              maxWidth: '540px',
            }}
          >
            Tuyển chọn âm thanh phòng thu, bàn phím cơ khí và phụ kiện máy tính hoàn thiện tinh xảo. Vận hành trên hạ tầng đám mây đồng bộ tức thì.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
            <a
              href="#products-section"
              className="btn btn-primary"
              style={{ padding: '12px 28px', fontSize: '0.92rem' }}
            >
              Xem danh mục sản phẩm
            </a>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Bảo hành 1 đổi 1 trong 30 ngày
            </span>
          </div>

          {/* Precision Spec Pillars */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              marginTop: '40px',
              paddingTop: '24px',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '2px' }}>
                Giao hàng 2H
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Nội thành Hà Nội & TP.HCM
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '2px' }}>
                100% Chính hãng
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                CO/CQ và hóa đơn VAT đầy đủ
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '2px' }}>
                Kỹ thuật viên 24/7
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Hỗ trợ cấu hình tận nơi
              </div>
            </div>
          </div>
        </div>

        {/* Right Studio Showcase Card */}
        <div style={{ position: 'relative' }}>
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-card-hover)',
            }}
          >
            {/* Image Stage */}
            <div style={{ position: 'relative', height: '340px', background: '#080a0f', overflow: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                alt="Studio High-Fidelity Headphones"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'contrast(1.05)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  display: 'flex',
                  gap: '8px',
                }}
              >
                <span className="badge badge-accent">Tiêu điểm tháng</span>
              </div>
            </div>

            {/* Spec Footnote */}
            <div
              style={{
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--bg-subtle)',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Tai nghe Studio Monitor Pro
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Driver Planar Magnetic 50mm · Khử ồn chủ động
                </p>
              </div>
              <a
                href="#products-section"
                className="btn btn-secondary"
                style={{ fontSize: '0.82rem', padding: '8px 14px' }}
              >
                Chi tiết
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
