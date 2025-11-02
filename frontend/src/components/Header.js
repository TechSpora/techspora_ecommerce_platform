import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem('cart')) || []
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <h1>E-Commerce</h1>
        </Link>

        <nav className="nav">
          <Link to="/products">Products</Link>
          <Link to="/cart">
            Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          
          {user ? (
            <>
              {isAdmin && <Link to="/admin/dashboard">Admin</Link>}
              <Link to="/orders">Orders</Link>
              <div className="user-menu">
                <span>Welcome, {user.name}</span>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
