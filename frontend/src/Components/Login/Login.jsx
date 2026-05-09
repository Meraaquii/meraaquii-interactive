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

  function createSlug(text) {
    return text
      ?.toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authController.handleLogin(
        email,
        password,

        (user) => {
          console.log("LOGIN SUCCESS:", user);

          setLoading(false);

          localStorage.setItem("token", user.token);
          localStorage.setItem("user_type", String(user.user_type).trim());
          localStorage.setItem("user_id", user.user_id ?? user.id ?? "");
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...user,
              login_at: new Date().toISOString(),
            }),
          );

          toast.success(`Welcome, ${user.user_name}!`);

          const slug = createSlug(user.user_name);
          const userType = String(user.user_type).trim();

          console.log("Generated slug:", slug);
          console.log("User type:", userType);

          // A → device-list directly, C and S → dashboard home
          const path =
            userType === "A" ? `/${slug}/device-list` : `/${slug}/dashboard`;

          console.log("Navigating to:", path);
          navigate(path, { replace: true });
        },

        (message) => {
          console.error("LOGIN ERROR:", message);

          setLoading(false);
          setError(message);
          toast.error(message);
        },
      );
    } catch (err) {
      console.error("UNEXPECTED ERROR:", err);

      setLoading(false);
      setError("An unexpected error occurred.");
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
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
