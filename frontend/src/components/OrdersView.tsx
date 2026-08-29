import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Order } from '../types';

export const OrdersView: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="badge badge-warning">⏳ Chờ Xác Nhận</span>;
      case 'PROCESSING':
        return <span className="badge badge-primary">⚡ Đang Đóng Gói</span>;
      case 'SHIPPED':
        return <span className="badge badge-primary" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', borderColor: 'rgba(6, 182, 212, 0.3)' }}>🚚 Đang Giao Hàng</span>;
      case 'DELIVERED':
        return <span className="badge badge-success">✅ Đã Giao Thành Công</span>;
      case 'CANCELLED':
        return <span className="badge" style={{ background: 'rgba(244,63,94,0.15)', color: '#fb7185', borderColor: 'rgba(244,63,94,0.3)' }}>❌ Đã Hủy</span>;
      default:
        return <span className="badge badge-primary">{status}</span>;
    }
  };

  if (loading) {
    return <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)' }}>Đang tải lịch sử đơn hàng của bạn...</div>;
  }

  return (
    <div style={{ padding: '36px 0 60px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
        <span style={{ fontSize: '1.8rem' }}>📦</span>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Lịch Sử Đơn Hàng</h2>
      </div>

      {orders.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>📋</div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Bạn chưa có đơn hàng nào!</h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-dim)' }}>Khi bạn đặt hàng, toàn bộ thông tin vận chuyển sẽ hiển thị chi tiết tại đây.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {orders.map((order) => (
            <div key={order.id} className="glass-panel" style={{ padding: '24px 28px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              {/* Order Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span style={{ fontWeight: '800', fontSize: '1.15rem', color: '#a5b4fc' }}>
                    Đơn hàng #{order.orderNumber}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginLeft: '16px' }}>
                    🕒 {new Date(order.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div>{getStatusBadge(order.status)}</div>
              </div>

              {/* Order Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
                {order.items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', gap: '16px', alignItems: 'center', background: 'rgba(15, 23, 42, 0.5)', padding: '12px 16px', borderRadius: 'var(--radius-sm)' }}>
                    <img
                      src={item.product?.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
                      alt={item.product?.name}
                      style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-glass)' }}
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '4px' }}>{item.product?.name}</h4>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                        Số lượng: <strong style={{ color: 'var(--text-secondary)' }}>{item.quantity}</strong> × {formatVND(item.price)}
                      </div>
                    </div>
                    <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '1rem' }}>
                      {formatVND(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer & Shipping info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '16px', flexWrap: 'wrap', gap: '14px' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  📍 Giao tới: <strong style={{ color: '#fff' }}>{order.recipientName}</strong> ({order.phone}) - {order.shippingAddress}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Tổng thanh toán:</span>
                  <span style={{ fontSize: '1.35rem', fontWeight: '900', color: 'var(--text-main)' }}>
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
