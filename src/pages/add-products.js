import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styling/add-products.css";

const AddProductPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
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
        if (response.status === 403 || !response.ok) {
          throw new Error("Unauthorized access");
        }
        return response.json();
      })
      .then((data) => {
        if (data.user.role !== "admin") {
          navigate("/access-control-error", {
            state: { user: "admins", message: "add" },
          });
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        navigate("/error");
      });
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (price < 0 || quantity < 0) {
      setError("Price and quantity cannot be negative.");
      return;
    }

    const newProduct = { name, price, quantity, description };
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/error");
      return;
    }

    fetch("https://inventory-backend-node.onrender.com/add-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newProduct),
    })
      .then((response) => {
        if (response.status === 403) {
          navigate("/error");
          throw new Error("Unauthorized: Invalid token");
        }
        if (!response.ok) {
          throw new Error("Failed to add product");
        }
        return response.json();
      })
      .then(() => {
        alert("Product added successfully!");
        navigate("/products");
      })
      .catch((error) => {
        setError(error.message || "Failed to add product");
        console.error("Error:", error);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="add-product-container">
      <h1>Add New Product</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Product Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="price">Price</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <label htmlFor="quantity">Quantity</label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>

        <button className="add-button" type="submit">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;
