const userModel = require("../models/userModel");
const { hashPassword, comparePassword } = require("../utils/hash.js");
//const { generateOTP } = require("../utils/otp");
//const sendOTPEmail = require("../utils/sendEmail");

//const otpStore = {}; // temporary storage

// SIGNUP
const signUp = async (req, res) => {
  try {
    const {
      user_type,
      user_name,
      user_password,
      user_email,
      user_no,
      user_contact_no,
      user_address,
    } = req.body;

    if (!user_type || !user_name || !user_password || !user_email) {
      return res.status(400).json({
        status: 0,
        message: "Required fields missing",
      });
    }

    const existingUser = await userModel.findUserByEmail(user_email);

    if (existingUser) {
      return res.status(409).json({
        status: 0,
        message: "Email already registered",
      });
    }

    const hashedPassword = await hashPassword(user_password);

    const userId = await userModel.createUser({
      user_type,
      user_name,
      user_password: hashedPassword,
      user_email,
      user_no,
      user_contact_no,
      user_address,
    });

    res.status(201).json({
      status: 1,
      message: "User registered successfully.",
      userId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 0,
      message: "Server Error",
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { user_email, user_password } = req.body;

    if (!user_email || !user_password) {
      return res
        .status(400)
        .json({ status: 0, message: "Email and password required" });
    }

    const user = await userModel.findUserByEmail(user_email);

    if (!user) {
      return res
        .status(401)
        .json({ status: 0, message: "Invalid email or password" });
    }

    const match = await comparePassword(user_password, user.user_password);

    if (!match) {
      return res
        .status(401)
        .json({ status: 0, message: "Invalid email or password" });
    }

    const isAdmin = user.user_type === "A";

    if (!isAdmin && user.user_status !== "A") {
      return res.status(403).json({
        status: 0,
        message: "Account is pending approval. Please contact administrator.",
      });
    }

    delete user.user_password;

    if (user.user_type === "C") {
      const clientId = await userModel.findClientIdByEmail(user.user_email);
      user.client_id = clientId;
    }

    res.json({ status: 1, message: "Login successful", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 0, message: "Server Error" });
  }
};

// ADMIN ACTIVATE USER
const activateUser = async (req, res) => {
  try {
    const { user_email } = req.body;

    console.log("Received email:", user_email);

    if (!user_email) {
      return res.status(400).json({
        status: 0,
        message: "Email required",
      });
    }

    const updated = await userModel.activateUser(user_email);

    console.log("Rows updated:", updated);

    console.log("UPDATE:", updated);

    if (updated === 0) {
      return res.json({
        status: 0,
        message: "User not found",
      });
    }

    res.json({
      status: 1,
      message: "User activated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 0,
      message: "Server error",
    });
  }
};

const logout = async (req, res) => {
  try {
    res.status(200).json({
      status: 1,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      status: 0,
      message: "Server error during logout",
    });
  }
};

// VERIFY OTP

// const verifyOTP = async (req, res) => {
//   try {
//     const { user_email, otp } = req.body;

//     const data = otpStore[user_email];

//     if (!data) {
//       return res.status(400).json({
//         status: 0,
//         message: "OTP expired or not requested",
//       });
//     }

//     if (Date.now() > data.expires) {
//       delete otpStore[user_email];

//       return res.status(400).json({
//         status: 0,
//         message: "OTP expired",
//       });
//     }

//     if (data.otp !== otp) {
//       return res.status(400).json({
//         status: 0,
//         message: "Invalid OTP",
//       });
//     }

//     const user = data.user;

//     delete user.user_password;
//     delete otpStore[user_email];

//     res.json({
//       status: 1,
//       message: "Login successful",
//       user,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       status: 0,
//       message: "Server Error",
//     });
//   }
// };

module.exports = {
  signUp,
  login,
  activateUser,
  logout,
};
