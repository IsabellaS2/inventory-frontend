import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styling/product-page.css";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/error");
      return;
    }

    fetch("https://inventory-backend-node.onrender.com/products", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 403) {
            setError(
              "You are not authorized to view this page. Please log in."
            );
            navigate("/error");
          } else {
            throw new Error("Failed to fetch products");
          }
        }
        return response.json();
      })
      .then((data) => setProducts(data))
      .catch((error) => setError(error.message));
  }, [navigate]);

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
              <Link className="product-button" to={`/products/${product.id}`}>
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
