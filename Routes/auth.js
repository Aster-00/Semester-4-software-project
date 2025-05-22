const express = require("express");
const router = express.Router();

const userController = require("../Controllers/userController");

// * login
router.post("/login", userController.login);
// * register
router.post("/register", userController.register);
// * request password reset (send OTP)
router.post("/request-password-reset", userController.requestPasswordReset);
// * reset password with OTP
router.put("/forgot-password", userController.resetPassword);

module.exports = router;

