import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styling/products/product-page.css";
import "../../styling/home.css";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("none"); // State for sorting option
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/error");
      return;
    }

    fetch("https://inventory-backend-16iy.onrender.com/profile", {
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

    fetch("https://inventory-backend-16iy.onrender.com/products", {
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

  const sortProducts = (option) => {
    let sortedProducts;
    switch (option) {
      case "quantity-asc":
        sortedProducts = [...products].sort((a, b) => a.quantity - b.quantity);
        break;
      case "quantity-desc":
        sortedProducts = [...products].sort((a, b) => b.quantity - a.quantity);
        break;
      case "price-asc":
        sortedProducts = [...products].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sortedProducts = [...products].sort((a, b) => b.price - a.price);
        break;
      default:
        sortedProducts = [...products];
        break;
    }
    setProducts(sortedProducts);
  };

  const handleSortChange = (event) => {
    const option = event.target.value;
    setSortOption(option);
    sortProducts(option);
  };

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

      {/* Sort Dropdown */}
      <div className="sort-dropdown">
        <label htmlFor="sort">Sort by: </label>
        <select id="sort" value={sortOption} onChange={handleSortChange}>
          <option value="none">None</option>
          <option value="quantity-asc">Lowest to Highest Quantity</option>
          <option value="quantity-desc">Highest to Lowest Quantity</option>
          <option value="price-asc">Lowest to Highest Price</option>
          <option value="price-desc">Highest to Lowest Price</option>
        </select>
      </div>

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
            <div
              className={`product-card ${
                product.quantity < 20 ? "low-quantity" : ""
              }`}
              key={product.id}
            >
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">Price: £{product.price}</p>
                <p className="product-quantity">Quantity: {product.quantity}</p>

                {/* Show Quantity Low message if quantity is less than 20 */}
                {product.quantity < 20 && (
                  <p className="low-quantity-message">Quantity Low, Restock!</p>
                )}

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
