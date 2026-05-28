import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'USER'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.email || !formData.password) {
            setError('Please fill all fields first');
            return;
        }
        setError('');
        setLoading(true);
        try {
            await authService.sendOtp(formData.email);
            // Store registration data in session storage to use after OTP verification
            sessionStorage.setItem('regData', JSON.stringify(formData));
            navigate('/verify-otp');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-100">
            <div className="card shadow-lg p-4" style={{ maxWidth: '450px', width: '100%', borderRadius: '15px' }}>
                <h2 className="text-center mb-4 text-primary fw-bold">SmartHire</h2>
                <h4 className="text-center mb-4">Create Account</h4>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSendOtp}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            name="username"
                            className="form-control"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="Pick a unique username"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Choose a strong password"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Role</label>
                        <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
                            <option value="USER">Job Seeker</option>
                            <option value="RECRUITER">Recruiter</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
                        {loading ? 'Sending OTP...' : 'Send OTP & Register'}
                    </button>
                </form>
                <p className="text-center mt-4">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
