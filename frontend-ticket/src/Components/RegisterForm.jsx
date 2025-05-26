import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from "../services/api";
import './RegisterForm.css';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '', // Changed from 'updateRole' to 'role' and made it empty
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const { name, email, password, confirmPassword, role } = formData; // Changed updateRole to role

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null); // Clear error when user types
    };

    const handleSubmit = async e => {
        e.preventDefault();

        // Validation
        if (!name || !email || !password) {
            setError('Please fill in all required fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (!role) {
            setError('Role is required');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Send registration request to backend using our authService
            // Changed updateRole to role in the request
            const response = await authService.register({ name, email, password, role });

            console.log("Full response:", response);
            console.log("Response data:", response.data);
            console.log("Token:", response.data.token);

            // Store token and user data
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Redirect to events page
            navigate('/');
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Registration failed. Please try again later.'
            );
            console.error('Registration error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-container">
                <div className="auth-header">
                    <h2>Create Account</h2>
                    <p>Join our community of event enthusiasts</p>
                </div>

                {error && (
                    <div className="auth-error">
                        <p>{error}</p>
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="form-control"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            placeholder="Create a password"
                            value={password}
                            onChange={handleChange}
                            minLength="6"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="form-control"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={handleChange}
                            minLength="6"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <select
                            id="role"
                            name="role"
                            className="form-control"
                            value={role}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select your role</option>
                            <option value="User">User</option>
                            <option value="Organizer">Organizer</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>

                    <div className="terms-check">
                        <input type="checkbox" id="terms" required />
                        <label htmlFor="terms">
                            I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className={`auth-button ${loading ? 'loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
                    </p>
                </div>
            </div>

            <div className="auth-image register-image">
                <div className="auth-overlay">
                    <h3>Join Our Community</h3>
                    <p>Create an account to discover, attend and organize amazing events.</p>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;