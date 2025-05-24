const userModel = require('../Models/user');
const eventModel = require("../Models/Event");
const organizerModel = require('../Models/Organizer');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const secretkey = process.env.secretkey;
const nodemailer = require("nodemailer");
const { generateOTP, sendOTPEmail } = require("../utils/emailService");

const otpStore = new Map(); // Store: email -> { otp, hashedPassword, expiresAt }

const userController = {
  register: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      const existingUser = await userModel.findOne({ email })
      if (existingUser) {
        return res.status(409).json({ message: "user already exists" });
      }
      const hashPassword = await bcrypt.hash(password, 10);

      const newUser = new userModel({
        name,
        email,
        password: hashPassword,
        role,
      });
      await newUser.save();
      res.status(201).json({ message: "user registered successfully" });
    }
    catch (error) {
      console.error("error registering user:", error);
      res.status(500).json({ message: "error registering user" });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find the user by email
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Email not found" });
      }

      // Check if the password is correct
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Incorrect password" });
      }

      // Generate and send MFA code
      const mfaCode = generateOTP();
      const mfaCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Save MFA code to user
      user.mfaCode = mfaCode;
      user.mfaCodeExpires = mfaCodeExpires;
      await user.save();

      try {
        // Send MFA code via email with isLoginVerification flag set to true
        await sendOTPEmail(email, mfaCode, true);

        // Return success response without token
        return res.status(200).json({
          message: "Please verify your login with the code sent to your email",
          requireMFA: true,
          user: {
            email: user.email
          }
        });
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        return res.status(500).json({ message: "Failed to send verification code" });
      }

    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({
        message: "Server error during login",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  logout: async (req, res) => {
    try {
      // Clear the token cookie
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "lax"
      });

      return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Error logging out:", error);
      return res.status(500).json({ message: "Error during logout" });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await userModel.find();
      console.log("success");
      return res.status(200).json(users);

    }
    catch (error) {
      return res.status(500).json({ message: error.message });
    }

  },


  updateUser: async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await userModel.findByIdAndUpdate(
        userId,
        {
          name: req.body.name,
          email: req.body.email,
          profilePicture: req.profilePicture
        },
        {
          new: true,
        }
      );
      return res.status(200).json({ user, msg: "User updated successfully" });

    }
    catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getUserEvents: async (req, res) => {
    try {
      const userID = req.user._id;
      const events = await eventModel.find({ participants: userID })
      if (events.length == 0) {
        return res.status(200).json({ message: "no events found for the user" });
      }
      return res.status(200).json(events);
    }
    catch (error) {
      return res.status(500).json({ message: "error getting events" });
    }
  },
  getUserById: async (req, res) => {
    try {
      const user = await userModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: 'error', message: error.message });
    }
  },

  getUserEvents: async (req, res) => {
    try {
      const userID = req.user._id;
      const events = await eventModel.find({ participants: userID })
      if (events.length == 0) {
        return res.status(200).json({ message: "no events found for the user" });
      }
      return res.status(200).json(events);
    }
    catch (error) {
      return res.status(500).json({ message: "error getting events" });
    }
  },


  getUserProfile: async (req, res) => {
    try {
      const userId = req.user._id;

      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user });
    } catch (error) {
      console.error("Error in getUserProfile:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
      await userModel.findByIdAndDelete(userId); // ← here is where it's failing

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }



  },



  forgotPassword: async (req, res) => {
    try {
      const { email, newPassword, otp } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required." });
      }

      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Step 1: No OTP yet → generate + send it
      if (!otp && newPassword) {
        const code = generateOTP();
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const expiresAt = Date.now() + 5 * 60 * 1000;

        otpStore.set(email, { otp: code, hashedPassword, expiresAt });

        await sendOTPEmail(email, code);
        return res.status(200).json({ message: "OTP sent to email." });
      }

      // Step 2: OTP is provided → verify and update password
      const record = otpStore.get(email);
      if (!record) {
        return res.status(400).json({ message: "No OTP request found." });
      }

      if (Date.now() > record.expiresAt) {
        otpStore.delete(email);
        return res.status(400).json({ message: "OTP expired." });
      }

      if (otp !== record.otp) {
        return res.status(400).json({ message: "Invalid OTP." });
      }

      user.password = record.hashedPassword;
      await user.save();
      otpStore.delete(email);

      return res.status(200).json({ message: "Password successfully reset." });
    } catch (error) {
      console.error("Forgot Password Error:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  },

  updateRole: async (req, res) => {
    try {
      const newRole = req.newRole

      if (!newRole) return res.status(400).message("Empty role")

      const user = await UserModel.findByIdAndUpdate(req.params.id,

        {
          role: req.body.role
        },
        {
          new: true,
        }
      );
      return res.status(200).message("Role Updated Successfully")

    }
    catch (err) {
      return res.status(500).json({ message: error.message });
    }
  },

  requestPasswordReset: async (req, res) => {
    try {
      const { email } = req.body;

      // Check if user exists
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate OTP
      const otp = generateOTP();

      // Store OTP with expiration (5 minutes)
      otpStore.set(email, {
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
      });

      // Send OTP email
      await sendOTPEmail(email, otp);

      res.status(200).json({ message: "OTP sent successfully to your email" });
    } catch (error) {
      console.error("Error in requestPasswordReset:", error);
      res.status(500).json({ message: "Failed to send OTP" });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;

      // Verify OTP
      const storedData = otpStore.get(email);
      if (!storedData) {
        return res.status(400).json({ message: "No OTP request found" });
      }

      if (Date.now() > storedData.expiresAt) {
        otpStore.delete(email);
        return res.status(400).json({ message: "OTP has expired" });
      }

      if (storedData.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      // Find user and update password
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      // Clear OTP
      otpStore.delete(email);

      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      console.error("Error in resetPassword:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  },

  verifyMFA: async (req, res) => {
    try {
      const { email, otp } = req.body;

      // Find user and verify OTP
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if OTP is valid and not expired
      if (!user.mfaCode || !user.mfaCodeExpires || user.mfaCode !== otp) {
        return res.status(401).json({ message: "Invalid verification code" });
      }

      if (new Date() > user.mfaCodeExpires) {
        return res.status(401).json({ message: "Verification code has expired" });
      }

      // Clear MFA code
      user.mfaCode = null;
      user.mfaCodeExpires = null;
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        {
          user: {
            _id: user._id,
            role: user.role,
            email: user.email
          }
        },
        secretkey,
        { expiresIn: '1h' }
      );

      // Set cookie expiration
      const cookieExpiration = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Send the response with token
      return res
        .cookie("token", token, {
          expires: cookieExpiration,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: "lax",
        })
        .status(200)
        .json({
          message: "Login successful",
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });

    } catch (error) {
      console.error("Error verifying MFA:", error);
      res.status(500).json({
        message: "Server error during MFA verification",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  resendMFA: async (req, res) => {
    try {
      const { email } = req.body;

      // Find the user
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate new MFA code
      const mfaCode = generateOTP();
      const mfaCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Save new MFA code
      user.mfaCode = mfaCode;
      user.mfaCodeExpires = mfaCodeExpires;
      await user.save();

      try {
        // Send new MFA code via email with isLoginVerification flag set to true
        await sendOTPEmail(email, mfaCode, true);
        return res.status(200).json({
          message: "New verification code sent successfully"
        });
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        return res.status(500).json({ message: "Failed to send verification code" });
      }

    } catch (error) {
      console.error("Error resending MFA code:", error);
      res.status(500).json({
        message: "Server error while resending verification code",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = userController;
