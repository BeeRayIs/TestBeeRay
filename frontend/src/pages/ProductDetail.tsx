import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await addToCart(product!.id, quantity);
      setMessage('Added to cart successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Failed to add to cart');
    }
  };

  if (!product) return <div className="page container">Loading...</div>;

  const specs = product.specs ? JSON.parse(product.specs) : {};

  return (
    <div className="page">
      <div className="container">
        <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginBottom: '2rem' }}>
          ← Back
        </button>

        <div className="product-detail">
          <div>
            <img src={product.image_url} alt={product.name} className="product-detail-image" />
          </div>

          <div>
            <div className="product-category">{product.category}</div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '1rem 0' }}>{product.name}</h1>
            <p style={{ color: '#6b7280', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {product.description}
            </p>

            <div className="product-price" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
              ${product.price.toLocaleString()}
            </div>

            <div className={`product-stock ${product.stock < 10 ? 'low' : ''}`} style={{ marginBottom: '2rem' }}>
              {product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Specifications</h3>
            <ul className="specs-list">
              {Object.entries(specs).map(([key, value]) => (
                <li key={key}>
                  <span style={{ fontWeight: 500 }}>{key}</span>
                  <span>{value as string}</span>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="quantity-input"
              />
              <button
                className="btn btn-primary"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                style={{ flex: 1 }}
              >
                Add to Cart
              </button>
            </div>

            {message && (
              <div className={message.includes('success') ? 'success' : 'error'}>{message}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
