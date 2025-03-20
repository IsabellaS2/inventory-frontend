import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styling/product-page.css";
import "../styling/home.css";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/error");
      return;
    }

    fetch("https://inventory-backend-node.onrender.com/profile", {
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
            throw new Error("Failed to fetch user details");
          }
        }
        return response.json();
      })
      .then((data) => {
        setUserRole(data.user.role);
      })
      .catch((error) => setError(error.message));

    fetch("https://inventory-backend-node.onrender.com/products", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [navigate]);

  if (error) {
    return <div>{error}</div>;
  }

  const handleViewDetails = (productId) => {
    if (userRole === "user") {
      navigate("/access-control-error", {
        state: { user: "admins and managers", message: "edit" },
      });
    } else {
      navigate(`/products/${productId}`);
    }
  };

  if (loading) {
    return <div className="loading-message">Loading Products...</div>;
  }

  return (
    <div className="products-container">
      <h1>Products List</h1>

      {}
      {products.length === 0 ? (
        <div className="no-products">
          <h2>Oops, there are no products in the inventory!</h2>
          <p>Why not add one?</p>
          <div className="home-card" onClick={() => navigate("/add-product")}>
            <h2>Add Products</h2>
            <p>Add a new product to your inventory</p>
          </div>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">Price: £{product.price}</p>
                <p className="product-quantity">Quantity: {product.quantity}</p>
                <button
                  className="product-button"
                  onClick={() => handleViewDetails(product.id)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
