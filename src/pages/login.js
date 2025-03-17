import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styling/login.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const userCredentials = {
      email,
      password,
    };

    fetch("https://inventory-backend-node.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userCredentials),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Login successful!");
          localStorage.setItem("token", data.token);
          navigate("/products");
        } else {
          setError(data.message || "Failed to login.");
        }
      })
      .catch((error) => {
        setError("Failed to login");
        console.error("Error:", error);
      });
  };

  return (
    <div className="login-container">
      <h1>Login</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="submit-button" type="submit">
          Login
        </button>
      </form>

      <div>
        <p>
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
