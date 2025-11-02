import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import './Admin.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    }
  };

  return (
    <div className="admin-page">
      <div className="container">
        <h1>Manage Orders</h1>
        {loading ? (
          <div className="loading">Loading orders...</div>
        ) : (
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Paid</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id.substring(0, 8)}...</td>
                    <td>
                      {order.user?.name || order.user?.email || 'N/A'}
                    </td>
                    <td>${order.totalPrice.toFixed(2)}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order._id, e.target.value)
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>{order.isPaid ? 'Yes' : 'No'}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => {
                          if (order.isDelivered) {
                            alert('Order already delivered');
                            return;
                          }
                          updateOrderStatus(order._id, 'delivered');
                        }}
                        className="btn-edit"
                        disabled={order.isDelivered}
                      >
                        Mark Delivered
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
