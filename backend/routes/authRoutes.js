const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers.js");

router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.post("/activate-user", authController.activateUser);
router.post("/logout", authController.logout);
router.post("/change-password", authController.updatePassword);
router.post("/change-email", authController.updateEmail);

module.exports = router;
