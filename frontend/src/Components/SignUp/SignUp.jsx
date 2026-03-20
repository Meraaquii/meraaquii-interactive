import React, { useState } from "react";
import "./SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/Logo.png";
import authController from "../../controllers/authController";
import toast from "react-hot-toast";

const plans = [
  {
    id: 1,
    title: "Subscription Plan 1",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    id: 2,
    title: "Subscription Plan 2",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    id: 3,
    title: "Subscription Plan 3",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
];

const SignUp = () => {
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    mobile: "",
    email: "",
    pincode: "",
    address: "",
    billingPincode: "",
    billingAddress: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    await authController.handleSignUp(
      formData,
      selectedPlan,
      (message) => {
        setLoading(false);
        setSuccess(message);
        toast.success(message);
        // Redirect to login after 2 seconds
        setTimeout(() => navigate("/"), 2000);
      },
      (message) => {
        setLoading(false);
        setError(message);
        toast.error(message);
      },
    );
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        {/* Logo */}
        <div className="logo-wrap">
          <img src={logo} alt="Logo" className="logo-img" />
        </div>

        <h2 className="page-title">Please Register.</h2>

        {error && <div className="error-banner">{error}</div>}
        {success && <div className="success-banner">{success}</div>}

        <div className="signup-form">
          {/* Username */}
          <div className="form-group full-width">
            <input
              type="text"
              name="username"
              placeholder="User Name*"
              value={formData.username}
              onChange={handleChange}
            />
            <span className="required-note">*Required field</span>
          </div>

          {/* Mobile + Email */}
          <div className="form-row">
            <div className="form-group">
              <input
                type="tel"
                name="mobile"
                placeholder="Mobile*"
                value={formData.mobile}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email*"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="section-label">Address</div>
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                name="pincode"
                placeholder="Pincode*"
                value={formData.pincode}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="address"
                placeholder="Address*"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Billing Address Section */}
          <div className="section-label">Billing Address</div>
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                name="billingPincode"
                placeholder="Billing Pincode*"
                value={formData.billingPincode}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="billingAddress"
                placeholder="Billing Address*"
                value={formData.billingAddress}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-row">
            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Password*"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password*"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Subscription Plans */}
          <p className="plans-label">Select your subscription Plan:</p>
          <div className="plans-row">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`plan-card ${selectedPlan === plan.id ? "selected" : ""}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <h4>{plan.title}</h4>
                <p>{plan.description}</p>
              </div>
            ))}
          </div>

          {/* Submit */}
          <button
            className="btn-signup"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Signing up..." : "SIGN UP"}
          </button>

          {/* Sign In */}
          <p className="signin-row">
            Already have an Account?{" "}
            <Link to="/" className="signin-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
