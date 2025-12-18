import React, { useState, useEffect } from 'react';
import { Product, Order } from '../types';
import api from '../utils/api';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    stock: '',
    specs: '',
  });

  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    } else {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    const response = await api.get('/products');
    setProducts(response.data);
  };

  const fetchOrders = async () => {
    const response = await api.get('/orders');
    setOrders(response.data);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        specs: formData.specs || '{}',
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, data);
      } else {
        await api.post('/products', data);
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image_url: product.image_url,
      stock: product.stock.toString(),
      specs: product.specs,
    });
    setShowProductForm(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setShowProductForm(false);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image_url: '',
      stock: '',
      specs: '',
    });
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Admin Panel</h2>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button
            className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button
            className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
        </div>

        {activeTab === 'products' && (
          <>
            <button
              className="btn btn-primary"
              onClick={() => setShowProductForm(true)}
              style={{ marginBottom: '2rem' }}
            >
              Add New Product
            </button>

            {showProductForm && (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2rem',
                  zIndex: 1000,
                }}
                onClick={resetForm}
              >
                <div
                  style={{
                    background: 'white',
                    borderRadius: '0.5rem',
                    padding: '2rem',
                    maxWidth: '600px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflow: 'auto',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>

                  <form onSubmit={handleProductSubmit}>
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="form-group">
                      <label>Price</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Category</label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Image URL</label>
                      <input
                        type="url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Stock</label>
                      <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Specs (JSON)</label>
                      <textarea
                        value={formData.specs}
                        onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                        placeholder='{"key": "value"}'
                        rows={3}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                        {editingProduct ? 'Update' : 'Create'}
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={resetForm}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>${product.price.toLocaleString()}</td>
                    <td>{product.stock}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleEditProduct(product)}
                          style={{ padding: '0.5rem 1rem' }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteProduct(product.id)}
                          style={{ padding: '0.5rem 1rem' }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === 'orders' && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customer_name || order.email}</td>
                  <td>${order.total.toLocaleString()}</td>
                  <td>
                    <span
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                      }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Admin;
