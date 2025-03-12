import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../styling/add-products.css';  


const AddProductPage = () => {
  const navigate = useNavigate(); 
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProduct = {
      name,
      price,
      quantity,
      description,
    };

    fetch('https://inventory-backend-node.onrender.com/add-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    })
      .then((response) => response.json())
      .then((data) => {
        alert('Product added successfully!');
        navigate('/products');
      })
      .catch((error) => {
        setError('Failed to add product');
        console.error('Error:', error);
      });
  };

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

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProductPage;
