import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styling/product-details.css";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);  
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
  });

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
          navigate("/error");
          throw new Error("Unauthorized access");
        }
        return response.json();
      })
      .then((data) => {
        setUserRole(data.user.role);
      })
      .catch((error) => {
        console.error("❌ Error fetching profile:", error);
        navigate("/error");
      });

    fetch(`https://inventory-backend-node.onrender.com/products/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 403 || response.status === 401) {
          navigate("/error");
          return;
        }
        return response.json();
      })
      .then((data) => {
        setProduct(data);
        setFormData({
          name: data.name,
          price: data.price,
          quantity: data.quantity,
          description: data.description,
        });
      })
      .catch((error) => {
        console.error("❌ Fetch error:", error);
        setError("Failed to fetch product.");
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/error");
      return;
    }

    fetch(`https://inventory-backend-node.onrender.com/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.status === 403) {
          navigate("/error");
          throw new Error("Unauthorized: Invalid token");
        }
        if (!response.ok) {
          throw new Error("Failed to update product.");
        }
        return response.json();
      })
      .then((data) => {
        alert("Product updated successfully");
        setProduct(data);
        navigate("/products");
      })
      .catch((error) => {
        alert("Error updating product: " + error.message);
        console.error("Update error:", error);
      });
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;
  
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/error");
      return;
    }
  
    fetch(`https://inventory-backend-node.onrender.com/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 403) {
          navigate("/error");
          throw new Error("Unauthorized: Invalid token");
        }
        if (!response.ok) {
          throw new Error("Failed to delete product.");
        }
        alert("Product deleted successfully");
        navigate("/products");
      })
      .catch((error) => {
        alert("Error deleting product: " + error.message);
        console.error("Delete error:", error);
      });
  };
  

  if (error) return <div className="error-message">{error}</div>;
  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-detail-container">
      <h1>{product.name}</h1>
      <p className="product-description">{product.description}</p>
      <p className="price">Price: £{product.price}</p>
      <p className="quantity">Quantity: {product.quantity}</p>

      <div className="form-container">
        <h2>Update Product</h2>
        <form onSubmit={handleUpdate}>
          <label htmlFor="name">Product Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product Name"
            required
          />

          <label htmlFor="price">Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            required
          />

          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            required
          />

          <label htmlFor="description">Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
          />

          <div className="buttons">
            <button type="submit" className="update-button">
              Update Product
            </button>

            {userRole === "admin" && (
              <button
                type="button"
                className="delete-button"
                onClick={handleDelete}
              >
                Delete Product
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductDetailPage;
