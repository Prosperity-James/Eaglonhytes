import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext, useAuth } from '../context/AuthContext';
import api, { endpoints, ApiError } from '../utils/api';
import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");
    setIsLoading(true);

    if (!email.trim()) {
      setErrors({ email: "Email is required" });
      setIsLoading(false);
      return;
    }
    if (!password.trim()) {
      setErrors({ password: "Password is required" });
      setIsLoading(false);
      return;
    }


    try {
      // Attempt login via centralized API client
      const data = await api.post(endpoints.login, {
        email: email.trim(),
        password: password.trim(),
      });

      if (data.success) {
        login(data.user);
        navigate(data.user.is_admin ? "/admin" : "/");
      } else {
        if (data.errors) setErrors(data.errors);
        setMessage(data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("💥 Login error:", error);
      if (error instanceof ApiError) {
        setMessage(error.message || "Login failed.");
      } else {
        setMessage("Unable to connect to server. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="login-container">
      <h2 className="login-title">Login to Eaglonhytes Global Consults</h2>

      <form onSubmit={handleSubmit} className="login-form">
        {/* Branding */}
        <div className="login-brand">
          <img
            src="/assets/icon/logo.png"
            alt="Zinq Bridge"
            style={{ width: "40px", height: "40px" }}
          />
          <span>Eaglonhytes</span>
        </div>

        {/* Error or Success Message */}
        {message && <p className="login-message">{message}</p>}

        {/* Email */}
        <div className="login-form-group">
          <label htmlFor="email">Enter Your Email</label>
          <input
            id="email"
            type="text"
            className="login-form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          {errors.email && <p className="login-error">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="login-form-group">
          <label htmlFor="password">Enter Your Password</label>
          <input
            id="password"
            type="password"
            className="login-form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          {errors.password && <p className="login-error">{errors.password}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="login-btn-primary"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {/* Footer */}
        <div className="login-footer">
          Don’t have an account? <a href="/register">Register here</a>
        </div>
      </form>

    </section>
  );
};

export default Login;
