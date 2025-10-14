import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import "../styles/register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    // Basic validation
    if (!username.trim()) {
      setErrors({ username: "Full name is required" });
      setIsLoading(false);
      return;
    }
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
    if (password.length < 6) {
      setErrors({ password: "Password must be at least 6 characters" });
      setIsLoading(false);
      return;
    }
    if (!confirmPassword.trim()) {
      setErrors({ confirmPassword: "Please confirm your password" });
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      setIsLoading(false);
      return;
    }


    try {
  const response = await fetch("http://localhost/Eaglonhytes/api/register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password: password.trim(),
        }),
        credentials: "include",
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response");
      }

      const data = await response.json();

      if (response.ok && data.success) {
        login(data.user);
        navigate("/");
      } else {
        if (data.errors) {
          setErrors(data.errors);
        }
        setMessage(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage(
        "Unable to connect to server. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="register-container">
      <h2 className="register-title">Create Your Account</h2>

      <form onSubmit={handleSubmit} className="register-form">
        {/* Branding */}
        <div className="register-brand">
          <img
            src="/assets/icon/logo.png"
            alt="Zinq Bridge"
            style={{ width: "40px", height: "40px" }}
          />
          <span>Ealonhytes</span>
        </div>

        {/* Error or Success Message */}
        {message && <p className="register-message">{message}</p>}

        {/* Full Name */}
        <div className="register-form-group">
          <label htmlFor="username">Full Name</label>
          <input
            id="username"
            type="text"
            className="register-form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your full name"
          />
          {errors.username && (
            <p className="register-error">{errors.username}</p>
          )}
        </div>

        {/* Email */}
        <div className="register-form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            className="register-form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          {errors.email && <p className="register-error">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="register-form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="register-form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          {errors.password && <p className="register-error">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div className="register-form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            className="register-form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <p className="register-error">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="register-btn-primary"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>

        {/* Footer */}
        <div className="register-footer">
          Already have an account? <a href="/login">Login here</a>
        </div>
      </form>

    </section>
  );
};

export default Register;
