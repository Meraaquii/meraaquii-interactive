import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import logo from "../../assets/Logo.png";
import authController from "../../controllers/authController";
import toast from "react-hot-toast";

const ROLE_ROUTES = {
  A: "/admin/dashboard",
  C: "/dashboard",
  CU: "/customer/dashboard",
  S: "/salesman/dashboard",
};

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

    try {
      await authController.handleLogin(
        email,
        password,

        // onSuccess
        (user) => {
          setLoading(false);

          console.log("[Login] user object:", user);
          console.log("[Login] user_type:", JSON.stringify(user.user_type));

          // ── Store auth ───────────────────────────────────────────
          // Use token as the auth guard (not user_id which may be undefined)
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

          // ── Navigate ─────────────────────────────────────────────
          const userType = String(user.user_type).trim();
          const route = ROLE_ROUTES[userType];

          if (!route) {
            console.error("[Login] Unknown user_type:", userType);
            toast.error("Unknown account type. Contact support.");
            setLoading(false);
            return;
          }

          console.log("[Login] navigating to:", route);
          navigate(route, { replace: true });
        },

        // onError
        (message) => {
          setLoading(false);
          setError(message);
          toast.error(message);
        },
      );
    } catch (err) {
      setLoading(false);
      setError("An unexpected error occurred.");
      toast.error("Login failed. Please try again.");
      console.error("[Login] error:", err);
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
