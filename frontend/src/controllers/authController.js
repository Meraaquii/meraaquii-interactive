import authService from "../services/authService";

const authController = {
  handleLogin: async (email, password, onSuccess, onError) => {
    try {
      if (!email || !password) {
        onError("Email and password are required.");
        return;
      }

      const data = await authService.login(email, password);

      if (data.status === 1) {
        localStorage.setItem("user", JSON.stringify(data.user));
        onSuccess(data.user);
      } else {
        onError(data.message || "Login failed.");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Server error. Please try again.";
      onError(message);
    }
  },

  handleSignUp: async (formData, planId, onSuccess, onError) => {
    try {
      const {
        username,
        mobile,
        email,
        address,
        billingAddress,
        billingPincode,
        pincode,
        password,
        confirmPassword,
      } = formData;

      if (!username || !email || !password || !mobile) {
        onError("Please fill in all required fields.");
        return;
      }

      if (password !== confirmPassword) {
        onError("Passwords do not match.");
        return;
      }

      const payload = {
        user_type: "C", // default type: Client
        user_name: username,
        user_email: email,
        user_password: password,
        user_no: pincode,
        user_contact_no: mobile,
        user_address: address,
        billing_address: billingAddress,
        billing_pincode: billingPincode,
        subscription_plan: planId,
      };

      const data = await authService.signUp(payload);

      if (data.status === 1) {
        onSuccess(data.message);
      } else {
        onError(data.message || "Registration failed.");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Server error. Please try again.";
      onError(message);
    }
  },
};

export default authController;
