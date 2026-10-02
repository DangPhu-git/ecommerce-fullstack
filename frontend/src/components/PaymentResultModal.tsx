import React from 'react';

interface PaymentResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: {
    status: 'SUCCESS' | 'FAILED' | 'INVALID_SIGNATURE';
    message: string;
    orderNumber: string;
    amount?: number;
  } | null;
}

export const PaymentResultModal: React.FC<PaymentResultModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  if (!isOpen || !result) return null;

  const isSuccess = result.status === 'SUCCESS';

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '480px', padding: '32px', textAlign: 'center' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: isSuccess ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: isSuccess ? '#22c55e' : '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '2rem',
          }}
        >
          {isSuccess ? '✓' : '✕'}
        </div>

        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán không thành công'}
        </h2>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          {result.message}
        </p>

        <div
          style={{
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '16px',
            marginBottom: '24px',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Mã đơn hàng:</span>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{result.orderNumber}</span>
          </div>
          {result.amount !== undefined && result.amount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Số tiền:</span>
              <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{formatVND(result.amount)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Cổng thanh toán:</span>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>VNPAY Sandbox</span>
          </div>
        </div>

        <button
          className="btn btn-primary"
          style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
          onClick={onClose}
        >
          {isSuccess ? 'Xem đơn hàng của tôi' : 'Đóng'}
        </button>
      </div>
    </div>
  );
};
