import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import ProductsPage from "./pages/products-page";
import ProductDetailPage from "./pages/product-details";
import AddProductPage from "./pages/add-products";
import Login from "./pages/login";
import Register from "./pages/register";
import ErrorPage from "./pages/error-page";
import Profile from "./pages/profile";
import './App.css';

const App = () => {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<h1>Welcome to the Home Page</h1>} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<ErrorPage />} /> {/* Catch-all for undefined routes */}

      </Routes>
    </Router>
  );
};

export default App;
