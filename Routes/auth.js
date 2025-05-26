const express = require("express");
const router = express.Router();

const userController = require("../Controllers/userController");

// * login
router.post("/login", userController.login);
// * register
router.post("/register", userController.register);
// * request password reset (send OTP)
router.post("/request-password-reset", userController.requestPasswordReset);
// * logout
router.post("/logout", userController.logout);
// * reset password with OTP
router.put("/forgot-password", userController.resetPassword);
// * verify MFA
router.post("/verify-mfa", userController.verifyMFA);
// * resend MFA
router.post("/resend-mfa", userController.resendMFA);

module.exports = router;

