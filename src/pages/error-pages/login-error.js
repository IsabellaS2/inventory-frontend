import React from "react";
import { Link } from "react-router-dom";
import "../../styling/error-page.css";

const ErrorPage = () => {
  return (
    <div className="error-page-container">
      <h1>Oops! You need to be logged in</h1>
      <p>
        Sorry, to view the products, you need to be logged in. Why not{" "}
        <Link to="/login">log in</Link> or{" "}
        <Link to="/register">create an account</Link>?
      </p>
    </div>
  );
};

export default ErrorPage;
