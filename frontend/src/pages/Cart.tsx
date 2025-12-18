import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) {
      setMessage('Please enter a shipping address');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await api.post('/orders/create', { shipping_address: shippingAddress });
      setMessage('Order placed successfully!');
      setTimeout(() => navigate('/orders'), 2000);
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="page">
        <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Your cart is empty</h2>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Shopping Cart</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div>
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image_url} alt={item.name} className="cart-item-image" />

                <div className="cart-item-details">
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{item.name}</h3>
                  <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                    ${item.price.toLocaleString()} each
                  </p>
                  <p style={{ fontWeight: 600, marginTop: '0.5rem' }}>
                    Subtotal: ${(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>

                <div className="cart-item-actions">
                  <input
                    type="number"
                    min="1"
                    max={item.stock}
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                    className="quantity-input"
                  />
                  <button className="btn btn-danger" onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="order-summary">
              <h3>Order Summary</h3>

              <div className="order-summary-line">
                <span>Items ({cart.length})</span>
                <span>${cartTotal.toLocaleString()}</span>
              </div>

              <div className="order-summary-line">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <div className="order-summary-total order-summary-line">
                <span>Total</span>
                <span>${cartTotal.toLocaleString()}</span>
              </div>

              <div className="form-group" style={{ marginTop: '2rem' }}>
                <label>Shipping Address</label>
                <textarea
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Enter your full shipping address"
                  rows={4}
                />
              </div>

              <button
                className="btn btn-primary"
                onClick={handleCheckout}
                disabled={loading}
                style={{ width: '100%', marginTop: '1rem' }}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>

              {message && (
                <div className={message.includes('success') ? 'success' : 'error'}>
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
