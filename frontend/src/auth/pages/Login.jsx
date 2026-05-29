import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ usernameOrEmail: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await authService.login(formData.usernameOrEmail, formData.password);
            login(data);
            console.log(data)
            if(data.roles[0] ==="ROLE_RECRUITER")
            {
                navigate('/recruiter/dashboard');
            }
            else{
                navigate('/dashboard');
            }
            
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-100">
            <div className="card shadow-lg p-4" style={{ maxWidth: '400px', width: '100%', borderRadius: '15px' }}>
                <h2 className="text-center mb-4 text-primary fw-bold">SmartHire</h2>
                <h4 className="text-center mb-4">Login</h4>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Username or Email</label>
                        <input
                            type="text"
                            name="usernameOrEmail"
                            className="form-control"
                            value={formData.usernameOrEmail}
                            onChange={handleChange}
                            required
                            placeholder="Enter username or email"
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
                            placeholder="Enter password"
                        />
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                        <Link to="/forgot-password" style={{ fontSize: '0.9rem' }}>Forgot Password?</Link>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="text-center mt-4">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
