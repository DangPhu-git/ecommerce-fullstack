import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Order } from '../types';

interface OrdersViewProps {
  onOpenAuth?: () => void;
  onGoToAdmin?: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ onOpenAuth, onGoToAdmin }) => {
  const { user, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await api.getMyOrders();
      setOrders(data);
    } catch (err: any) {
      console.error('Failed to fetch orders:', err);
      setError(err.message || 'Không thể nạp dữ liệu đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="badge badge-warning">Chờ xác nhận</span>;
      case 'PROCESSING':
        return <span className="badge badge-neutral">Đang đóng gói</span>;
      case 'SHIPPED':
        return <span className="badge badge-accent">Đang vận chuyển</span>;
      case 'DELIVERED':
        return <span className="badge badge-success">Đã giao hàng</span>;
      case 'CANCELLED':
        return <span className="badge badge-sale">Đã hủy</span>;
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  // Not logged in view
  if (!user) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center' }}>
        <div
          className="glass-panel"
          style={{
            maxWidth: '520px',
            margin: '0 auto',
            padding: '48px 32px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-subtle)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              color: 'var(--accent-primary)',
            }}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
            Vui lòng đăng nhập để xem đơn hàng
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.6 }}>
            Lịch sử mua hàng, trạng thái đóng gói và mã vận đơn được bảo mật theo tài khoản của bạn.
          </p>

          <button
            className="btn btn-primary"
            style={{ padding: '10px 24px', fontSize: '0.9rem' }}
            onClick={onOpenAuth}
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div
          style={{
            display: 'inline-block',
            width: '28px',
            height: '28px',
            border: '2px solid var(--border-medium)',
            borderTopColor: 'var(--accent-primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            marginBottom: '12px',
          }}
        />
        <p style={{ fontSize: '0.9rem' }}>Đang nạp dữ liệu lịch sử đơn hàng...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 0 60px 0' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Lịch sử đơn hàng
        </h2>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Theo dõi trạng thái đóng gói, giao vận và chi tiết sản phẩm đã mua của tài khoản <strong>{user.username}</strong>
        </p>
      </div>

      {/* Admin Notice Banner */}
      {isAdmin && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 18px',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>Chế độ Quản trị viên:</span> Đây là danh sách đơn đặt của riêng tài khoản admin.
          </div>
          {onGoToAdmin && (
            <button
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 14px' }}
              onClick={onGoToAdmin}
            >
              Xem tất cả đơn của khách hàng →
            </button>
          )}
        </div>
      )}

      {error ? (
        <div
          style={{
            background: 'var(--color-danger-soft)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '16px 20px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{error}</span>
          <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px' }} onClick={fetchOrders}>
            Tải lại
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '56px 24px',
            textAlign: 'center',
            color: 'var(--text-muted)',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-subtle)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              color: 'var(--text-dim)',
            }}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Tài khoản chưa có đơn hàng nào
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-dim)' }}>
            Khi bạn đặt mua sản phẩm, thông tin mã vận đơn và tình trạng giao hàng sẽ hiển thị chi tiết tại đây.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order) => (
            <div
              key={order.id}
              className="glass-panel"
              style={{ padding: '22px 24px' }}
            >
              {/* Order Card Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                  borderBottom: '1px solid var(--border-subtle)',
                  paddingBottom: '12px',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                    Mã đơn #{order.orderNumber}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '12px' }}>
                    {new Date(order.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div>{getStatusBadge(order.status)}</div>
              </div>

              {/* Order Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center',
                      background: 'var(--bg-subtle)',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <img
                      src={item.product?.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
                      alt={item.product?.name}
                      style={{
                        width: '48px',
                        height: '48px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-xs)',
                        border: '1px solid var(--border-subtle)',
                        background: '#0d121c',
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4
                        style={{
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          marginBottom: '2px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.product?.name}
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Số lượng: <span style={{ color: 'var(--text-secondary)' }}>{item.quantity}</span> × {formatVND(item.price)}
                      </div>
                    </div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        fontSize: '0.94rem',
                        fontFamily: 'var(--font-heading)',
                      }}
                    >
                      {formatVND(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Card Footer */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '14px',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Giao đến: <strong style={{ color: 'var(--text-secondary)' }}>{order.recipientName}</strong> ({order.phone}) · {order.shippingAddress}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Tổng thanh toán:</span>
                  <span
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    {formatVND(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
