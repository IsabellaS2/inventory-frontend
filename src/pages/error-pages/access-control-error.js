import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const message = location.state?.message || "Access Denied";
  const user = location.state?.user || "Access Denied";

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/");
    }, 4000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="error-page-container">
      <h1>Access Denied</h1>
      <p>Sorry, but only {user} can {message} products.</p>
      <p>Please reach out to your admin for assistance.</p>
      <p>You will be redirected shortly...</p>
    </div>
  );
};

export default ErrorPage;
