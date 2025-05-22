import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/api';
import './ForgotPassword.css';

console.log('ForgotPassword component loading...'); // Debug line

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [step, setStep] = useState('email'); // email, otp, or success

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') setEmail(value);
        if (name === 'otp') setOtp(value);
        if (name === 'newPassword') setNewPassword(value);
        setError(null);
    };

    const handleRequestOTP = async (e) => {
        e.preventDefault();

        if (!email) {
            setError('Please enter your email address');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await authService.requestPasswordReset(email);
            setStep('otp');

        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Failed to send OTP. Please try again.'
            );
            console.error('OTP request error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!otp || !newPassword) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await authService.resetPassword({
                email,
                otp,
                newPassword
            });

            setStep('success');

        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Password reset failed. Please try again.'
            );
            console.error('Password reset error:', err);
        } finally {
            setLoading(false);
        }
    };

    const renderEmailStep = () => (
        <form className="auth-form" onSubmit={handleRequestOTP}>
            <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={handleChange}
                    required
                />
            </div>

            <button
                type="submit"
                className={`auth-button ${loading ? 'loading' : ''}`}
                disabled={loading}
            >
                {loading ? 'Sending...' : 'Send OTP'}
            </button>
        </form>
    );

    const renderOTPStep = () => (
        <form className="auth-form" onSubmit={handleResetPassword}>
            <div className="form-group">
                <label htmlFor="otp">Enter OTP</label>
                <input
                    type="text"
                    id="otp"
                    name="otp"
                    className="form-control"
                    placeholder="Enter the OTP sent to your email"
                    value={otp}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    className="form-control"
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={handleChange}
                    required
                />
            </div>

            <button
                type="submit"
                className={`auth-button ${loading ? 'loading' : ''}`}
                disabled={loading}
            >
                {loading ? 'Resetting...' : 'Reset Password'}
            </button>
        </form>
    );

    const renderSuccessStep = () => (
        <div className="success-message">
            <div className="success-icon">
                <i className="fa fa-check-circle"></i>
            </div>
            <h3>Password Reset Successful</h3>
            <p>
                Your password has been successfully reset.
                You can now login with your new password.
            </p>
            <div className="success-actions">
                <Link to="/login" className="btn btn-primary">
                    Back to Login
                </Link>
            </div>
        </div>
    );

    return (
        <div className="auth-container forgot-password-container">
            <div className="auth-form-container">
                <div className="auth-header">
                    <h2>Forgot Password</h2>
                    <p>
                        {step === 'email' && 'Enter your email to receive an OTP'}
                        {step === 'otp' && 'Enter the OTP sent to your email'}
                        {step === 'success' && 'Password reset successful'}
                    </p>
                </div>

                {error && (
                    <div className="auth-error">
                        <p>{error}</p>
                    </div>
                )}

                {step === 'email' && renderEmailStep()}
                {step === 'otp' && renderOTPStep()}
                {step === 'success' && renderSuccessStep()}

                {step !== 'success' && (
                    <div className="forgot-password-footer">
                        <p>
                            Remember your password? <Link to="/login" className="auth-link">Sign In</Link>
                        </p>
                    </div>
                )}
            </div>

            <div className="auth-image forgot-password-image">
                <div className="auth-overlay">
                    <h3>Password Recovery</h3>
                    <p>We'll help you get back into your account in no time.</p>
                </div>
            </div>
        </div>
    );
};

console.log('About to export ForgotPassword:', ForgotPassword); // Debug line
export default ForgotPassword;  