import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Orders.css';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/myorders');
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="orders-page">
      <div className="container">
        <h1>My Orders</h1>
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>You have no orders yet</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Order #{order._id.substring(0, 8)}</h3>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="order-status">
                    <span className={`status-badge ${order.status}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="order-items">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="order-item">
                      <img src={item.image} alt={item.name} />
                      <div className="item-info">
                        <p>{item.name}</p>
                        <p>Qty: {item.qty} × ${item.price}</p>
                      </div>
                      <p className="item-total">
                        ${(item.qty * item.price).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="order-footer">
                  <div className="order-total">
                    <p>Total: ${order.totalPrice.toFixed(2)}</p>
                  </div>
                  <div className="order-payment">
                    <p>Payment: {order.isPaid ? 'Paid' : 'Pending'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
