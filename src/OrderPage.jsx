import React, { useState, useEffect } from 'react';
import { CategoryNavigation } from './CategoryNavigation';
import { Header } from './Header';
import { Footer } from './Footer';
import './assets/styles.css';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [username, setUsername] = useState('');
  const [cartError, setCartError] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(true);

  // Fetch Orders on Component Mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch Cart Count when username is set
  useEffect(() => {
    if (username && username !== 'Guest') {
      fetchCartCount();
    }
  }, [username]);

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:9090/api/order', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data.products || []);
      setUsername(data.username ?? 'Guest');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Cart Count
  const fetchCartCount = async () => {
    if (!username || username === 'Guest') return; // Prevent unnecessary calls

    setIsCartLoading(true);
    try {
      const response = await fetch(`http://localhost:9090/api/cart/items/count?username=${username}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch cart count');
      const count = await response.json();
      setCartCount(count);
      setCartError(false);
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartError(true);
    } finally {
      setIsCartLoading(false);
    }
  };

  return (
    <div className="maindiv">
      <div className="customer-homepage">
        <Header
          cartCount={isCartLoading ? '...' : cartError ? 'Error' : cartCount}
          username={username}
        />
        <main className="main-content">
          <h1 className="form-title">Your Orders</h1>
          {loading && <p>Loading orders...</p>}
          {error && <p className="error-message">{error}</p>}
          {!loading && !error && orders.length === 0 && (
            <p>No orders found. Start shopping now!</p>
          )}
          {!loading && !error && orders.length > 0 && (
            <div className="orders-list">
              {orders.map((order, index) => (
                <div key={index} className="order-card">
                  <div className="order-card-header">
                    <h3>Order Id: {order.order_id}</h3>
                  </div>
                  <div className="order-card-body">
                    <img
                      src={order.image_url}
                      alt={order.name}
                      className="order-product-image"
                    />
                    <div className="order-details">
                      <h3 className="product-name">ProductName: {order.name}</h3>
                      <h3>Description: {order.description}</h3>
                      <h3>Quantity: {order.quantity}</h3>
                      <h3>Price per Unit: ₹{order.price_per_unit.toFixed(2)}</h3>
                      <h3>Total Price: ₹{order.total_price.toFixed(2)}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}
