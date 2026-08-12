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
        return <span className="badge badge-warning">⏳ Chờ Xử Lý</span>;
      case 'PROCESSING':
        return <span className="badge badge-primary">⚡ Đang Đóng Gói</span>;
      case 'SHIPPED':
        return <span className="badge badge-primary">🚚 Đang Giao Hàng</span>;
      case 'DELIVERED':
        return <span className="badge badge-success">✅ Đã Giao</span>;
      case 'CANCELLED':
        return <span className="badge" style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171' }}>❌ Đã Hủy</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  if (loading) {
    return <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>Đang tải lịch sử đơn hàng...</div>;
  }

  return (
    <div style={{ padding: '32px 0' }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '24px' }}>📦 Lịch Sử Đơn Hàng Của Bạn</h2>

      {orders.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📋</div>
          <p style={{ fontSize: '1.1rem' }}>Bạn chưa có đơn hàng nào!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order) => (
            <div key={order.id} className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--primary-500)' }}>
                    Mã đơn: #{order.orderNumber}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginLeft: '12px' }}>
                    {new Date(order.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div>{getStatusBadge(order.status)}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                {order.items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <img src={item.product?.imageUrl} alt={item.product?.name} style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.95rem' }}>{item.product?.name}</h4>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {formatVND(item.price)} x {item.quantity}
                      </div>
                    </div>
                    <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                      {formatVND(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '14px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  📍 Giao tới: <strong>{order.recipientName}</strong> - {order.phone} ({order.shippingAddress})
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary-500)' }}>
                  Tổng tiền: {formatVND(order.totalAmount)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
