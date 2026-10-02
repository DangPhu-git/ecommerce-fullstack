import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { totalPrice, fetchCart } = useCart();

  const [recipientName, setRecipientName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'VNPAY'>('COD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress || !phone || !recipientName) {
      setError('Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const order = await api.checkout({
        recipientName,
        phone,
        shippingAddress,
        note,
        paymentMethod,
      });
      await fetchCart();

      // Nếu chọn VNPay, tạo URL và redirect sang cổng thanh toán
      if (paymentMethod === 'VNPAY') {
        const vnpayRes = await api.createVNPayUrl(order.id);
        if (vnpayRes && vnpayRes.paymentUrl) {
          window.location.href = vnpayRes.paymentUrl;
          return;
        }
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '640px', padding: '32px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '16px',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Thông tin đặt hàng & thanh toán
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Kiểm tra thông tin giao nhận trước khi xác nhận đơn hàng
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng cửa sổ"
            style={{
              width: '30px',
              height: '30px',
              borderRadius: 'var(--radius-xs)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {error && (
          <div
            style={{
              background: 'var(--color-danger-soft)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '18px',
              fontSize: '0.85rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Người nhận hàng *</label>
              <input
                type="text"
                className="form-input"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Họ và tên người nhận"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Số điện thoại *</label>
              <input
                type="text"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Số điện thoại liên lạc"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Địa chỉ nhận hàng *</label>
            <input
              type="text"
              className="form-input"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Số nhà, đường phố, phường/xã, quận/huyện, tỉnh/thành phố"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Ghi chú giao hàng (tùy chọn)</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Thời gian nhận hàng hoặc chỉ dẫn cho shipper..."
            />
          </div>

          {/* Payment Method Cards */}
          <div className="form-group">
            <label className="form-label">Phương thức thanh toán</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px' }}>
              <div
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  border: paymentMethod === 'VNPAY' ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  background: paymentMethod === 'VNPAY' ? 'var(--accent-soft)' : 'var(--bg-subtle)',
                  transition: 'all 0.15s ease',
                }}
                onClick={() => setPaymentMethod('VNPAY')}
              >
                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: paymentMethod === 'VNPAY' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  💳 VNPAY Sandbox
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  ATM / QR / Visa trực tuyến
                </div>
              </div>

              <div
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  border: paymentMethod === 'COD' ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  background: paymentMethod === 'COD' ? 'var(--accent-soft)' : 'var(--bg-subtle)',
                  transition: 'all 0.15s ease',
                }}
                onClick={() => setPaymentMethod('COD')}
              >
                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: paymentMethod === 'COD' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  💵 Khi nhận (COD)
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Tiền mặt khi giao hàng
                </div>
              </div>

              <div
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  border: paymentMethod === 'BANK_TRANSFER' ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  background: paymentMethod === 'BANK_TRANSFER' ? 'var(--accent-soft)' : 'var(--bg-subtle)',
                  transition: 'all 0.15s ease',
                }}
                onClick={() => setPaymentMethod('BANK_TRANSFER')}
              >
                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: paymentMethod === 'BANK_TRANSFER' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  🏦 Chuyển khoản QR
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Xác nhận tự động 24/7
                </div>
              </div>
            </div>
          </div>

          {/* Total & Submit */}
          <div
            style={{
              marginTop: '24px',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
            }}
          >
            <div>
              <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Tổng thanh toán:</span>
              <div
                style={{
                  fontSize: '1.45rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {formatVND(totalPrice)}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ padding: '12px 28px', fontSize: '0.92rem' }}
            >
              {loading ? 'Đang xử lý đơn hàng...' : 'Xác nhận đặt hàng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
