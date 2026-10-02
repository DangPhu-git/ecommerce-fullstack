import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Category, Order, Product } from '../types';

export const AdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // New product form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('10');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [formMsg, setFormMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pData, cData, oData] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getAllOrders(),
      ]);
      setProducts(pData.content);
      setCategories(cData);
      setOrders(oData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setFormMsg(null);
      await api.createProduct({
        name,
        description,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
        stockQuantity: parseInt(stockQuantity),
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
        isFeatured,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
      });
      setFormMsg({ type: 'success', text: 'Thêm sản phẩm mới vào kho thành công.' });
      setName('');
      setDescription('');
      setPrice('');
      setDiscountPrice('');
      setImageUrl('');
      loadData();
    } catch (err: any) {
      setFormMsg({ type: 'error', text: err.message || 'Lỗi thêm sản phẩm' });
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('Xác nhận xóa sản phẩm khỏi danh mục?')) {
      try {
        await api.deleteProduct(id);
        loadData();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      await api.updateOrderStatus(orderId, status);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const formatVND = (p: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div style={{ padding: '32px 0 60px 0' }}>
      {/* Top Header & Tab Switcher */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Quản trị hệ thống
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Giám sát kho hàng, điều phối vận đơn và phân tích dữ liệu bán hàng
          </p>
        </div>

        {/* Tab Controls */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-subtle)',
            padding: '4px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <button
            className="btn"
            style={{
              padding: '8px 18px',
              fontSize: '0.84rem',
              borderRadius: 'var(--radius-xs)',
              background: activeTab === 'products' ? 'var(--bg-surface)' : 'transparent',
              color: activeTab === 'products' ? 'var(--text-primary)' : 'var(--text-muted)',
              boxShadow: activeTab === 'products' ? 'var(--shadow-sm)' : 'none',
            }}
            onClick={() => setActiveTab('products')}
          >
            Kho sản phẩm ({products.length})
          </button>
          <button
            className="btn"
            style={{
              padding: '8px 18px',
              fontSize: '0.84rem',
              borderRadius: 'var(--radius-xs)',
              background: activeTab === 'orders' ? 'var(--bg-surface)' : 'transparent',
              color: activeTab === 'orders' ? 'var(--text-primary)' : 'var(--text-muted)',
              boxShadow: activeTab === 'orders' ? 'var(--shadow-sm)' : 'none',
            }}
            onClick={() => setActiveTab('orders')}
          >
            Đơn hàng ({orders.length})
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <div className="glass-panel" style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>
            DOANH THU THỰC TẾ
          </div>
          <div
            style={{
              fontSize: '1.6rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginTop: '6px',
              fontFamily: 'var(--font-heading)',
            }}
          >
            {formatVND(totalRevenue)}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>
            TỔNG SỐ ĐƠN HÀNG
          </div>
          <div
            style={{
              fontSize: '1.6rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginTop: '6px',
              fontFamily: 'var(--font-heading)',
            }}
          >
            {orders.length} đơn
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>
            MẶT HÀNG TRONG KHO
          </div>
          <div
            style={{
              fontSize: '1.6rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginTop: '6px',
              fontFamily: 'var(--font-heading)',
            }}
          >
            {products.length} sản phẩm
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ display: 'inline-block', width: '28px', height: '28px', border: '2px solid var(--border-medium)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '12px' }} />
          <p style={{ fontSize: '0.88rem' }}>Đang nạp dữ liệu quản trị...</p>
        </div>
      ) : activeTab === 'products' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '28px', alignItems: 'start' }}>
          {/* New Product Form */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '18px', color: 'var(--text-primary)' }}>
              Thêm sản phẩm mới
            </h3>

            {formMsg && (
              <div
                style={{
                  background: formMsg.type === 'success' ? 'var(--color-success-soft)' : 'var(--color-danger-soft)',
                  border: formMsg.type === 'success' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                  color: formMsg.type === 'success' ? '#34d399' : '#f87171',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '16px',
                  fontSize: '0.84rem',
                }}
              >
                {formMsg.text}
              </div>
            )}

            <form onSubmit={handleCreateProduct}>
              <div className="form-group">
                <label className="form-label">Tên sản phẩm *</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Bàn phím cơ không dây Pro 75"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Danh mục sản phẩm</label>
                <select
                  className="form-select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">Chọn danh mục phù hợp</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Giá niêm yết (VNĐ) *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="2500000"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Giá ưu đãi (nếu có)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    placeholder="1990000"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Số lượng tồn kho ban đầu *</label>
                <input
                  type="number"
                  className="form-input"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Đường dẫn hình ảnh (URL)</label>
                <input
                  type="url"
                  className="form-input"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mô tả sản phẩm</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Thông số kỹ thuật, vật liệu hoàn thiện, thời lượng pin..."
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <label htmlFor="featured-check" style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  Đánh dấu là sản phẩm nổi bật
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px' }}
              >
                Lưu vào kho hàng
              </button>
            </form>
          </div>

          {/* Product Data Table */}
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>SẢN PHẨM</th>
                  <th>DANH MỤC</th>
                  <th>GIÁ BÁN</th>
                  <th>TỒN KHO</th>
                  <th style={{ textAlign: 'right' }}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={p.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
                          alt={p.name}
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)', background: '#0d121c' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.88rem' }}>{p.name}</div>
                          {p.isFeatured && <span className="badge badge-accent" style={{ marginTop: '2px' }}>Nổi bật</span>}
                        </div>
                      </div>
                    </td>
                    <td>{p.category?.name || 'Chung'}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {formatVND(p.discountPrice || p.price)}
                      </div>
                      {p.discountPrice && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                          {formatVND(p.price)}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={p.stockQuantity > 5 ? 'badge badge-success' : 'badge badge-sale'}>
                        {p.stockQuantity} món
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-ghost"
                        style={{ padding: '6px 10px', fontSize: '0.8rem', color: '#f87171' }}
                        onClick={() => handleDeleteProduct(p.id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Orders Management Table */
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>MÃ ĐƠN</th>
                <th>KHÁCH HÀNG</th>
                <th>NGÀY ĐẶT</th>
                <th>TỔNG TIỀN</th>
                <th>TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                    #{o.orderNumber}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{o.recipientName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{o.phone}</div>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {new Date(o.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                    {formatVND(o.totalAmount)}
                  </td>
                  <td>
                    <select
                      className="form-select"
                      style={{ padding: '6px 10px', fontSize: '0.82rem', width: 'auto', background: 'var(--bg-subtle)' }}
                      value={o.status}
                      onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                    >
                      <option value="PENDING">Chờ xác nhận</option>
                      <option value="PROCESSING">Đang đóng gói</option>
                      <option value="SHIPPED">Đang vận chuyển</option>
                      <option value="DELIVERED">Đã giao hàng</option>
                      <option value="CANCELLED">Hủy đơn</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
