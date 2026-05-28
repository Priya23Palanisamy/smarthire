import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/pages/Login';
import Register from './auth/pages/Register';
import VerifyOtp from './auth/pages/VerifyOtp';
import ForgotPassword from './auth/pages/ForgotPassword';
import { useAuth } from './auth/context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;

    return children;
};

function App() {
    return (
        <div className="App">
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <div className="container mt-5">
                                <h1>Welcome to SmartHire Dashboard</h1>
                                <p>Authentication Module Successfully Implemented!</p>
                            </div>
                        </ProtectedRoute>
                    }
                />

                {/* Default Route */}
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </div>
    );
}

export default App;
