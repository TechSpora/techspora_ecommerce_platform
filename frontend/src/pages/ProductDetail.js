import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setLoading(false);
    }
  };

  const addToCart = () => {
    if (!product || product.stock === 0) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find((item) => item.product === product._id);

    if (existingItem) {
      existingItem.qty += quantity;
    } else {
      cart.push({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: quantity,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart!');
    navigate('/cart');
  };

  if (loading) {
    return <div className="loading">Loading product...</div>;
  }

  if (!product) {
    return <div className="error">Product not found</div>;
  }

  return (
    <div className="product-detail">
      <div className="container">
        <div className="product-detail-content">
          <div className="product-image-large">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="product-details">
            <h1>{product.name}</h1>
            <p className="product-category">{product.category}</p>
            <div className="product-price">${product.price}</div>
            <p className="product-description">{product.description}</p>
            
            {product.stock > 0 ? (
              <>
                <div className="quantity-selector">
                  <label>Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                  <span>In Stock: {product.stock}</span>
                </div>
                <button onClick={addToCart} className="btn-add-cart">
                  Add to Cart
                </button>
              </>
            ) : (
              <div className="out-of-stock">Out of Stock</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
