import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm py-2">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/dashboard">
          <i className="bi bi-rocket-takeoff-fill me-2"></i>SmartHire
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/dashboard">
                <i className="bi bi-speedometer2 me-1"></i> Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/profile">
                <i className="bi bi-person-circle me-1"></i> My Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/profile/resume">
                <i className="bi bi-file-earmark-pdf me-1"></i> Resume
              </Link>
            </li>
          </ul>
          <div className="d-flex align-items-center gap-3">
            <span className="text-white small fw-bold">
              Hello, {user.username} ({user.roles?.[0]?.replace('ROLE_', '') || 'User'})
            </span>
            <button onClick={logout} className="btn btn-outline-light rounded-pill btn-sm px-3 fw-bold">
              <i className="bi bi-box-arrow-right me-1"></i> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
