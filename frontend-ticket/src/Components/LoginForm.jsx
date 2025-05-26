import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/api";
import MFAVerification from "./MFAVerification";
import "./LoginForm.css";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMFA, setShowMFA] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(location.state?.message || null);

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First step: Initial login attempt
      const response = await authService.login({ email, password });

      // If MFA is required, show the MFA verification component
      if (response.data.requireMFA) {
        setShowMFA(true);
      } else {
        // If MFA is not required, proceed with normal login
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/events");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Login failed. Please check your credentials and try again."
      );
      console.error("Login error:", err);
      setLoading(false);
    }
  };

  const handleMFASuccess = () => {
    setShowMFA(false);
    navigate("/events");
  };

  const handleMFACancel = () => {
    setShowMFA(false);
    setFormData({ email: "", password: "" });
  };

  if (showMFA) {
    return (
      <div className="auth-container">
        <MFAVerification
          email={email}
          onVerificationSuccess={handleMFASuccess}
          onCancel={handleMFACancel}
        />
        <div className="auth-image">
          <div className="auth-overlay">
            <h3>Secure Login</h3>
            <p>We're keeping your account safe with two-factor authentication.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account to continue</p>
        </div>

        {error && (
          <div className="auth-error">
            <p>{error}</p>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-action">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className={`auth-button ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      <div className="auth-image">
        <div className="auth-overlay">
          <h3>Discover Exciting Events</h3>
          <p>Join our community and experience amazing events around you.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;