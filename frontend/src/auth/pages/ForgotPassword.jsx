import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: Reset
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await authService.forgotPassword(email);
            setMessage('OTP has been sent to your email');
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await authService.resetPassword(email, otp, newPassword);
            alert('Password reset successful!');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Reset failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-100">
            <div className="card shadow-lg p-4" style={{ maxWidth: '400px', width: '100%', borderRadius: '15px' }}>
                <h2 className="text-center mb-4 text-primary fw-bold">SmartHire</h2>
                <h4 className="text-center mb-4">{step === 1 ? 'Forgot Password?' : 'Reset Password'}</h4>

                {error && <div className="alert alert-danger">{error}</div>}
                {message && <div className="alert alert-success">{message}</div>}

                {step === 1 ? (
                    <form onSubmit={handleSendOtp}>
                        <div className="mb-3">
                            <label className="form-label">Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Enter your registered email"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                        <div className="text-center mt-3">
                            <Link to="/login">Back to Login</Link>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword}>
                        <div className="mb-3">
                            <label className="form-label">OTP</label>
                            <input
                                type="text"
                                className="form-control"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                placeholder="Enter 6-digit OTP"
                                maxLength="6"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                placeholder="Enter new password"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
