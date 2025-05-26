const nodemailer = require('nodemailer');

// Create a transporter using SMTP with the same email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'noorjjj2006@gmail.com',
        pass: 'crfj epkw eblp rata'
    }
});

// Generate a random 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send email with OTP
const sendOTPEmail = async (email, otp, isLoginVerification = false) => {
    const mailOptions = {
        from: 'noorjjj2006@gmail.com',
        to: email,
        subject: isLoginVerification ? 'Login Verification Code' : 'Password Reset OTP',
        text: isLoginVerification
            ? `Your login verification code is: ${otp}. It will expire in 10 minutes.`
            : `Your OTP is: ${otp}. It will expire in 5 minutes.`
    };

    await transporter.sendMail(mailOptions);
};

module.exports = {
    generateOTP,
    sendOTPEmail
}; 