import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styling/product-page.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://inventory-backend-node.onrender.com/products')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => setError('Failed to fetch products.'));
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="products-container">
      <h1>Products List</h1>
      <div className="products-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-price">Price: £{product.price}</p>
              <p className="product-quantity">Quantity: {product.quantity}</p>
              <Link to={`/products/${product.id}`}>View Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
