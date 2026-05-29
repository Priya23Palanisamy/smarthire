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
import JobListing from './jobs/pages/JobListing';
import JobDetails from './jobs/pages/JobDetails';
import MyApplications from './jobs/pages/MyApplications';
import SavedJobs from './jobs/pages/SavedJobs';

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

// Dynamic Dashboard Redirect based on Role
const DashboardRedirect = () => {
    const { user } = useAuth();
    if (user?.roles?.includes("ROLE_RECRUITER")) {
        return <Navigate to="/recruiter/dashboard" replace />;
    }
    return <Navigate to="/jobs" replace />;
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
    path="/recruiter/edit-job/:id"
    element={
        <ProtectedRoute>
            <PostJob />
        </ProtectedRoute>
    }
/>

<Route
  path="/jobs/:id"
  element={
    <ProtectedRoute>
      <JobDetails />
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
            <DashboardRedirect />
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

                <Route
                    path="/jobs"
                    element={
                        <ProtectedRoute>
                            <JobListing />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/jobs/:id"
                    element={
                        <ProtectedRoute>
                            <JobDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/jobs/applications"
                    element={
                        <ProtectedRoute>
                            <MyApplications />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/jobs/saved"
                    element={
                        <ProtectedRoute>
                            <SavedJobs />
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
