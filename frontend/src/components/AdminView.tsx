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
  const [formMsg, setFormMsg] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [pData, cData, oData] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getAllOrders(),
      ]);
      setProducts(pData);
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
      setFormMsg('');
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
      setFormMsg('✅ Thêm sản phẩm mới thành công!');
      setName('');
      setDescription('');
      setPrice('');
      setDiscountPrice('');
      setImageUrl('');
      loadData();
    } catch (err: any) {
      setFormMsg('❌ ' + (err.message || 'Lỗi thêm sản phẩm'));
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
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

  // Total revenue calculation
  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div style={{ padding: '36px 0 60px 0' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.9rem', fontWeight: '800' }}>⚡ Dashboard Quản Trị Hệ Thống</h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Quản lý kho hàng, danh mục sản phẩm và trạng thái đơn hàng thời gian thực
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '10px 20px' }}
            onClick={() => setActiveTab('products')}
          >
            📦 Sản Phẩm ({products.length})
          </button>
          <button
            className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '10px 20px' }}
            onClick={() => setActiveTab('orders')}
          >
            📋 Đơn Hàng ({orders.length})
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '20px 24px', borderLeft: '4px solid var(--primary-500)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: '600' }}>TỔNG DOANH THU</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', marginTop: '6px', color: '#a5b4fc' }}>
            {formatVND(totalRevenue)}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px 24px', borderLeft: '4px solid var(--accent-emerald)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: '600' }}>TỔNG ĐƠN HÀNG</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', marginTop: '6px', color: '#34d399' }}>
            {orders.length} đơn
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px 24px', borderLeft: '4px solid var(--accent-pink)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: '600' }}>SẢN PHẨM TRONG KHO</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', marginTop: '6px', color: '#f472b6' }}>
            {products.length} mã
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Đang tải dữ liệu quản trị...</div>
      ) : activeTab === 'products' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '28px' }}>
          {/* Create Form */}
          <div className="glass-panel" style={{ padding: '28px', alignSelf: 'start' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '18px', fontWeight: '700' }}>➕ Thêm Sản Phẩm Mới</h3>
            {formMsg && (
              <div style={{ marginBottom: '16px', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: formMsg.startsWith('✅') ? 'var(--success-bg)' : 'var(--danger-bg)', color: formMsg.startsWith('✅') ? '#34d399' : '#fb7185', fontSize: '0.88rem' }}>
                {formMsg}
              </div>
            )}
            <form onSubmit={handleCreateProduct}>
              <div className="form-group">
                <label className="form-label">Tên sản phẩm *</label>
                <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: iPhone 16 Pro Max 256GB" required />
              </div>

              <div className="form-group">
                <label className="form-label">Danh mục sản phẩm</label>
                <select className="form-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Giá niêm yết (VND) *</label>
                  <input type="number" className="form-input" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="30000000" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Giá giảm khuyến mãi</label>
                  <input type="number" className="form-input" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} placeholder="27500000" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Số lượng tồn kho</label>
                <input type="number" className="form-input" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Link Hình Ảnh (URL)</label>
                <input type="text" className="form-input" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://images.unsplash.com/..." />
              </div>

              <div className="form-group">
                <label className="form-label">Mô tả sản phẩm</label>
                <textarea className="form-textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Mô tả các đặc tính nổi bật của sản phẩm..." />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" id="featured" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} style={{ cursor: 'pointer', width: '18px', height: '18px' }} />
                <label htmlFor="featured" className="form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>🔥 Sản phẩm Nổi Bật (Featured)</label>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '13px', borderRadius: 'var(--radius-sm)', fontWeight: '700' }}>
                🚀 Lưu & Đăng Sản Phẩm
              </button>
            </form>
          </div>

          {/* Product List Table */}
          <div className="glass-panel" style={{ padding: '28px', overflowX: 'auto' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '18px', fontWeight: '700' }}>Danh Sách Sản Phẩm</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-main)', fontSize: '0.92rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', textAlign: 'left', color: 'var(--text-dim)' }}>
                  <th style={{ padding: '12px 10px' }}>Hình Ảnh</th>
                  <th style={{ padding: '12px 10px' }}>Tên Sản Phẩm</th>
                  <th style={{ padding: '12px 10px' }}>Giá Bán</th>
                  <th style={{ padding: '12px 10px' }}>Tồn Kho</th>
                  <th style={{ padding: '12px 10px', textAlign: 'right' }}>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '12px 10px' }}>
                      <img src={p.imageUrl} alt={p.name} style={{ width: '46px', height: '46px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-glass)' }} />
                    </td>
                    <td style={{ padding: '12px 10px', fontWeight: '600' }}>
                      {p.name}
                      {p.isFeatured && <span className="badge badge-hot" style={{ marginLeft: '6px', fontSize: '0.65rem' }}>HOT</span>}
                    </td>
                    <td style={{ padding: '12px 10px', fontWeight: '700' }}>
                      {formatVND(p.discountPrice || p.price)}
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <span className={p.stockQuantity > 0 ? 'badge badge-success' : 'badge badge-hot'}>
                        {p.stockQuantity}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                      <button className="btn btn-danger" style={{ padding: '5px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-xs)' }} onClick={() => handleDeleteProduct(p.id)}>
                        🗑️ Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Orders List */
        <div className="glass-panel" style={{ padding: '28px', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '18px', fontWeight: '700' }}>Quản Lý Đơn Hàng Của Khách</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-main)', fontSize: '0.92rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', textAlign: 'left', color: 'var(--text-dim)' }}>
                <th style={{ padding: '12px 10px' }}>Mã Đơn</th>
                <th style={{ padding: '12px 10px' }}>Khách Hàng</th>
                <th style={{ padding: '12px 10px' }}>Tổng Tiền</th>
                <th style={{ padding: '12px 10px' }}>Trạng Thái Hiện Tại</th>
                <th style={{ padding: '12px 10px', textAlign: 'right' }}>Cập Nhật</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px 10px', fontWeight: '800', color: '#a5b4fc' }}>#{o.orderNumber}</td>
                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ fontWeight: '700' }}>{o.recipientName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{o.phone}</div>
                  </td>
                  <td style={{ padding: '12px 10px', fontWeight: '800' }}>{formatVND(o.totalAmount)}</td>
                  <td style={{ padding: '12px 10px' }}>
                    <span className="badge badge-primary">{o.status}</span>
                  </td>
                  <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                    <select
                      className="form-select"
                      value={o.status}
                      onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                      style={{ padding: '6px 12px', fontSize: '0.85rem', width: 'auto', display: 'inline-block' }}
                    >
                      <option value="PENDING">PENDING (Chờ xác nhận)</option>
                      <option value="PROCESSING">PROCESSING (Đang đóng gói)</option>
                      <option value="SHIPPED">SHIPPED (Đang giao hàng)</option>
                      <option value="DELIVERED">DELIVERED (Đã giao hàng)</option>
                      <option value="CANCELLED">CANCELLED (Đã hủy)</option>
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
