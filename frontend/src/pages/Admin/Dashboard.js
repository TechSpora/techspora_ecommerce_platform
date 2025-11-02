import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import './Admin.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        api.get('/orders'),
        api.get('/products'),
        api.get('/users'),
      ]);

      const orders = ordersRes.data;
      const totalRevenue = orders
        .filter((order) => order.isPaid)
        .reduce((sum, order) => sum + order.totalPrice, 0);

      setStats({
        totalOrders: orders.length,
        totalProducts: productsRes.data.length,
        totalUsers: usersRes.data.length,
        totalRevenue,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1>Admin Dashboard</h1>
        <div className="dashboard-grid">
          <div className="stat-card">
            <h3>Total Products</h3>
            <p className="stat-value">{stats.totalProducts}</p>
            <Link to="/admin/products" className="stat-link">
              Manage Products →
            </Link>
          </div>
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p className="stat-value">{stats.totalOrders}</p>
            <Link to="/admin/orders" className="stat-link">
              View Orders →
            </Link>
          </div>
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-value">{stats.totalUsers}</p>
            <Link to="/admin/users" className="stat-link">
              Manage Users →
            </Link>
          </div>
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <p className="stat-value">${stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
