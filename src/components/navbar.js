import React from "react";
import { Link } from "react-router-dom";
import "../styling/navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/products">Products</Link>
        </li>
        <li>
          <Link to="/add-product">Add Product</Link>
        </li>

        {/* Add more links here */}
      </ul>
    </nav>
  );
};

export default Navbar;
