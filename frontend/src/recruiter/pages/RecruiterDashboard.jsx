import React, { useEffect, useState } from "react";
import recruiterService from "../services/recruiterService";
import { Link } from "react-router-dom";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const jobsRes = await recruiterService.getMyJobs();
      const appRes = await recruiterService.getApplications();
      setJobs(jobsRes.data);
      setApplications(appRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const activeJobs = jobs.filter(job => job.active).length;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 text-start">
      {/* Header Section */}
      <div className="card border-0 shadow-sm rounded-3 p-4 mb-4 bg-white">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h2 className="fw-bold text-dark mb-1">Recruiter Command Centre</h2>
            <p className="text-secondary mb-0">Publish openings, manage candidates, and track hires from a central deck.</p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/recruiter/post-job" className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">
              <i className="bi bi-plus-lg me-2"></i>Post New Job
            </Link>
            <Link to="/recruiter/jobs" className="btn btn-outline-secondary rounded-pill px-4 fw-bold">
              <i className="bi bi-gear-fill me-2"></i>Manage Jobs
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded-3 p-4 bg-white h-100 position-relative overflow-hidden" style={{ borderLeft: '5px solid #4361ee' }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted small fw-bold text-uppercase mb-2">Total Posted Jobs</h6>
                <h2 className="fw-extrabold mb-0 text-dark display-5">{jobs.length}</h2>
              </div>
              <div className="bg-primary-subtle text-primary rounded-circle p-3 fs-3">
                <i className="bi bi-briefcase-fill"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded-3 p-4 bg-white h-100 position-relative overflow-hidden" style={{ borderLeft: '5px solid #4cc9f0' }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted small fw-bold text-uppercase mb-2">Active Job Openings</h6>
                <h2 className="fw-extrabold mb-0 text-dark display-5">{activeJobs}</h2>
              </div>
              <div className="bg-info-subtle text-info rounded-circle p-3 fs-3">
                <i className="bi bi-eye-fill"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded-3 p-4 bg-white h-100 position-relative overflow-hidden" style={{ borderLeft: '5px solid #3f37c9' }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted small fw-bold text-uppercase mb-2">Total Applicants</h6>
                <h2 className="fw-extrabold mb-0 text-dark display-5">{applications.length}</h2>
              </div>
              <div className="bg-secondary-subtle text-secondary rounded-circle p-3 fs-3">
                <i className="bi bi-people-fill"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links / Actions */}
      <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
        <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">
          <i className="bi bi-grid-fill text-primary me-2"></i>Console Operations
        </h5>
        <div className="row g-3">
          <div className="col-md-6 col-lg-3">
            <Link to="/recruiter/profile" className="text-decoration-none">
              <div className="card h-100 p-4 border rounded hover-shadow bg-light-subtle text-center text-dark">
                <i className="bi bi-building fs-1 text-primary mb-3"></i>
                <h6 className="fw-bold mb-1">Company Profile</h6>
                <span className="small text-muted">Update logo, site, description</span>
              </div>
            </Link>
          </div>

          <div className="col-md-6 col-lg-3">
            <Link to="/recruiter/applications" className="text-decoration-none">
              <div className="card h-100 p-4 border rounded hover-shadow bg-light-subtle text-center text-dark">
                <i className="bi bi-file-earmark-check fs-1 text-success mb-3"></i>
                <h6 className="fw-bold mb-1">Manage Applications</h6>
                <span className="small text-muted">Shortlist or reject candidates</span>
              </div>
            </Link>
          </div>

          <div className="col-md-6 col-lg-3">
            <Link to="/recruiter/post-job" className="text-decoration-none">
              <div className="card h-100 p-4 border rounded hover-shadow bg-light-subtle text-center text-dark">
                <i className="bi bi-file-earmark-plus fs-1 text-info mb-3"></i>
                <h6 className="fw-bold mb-1">Post Job Opening</h6>
                <span className="small text-muted">Create a new search listing</span>
              </div>
            </Link>
          </div>

          <div className="col-md-6 col-lg-3">
            <Link to="/recruiter/jobs" className="text-decoration-none">
              <div className="card h-100 p-4 border rounded hover-shadow bg-light-subtle text-center text-dark">
                <i className="bi bi-list-task fs-1 text-warning mb-3"></i>
                <h6 className="fw-bold mb-1">Manage Listings</h6>
                <span className="small text-muted">Toggle statuses, edit openings</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;