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
      <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '14px' }}>
          <h2 style={{ fontSize: '1.4rem' }}>📝 Thông Tin Thanh Toán & Giao Hàng</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#f87171', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Họ và tên người nhận *</label>
            <input
              type="text"
              className="form-input"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Nguyễn Văn A"
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

          <div className="form-group">
            <label className="form-label">Địa chỉ giao hàng chi tiết *</label>
            <input
              type="text"
              className="form-input"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Số nhà, đường, quận/huyện, tỉnh/thành phố"
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
              placeholder="Lời nhắn cho shipper..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phương thức thanh toán</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                type="button"
                className={`btn ${paymentMethod === 'COD' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setPaymentMethod('COD')}
                style={{ padding: '12px' }}
              >
                💵 Thanh toán COD
              </button>
              <button
                type="button"
                className={`btn ${paymentMethod === 'BANK_TRANSFER' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setPaymentMethod('BANK_TRANSFER')}
                style={{ padding: '12px' }}
              >
                🏦 Chuyển khoản ngân hàng
              </button>
            </div>
          </div>

          <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-glass)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Tổng thanh toán:</span>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary-500)' }}>
                {formatVND(totalPrice)}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ padding: '12px 28px', borderRadius: 'var(--radius-md)' }}
            >
              {loading ? 'Đang Xử Lý...' : '✅ Xác Nhận Đặt Hàng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
