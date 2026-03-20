import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import logo from "../../assets/Logo.png";
import authController from "../../controllers/authController";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    await authController.handleLogin(
      email,
      password,
      (user) => {
        setLoading(false);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", user.token);
        localStorage.setItem("user_type", user.user_type);
        toast.success("Login successful!");
        if (user.user_type === "A") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      },
      (message) => {
        setLoading(false);
        setError(message);
        toast.error(message);
      },
    );
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Logo */}
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-img" />
        </div>

        <h2 className="login-heading">Login</h2>

        {error && <div className="error-banner">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="username@gmail.com"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <div className="forgot">
            <Link to="#">Forgot Password?</Link>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="register">
          Don't have an account yet? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
