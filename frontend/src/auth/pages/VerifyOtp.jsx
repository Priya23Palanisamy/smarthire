import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';

const VerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [regData, setRegData] = useState(null);

    useEffect(() => {
        const data = sessionStorage.getItem('regData');
        if (!data) {
            navigate('/register');
        } else {
            setRegData(JSON.parse(data));
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Step 1: Verify OTP
            await authService.verifyOtp(regData.email, otp);

            // Step 2: Perform Registration
            await authService.register(regData.username, regData.email, regData.password, regData.role);

            sessionStorage.removeItem('regData');
            alert('Registration successful! Redirecting to login...');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-100">
            <div className="card shadow-lg p-4" style={{ maxWidth: '400px', width: '100%', borderRadius: '15px' }}>
                <h2 className="text-center mb-4 text-primary fw-bold">SmartHire</h2>
                <h4 className="text-center mb-4">Verify OTP</h4>
                <p className="text-center text-muted">A verification code has been sent to <b>{regData?.email}</b></p>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="text"
                            className="form-control form-control-lg text-center"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            placeholder="000000"
                            maxLength="6"
                            style={{ letterSpacing: '8px', fontSize: '1.5rem' }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify & Complete Registration'}
                    </button>
                </form>
                <div className="text-center mt-4">
                    <button className="btn btn-link" onClick={() => navigate('/register')}>Change Email</button>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
