import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import './LoginForm.css';

const MFAVerification = ({ email, onVerificationSuccess, onCancel }) => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setOtp(e.target.value);
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!otp) {
            setError('Please enter the verification code');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await authService.verifyMFA({ email, otp });

            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(response.data.user));

            onVerificationSuccess();
            navigate('/events');
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Verification failed. Please check your code and try again.'
            );
            console.error('MFA verification error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-form-container">
            <div className="auth-header">
                <h2>Two-Factor Authentication</h2>
                <p>Please enter the verification code sent to your email</p>
            </div>

            {error && (
                <div className="auth-error">
                    <p>{error}</p>
                </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="otp">Verification Code</label>
                    <input
                        type="text"
                        id="otp"
                        name="otp"
                        className="form-control"
                        placeholder="Enter the 6-digit code"
                        value={otp}
                        onChange={handleChange}
                        maxLength="6"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className={`auth-button ${loading ? 'loading' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Verifying...' : 'Verify Code'}
                </button>

                <button
                    type="button"
                    className="auth-button secondary"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default MFAVerification; 