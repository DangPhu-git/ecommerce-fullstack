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
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BANK_TRANSFER' | 'CREDIT_CARD'>('COD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress || !phone || !recipientName) {
      setError('Vui lòng điền đầy đủ thông tin người nhận và địa chỉ giao hàng.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await api.checkout({
        recipientName,
        phone,
        shippingAddress,
        note,
        paymentMethod,
      });
      await fetchCart();
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Đặt hàng thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '680px', padding: '32px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>💳 Thông Tin Đặt Hàng & Thanh Toán</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '2px' }}>Giao hàng bảo đảm, bảo mật tuyệt đối</p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-glass)', color: 'var(--text-muted)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>

        {error && (
          <div style={{ background: 'var(--danger-bg)', border: '1px solid rgba(244,63,94,0.3)', color: '#fb7185', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '18px', fontSize: '0.88rem' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Họ và tên người nhận *</label>
              <input
                type="text"
                className="form-input"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Nguyễn Văn An"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Số điện thoại liên hệ *</label>
              <input
                type="text"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912 345 678"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Địa chỉ giao hàng cụ thể *</label>
            <input
              type="text"
              className="form-input"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Số nhà, tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Ghi chú cho đơn hàng</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Giao hàng vào giờ hành chính, gọi trước khi giao..."
            />
          </div>

          {/* Payment Method Cards */}
          <div className="form-group">
            <label className="form-label">Chọn phương thức thanh toán</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div
                style={{
                  padding: '16px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                  border: paymentMethod === 'COD' ? '2px solid var(--primary-500)' : '1px solid var(--border-glass)',
                  background: paymentMethod === 'COD' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                  transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '12px'
                }}
                onClick={() => setPaymentMethod('COD')}
              >
                <div style={{ fontSize: '1.6rem' }}>💵</div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>Thanh Toán COD</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Trả tiền mặt khi nhận hàng</div>
                </div>
              </div>

              <div
                style={{
                  padding: '16px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                  border: paymentMethod === 'BANK_TRANSFER' ? '2px solid var(--primary-500)' : '1px solid var(--border-glass)',
                  background: paymentMethod === 'BANK_TRANSFER' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                  transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '12px'
                }}
                onClick={() => setPaymentMethod('BANK_TRANSFER')}
              >
                <div style={{ fontSize: '1.6rem' }}>🏦</div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>Chuyển Khoản Ngân Hàng</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Quét mã QR 24/7 tức thì</div>
                </div>
              </div>
            </div>
          </div>

          {/* Total & Submit button */}
          <div style={{ marginTop: '26px', borderTop: '1px solid var(--border-glass)', paddingTop: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Tổng thanh toán đơn hàng:</span>
              <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--text-main)' }}>
                {formatVND(totalPrice)}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ padding: '14px 32px', borderRadius: 'var(--radius-md)', fontWeight: '700', fontSize: '1.05rem' }}
            >
              {loading ? '⏳ Đang Xử Lý...' : '🚀 Hoàn Tất & Đặt Hàng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
