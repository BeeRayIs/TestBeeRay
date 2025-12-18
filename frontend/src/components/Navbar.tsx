import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/">
          <h1>⚡ AI Hardware Shop</h1>
        </Link>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/">Products</Link>
          {user ? (
            <>
              <Link to="/cart">
                Cart
                {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
              </Link>
              <Link to="/orders">Orders</Link>
              {user.role === 'admin' && <Link to="/admin">Admin</Link>}
              <button onClick={logout}>Logout ({user.name})</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
