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

  return (
    <div style={{ padding: '32px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.8rem' }}>⚡ Quản Trị Hệ Thống E-Commerce</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('products')}
          >
            📦 Sản Phẩm ({products.length})
          </button>
          <button
            className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('orders')}
          >
            📋 Đơn Hàng ({orders.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Đang tải dữ liệu admin...</div>
      ) : activeTab === 'products' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '28px' }}>
          {/* Create Form */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>➕ Thêm Sản Phẩm Mới</h3>
            {formMsg && (
              <div style={{ marginBottom: '14px', fontSize: '0.88rem', color: formMsg.startsWith('✅') ? '#34d399' : '#f87171' }}>
                {formMsg}
              </div>
            )}
            <form onSubmit={handleCreateProduct}>
              <div className="form-group">
                <label className="form-label">Tên sản phẩm *</label>
                <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Danh mục</label>
                <select className="form-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Giá gốc (VND) *</label>
                  <input type="number" className="form-input" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Giá khuyến mãi</label>
                  <input type="number" className="form-input" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Số lượng kho</label>
                <input type="number" className="form-input" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Link Hình Ảnh (URL)</label>
                <input type="text" className="form-input" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
              </div>

              <div className="form-group">
                <label className="form-label">Mô tả sản phẩm</label>
                <textarea className="form-textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" id="featured" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
                <label htmlFor="featured" className="form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>🔥 Sản phẩm Nổi Bật (Featured)</label>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                Đăng Sản Phẩm
              </button>
            </form>
          </div>

          {/* Product List Table */}
          <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Danh Sách Sản Phẩm Trong Kho</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-main)', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>Ảnh</th>
                  <th style={{ padding: '10px' }}>Tên Sản Phẩm</th>
                  <th style={{ padding: '10px' }}>Giá</th>
                  <th style={{ padding: '10px' }}>Tồn Kho</th>
                  <th style={{ padding: '10px' }}>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '10px' }}>
                      <img src={p.imageUrl} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    </td>
                    <td style={{ padding: '10px', fontWeight: '600' }}>{p.name}</td>
                    <td style={{ padding: '10px', color: 'var(--primary-500)', fontWeight: '700' }}>{formatVND(p.discountPrice || p.price)}</td>
                    <td style={{ padding: '10px' }}>{p.stockQuantity}</td>
                    <td style={{ padding: '10px' }}>
                      <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '0.78rem' }} onClick={() => handleDeleteProduct(p.id)}>
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
        <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Quản Lý Đơn Hàng Khách Hàng</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-main)', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Mã Đơn</th>
                <th style={{ padding: '10px' }}>Khách Hàng</th>
                <th style={{ padding: '10px' }}>Tổng Tiền</th>
                <th style={{ padding: '10px' }}>Trạng Thái</th>
                <th style={{ padding: '10px' }}>Cập Nhật Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px', fontWeight: '700', color: 'var(--primary-500)' }}>#{o.orderNumber}</td>
                  <td style={{ padding: '10px' }}>
                    <div><strong>{o.recipientName}</strong></div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{o.phone}</div>
                  </td>
                  <td style={{ padding: '10px', fontWeight: '700' }}>{formatVND(o.totalAmount)}</td>
                  <td style={{ padding: '10px' }}>{o.status}</td>
                  <td style={{ padding: '10px' }}>
                    <select
                      className="form-select"
                      value={o.status}
                      onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                      style={{ padding: '6px 10px', fontSize: '0.82rem' }}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
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
