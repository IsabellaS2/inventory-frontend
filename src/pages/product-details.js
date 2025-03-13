import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styling/product-details.css";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
  });

  useEffect(() => {
    fetch(`https://inventory-backend-node.onrender.com/products/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);
        setFormData({
          name: data.name,
          price: data.price,
          quantity: data.quantity,
          description: data.description,
        });
      })
      .catch((error) => setError("Failed to fetch product."));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    fetch(`https://inventory-backend-node.onrender.com/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Product updated successfully");
        setProduct(data);
        navigate(`/products`);
      })
      .catch((error) => {
        alert("Failed to update product");
        console.error(error);
      });
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmDelete) {
      fetch(`https://inventory-backend-node.onrender.com/products/${id}`, {
        method: "DELETE",
      })
        .then(() => {
          alert("Product deleted successfully");
          navigate("/products");
        })
        .catch((error) => {
          alert("Failed to delete product");
          console.error(error);
        });
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-detail-container">
      <h1>{product.name}</h1>
      <p className="product-description">{product.description}</p>
      <p className="price">Price: £{product.price}</p>
      <p className="quantity">Quantity: {product.quantity}</p>

      <div className="form-container">
        <h2>Update Product</h2>
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product Name"
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
          />
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Quantity"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
          />
          <div className="buttons">
            <button type="submit" className="update-button">
              Update Product
            </button>
            <button
              type="button"
              className="delete-button"
              onClick={handleDelete}
            >
              Delete Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductDetailPage;
