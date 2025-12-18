import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import api from '../utils/api';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ category: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [selectedCategory, searchTerm]);

  const fetchProducts = async () => {
    try {
      const params: any = {};
      if (selectedCategory) params.category = selectedCategory;
      if (searchTerm) params.search = searchTerm;

      const response = await api.get('/products', { params });
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/products/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>
          Premium AI Computing Hardware
        </h2>

        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.category} value={cat.category}>
                {cat.category}
              </option>
            ))}
          </select>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <img src={product.image_url} alt={product.name} className="product-image" />
              <div className="product-content">
                <div className="product-category">{product.category}</div>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-price">${product.price.toLocaleString()}</div>
                <div className={`product-stock ${product.stock < 10 ? 'low' : ''}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
            No products found
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
