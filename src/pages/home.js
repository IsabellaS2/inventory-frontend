import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styling/home.css"; 

const HomePage = () => {
  const navigate = useNavigate();
  const [isTokenValid, setIsTokenValid] = useState(null); 

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000); 

    if (payload.exp < currentTime) {
      localStorage.removeItem("token"); 
      navigate("/login");
    } else {
      setIsTokenValid(true); 
    }
  }, [navigate]);

  if (isTokenValid === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-container">
      <h1>Products Skincare Inventory</h1>
      <p>Welcome to your inventory dashboard. What would you like to do?</p>

      <div className="home-cards">
        <div className="home-card" onClick={() => navigate("/add-product")}>
          <h2>Add Products</h2>
          <p>Add a new product to your inventory</p>
        </div>
        <div className="home-card" onClick={() => navigate("/products")}>
          <h2>View Products</h2>
          <p>View your existing products in the inventory</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
