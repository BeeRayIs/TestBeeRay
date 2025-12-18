import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import api from '../utils/api';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchOrderDetails = async (orderId: number) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      setSelectedOrder(response.data);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: '#f59e0b',
      processing: '#3b82f6',
      shipped: '#8b5cf6',
      delivered: '#10b981',
      cancelled: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div className="page">
      <div className="container">
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Your Orders</h2>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
            No orders found
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                      Order #{order.id}
                    </h3>
                    <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        background: getStatusColor(order.status) + '20',
                        color: getStatusColor(order.status),
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        fontSize: '0.875rem',
                        marginBottom: '0.5rem',
                      }}
                    >
                      {order.status}
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                      ${order.total.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                  <p style={{ color: '#6b7280' }}>
                    <strong>Shipping Address:</strong> {order.shipping_address}
                  </p>
                  <button
                    className="btn btn-secondary"
                    onClick={() => fetchOrderDetails(order.id)}
                    style={{ marginTop: '1rem' }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedOrder && (
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
            onClick={() => setSelectedOrder(null)}
          >
            <div
              style={{
                background: 'white',
                borderRadius: '0.5rem',
                padding: '2rem',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                Order Details #{selectedOrder.id}
              </h3>

              <div style={{ marginBottom: '1.5rem' }}>
                {selectedOrder.items?.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      padding: '1rem',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '0.375rem' }}
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontWeight: 600 }}>{item.name}</h4>
                      <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>
                        Quantity: {item.quantity} × ${item.price.toLocaleString()}
                      </p>
                      <p style={{ fontWeight: 600, marginTop: '0.25rem' }}>
                        ${(item.quantity * item.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="btn btn-secondary"
                onClick={() => setSelectedOrder(null)}
                style={{ width: '100%' }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
