import React from 'react';
import { Routes, Route, Navigate , Link} from 'react-router-dom';
import Login from './auth/pages/Login';
import Register from './auth/pages/Register';
import VerifyOtp from './auth/pages/VerifyOtp';
import ForgotPassword from './auth/pages/ForgotPassword';
import { useAuth } from './auth/context/AuthContext';
import MyProfile from './profile/pages/MyProfile';
import EditProfile from './profile/pages/EditProfile';
import ResumeUpload from './profile/pages/ResumeUpload';
import Navbar from './shared/Navbar';
import RecruiterDashboard from "./recruiter/pages/RecruiterDashboard";
import RecruiterProfile from "./recruiter/pages/RecruiterProfile";
import PostJob from "./recruiter/pages/PostJob";
import ManageJobs from "./recruiter/pages/ManageJobs";
import ManageApplications from "./recruiter/pages/ManageApplications";
import RecruiterNavbar from "./recruiter/pages/RecruiterNavbar";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
    if (!user) return <Navigate to="/login" />;
    const isRecruiter = user.roles?.includes("ROLE_RECRUITER");
    

    return (
        <>
            {isRecruiter ? <RecruiterNavbar /> : <Navbar />}
            {children}
        </>
    );
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
    path="/recruiter/dashboard"
    element={
        <ProtectedRoute>
            <RecruiterDashboard />
        </ProtectedRoute>
    }
/>

<Route
    path="/recruiter/profile"
    element={
        <ProtectedRoute>
            <RecruiterProfile />
        </ProtectedRoute>
    }
/>

<Route
    path="/recruiter/post-job"
    element={
        <ProtectedRoute>
            <PostJob />
        </ProtectedRoute>
    }
/>

<Route
    path="/recruiter/jobs"
    element={
        <ProtectedRoute>
            <ManageJobs />
        </ProtectedRoute>
    }
/>

<Route
    path="/recruiter/applications"
    element={
        <ProtectedRoute>
            <ManageApplications />
        </ProtectedRoute>
    }
/>
                <Route
    path="/dashboard"
    element={
        <ProtectedRoute>
            <div className="container mt-5">
                <div className="card shadow p-4 rounded-3 text-center border-0 bg-white">
                    <h1 className="fw-bold text-primary mb-3">
                        Welcome to SmartHire Dashboard
                    </h1>

                    <p className="text-secondary mb-4">
                        Authentication & Profile modules are completely implemented!
                    </p>

                    <div className="row mt-4">
                        <div className="col-md-4">
                            <Link to="/profile" className="text-decoration-none">
                            <div className="card p-3 shadow-sm">
                                <h5>Profile Completion</h5>
                                <p>Manage your profile details</p>
                            </div>
                            </Link>
                        </div>

                        <div className="col-md-4">
                            <Link to="/profile" className="text-decoration-none">
                            <div className="card p-3 shadow-sm">
                                <h5>Resume</h5>
                                <p>Upload and manage resumes</p>
                            </div>
                            </Link>
                        </div>

                        <div className="col-md-4">
                            <Link to="/profile" className="text-decoration-none">
                            <div className="card p-3 shadow-sm">
                                <h5>Skills</h5>
                                <p>Manage technical skills</p>
                            </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    }
/>
                
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <MyProfile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile/edit"
                    element={
                        <ProtectedRoute>
                            <EditProfile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile/resume"
                    element={
                        <ProtectedRoute>
                            <ResumeUpload />
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
