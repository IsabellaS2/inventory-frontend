import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import ProductsPage from "./pages/products/products-page";
import ProductDetailPage from "./pages/products/product-details";
import AddProductPage from "./pages/products/add-products";
import Login from "./pages/account/login";
import Register from "./pages/account/register";
import ErrorPage from "./pages/error-pages/login-error";
import Profile from "./pages/profile/profile";
import HomePage from "./pages/home";
import AddProductsError from "./pages/error-pages/access-control-error";
import AdminPanel from "./pages/profile/admin-panel";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/access-control-error" element={<AddProductsError />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="*" element={<ErrorPage />} />{" "}
        {/* Catch-all for undefined routes */}
      </Routes>
    </Router>
  );
};

export default App;
