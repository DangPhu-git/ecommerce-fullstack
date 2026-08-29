import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);

  // Form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLoginView) {
        const res = await api.login(username, password);
        login(res.accessToken, res.user);
        onClose();
      } else {
        await api.register({
          username,
          email,
          password,
          fullName,
          phone,
          address,
        });
        const loginRes = await api.login(username, password);
        login(loginRes.accessToken, loginRes.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Thao tác không thành công');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '460px', padding: '32px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>
              {isLoginView ? '🔑 Đăng Nhập' : '✨ Tạo Tài Khoản'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              {isLoginView ? 'Chào mừng bạn quay trở lại với NeoStore' : 'Đăng ký nhanh chóng chỉ trong vài giây'}
            </p>
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

        {/* Demo Quick Fill Badges */}
        {isLoginView && (
          <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#a5b4fc', marginBottom: '8px' }}>
              ⚡ Tài khoản demo dùng thử nhanh:
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '4px 10px', fontSize: '0.78rem', borderRadius: 'var(--radius-xs)' }}
                onClick={() => handleQuickFill('admin', 'admin123')}
              >
                👑 Admin (admin/admin123)
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '4px 10px', fontSize: '0.78rem', borderRadius: 'var(--radius-xs)' }}
                onClick={() => handleQuickFill('user', 'user123')}
              >
                👤 User (user/user123)
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tên đăng nhập *</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="VD: nguyenvanan"
              required
            />
          </div>

          {!isLoginView && (
            <>
              <div className="form-group">
                <label className="form-label">Địa chỉ Email *</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="an.nguyen@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Họ và tên</label>
                <input
                  type="text"
                  className="form-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn An"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Mật khẩu *</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {!isLoginView && (
            <>
              <div className="form-group">
                <label className="form-label">Số điện thoại</label>
                <input
                  type="text"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912 345 678"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Địa chỉ giao hàng</label>
                <input
                  type="text"
                  className="form-input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Quận 1, TP. Hồ Chí Minh"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '13px', marginTop: '12px', borderRadius: 'var(--radius-md)', fontWeight: '700', fontSize: '1rem' }}
          >
            {loading ? '⏳ Đang xác thực...' : isLoginView ? 'Đăng Nhập Vào Hệ Thống' : 'Hoàn Tất Đăng Ký'}
          </button>
        </form>

        <div style={{ marginTop: '22px', textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          {isLoginView ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
          <button
            style={{ background: 'none', border: 'none', color: '#a5b4fc', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => {
              setIsLoginView(!isLoginView);
              setError('');
            }}
          >
            {isLoginView ? 'Đăng ký ngay' : 'Đăng nhập'}
          </button>
        </div>
      </div>
    </div>
  );
};
