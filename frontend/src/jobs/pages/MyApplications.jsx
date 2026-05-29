import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import jobService from '../services/jobService';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await jobService.getMyApplications();
      setApplications(response.data);
    } catch (err) {
      setError('Could not load application history.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPLIED':
        return <span className="badge bg-secondary-subtle text-secondary rounded-pill px-3 py-1 fw-bold">Applied</span>;
      case 'SHORTLISTED':
        return <span className="badge bg-warning-subtle text-warning rounded-pill px-3 py-1 fw-bold">Shortlisted</span>;
      case 'INTERVIEW_SCHEDULED':
        return <span className="badge bg-info-subtle text-info rounded-pill px-3 py-1 fw-bold">Interview Scheduled</span>;
      case 'REJECTED':
        return <span className="badge bg-danger-subtle text-danger rounded-pill px-3 py-1 fw-bold">Rejected</span>;
      case 'SELECTED':
        return <span className="badge bg-success-subtle text-success rounded-pill px-3 py-1 fw-bold">Selected</span>;
      default:
        return <span className="badge bg-light text-dark rounded-pill px-3 py-1 fw-bold">{status}</span>;
    }
  };

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
      <div className="card shadow-sm border-0 rounded-3 p-4 bg-white">
        <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
          <h4 className="fw-bold mb-0 text-primary">
            <i className="bi bi-file-earmark-check me-2"></i>My Job Applications
          </h4>
          <span className="badge bg-primary text-white rounded-pill px-3 py-2 small">{applications.length} Total</span>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {applications.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col">Job Title</th>
                  <th scope="col">Company</th>
                  <th scope="col">Job Type</th>
                  <th scope="col">Applied On</th>
                  <th scope="col" className="text-center">Status</th>
                  <th scope="col" className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <Link to={`/jobs/${app.job.id}`} className="fw-bold text-dark text-decoration-none">
                        {app.job.title}
                      </Link>
                      <span className="d-block small text-muted"><i className="bi bi-geo-alt me-1"></i>{app.job.location}</span>
                    </td>
                    <td className="fw-semibold text-secondary">{app.job.companyName}</td>
                    <td><span className="badge bg-light text-primary border border-primary-subtle rounded-pill px-2">{app.job.jobType}</span></td>
                    <td className="small text-muted">{new Date(app.appliedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td className="text-center">{getStatusBadge(app.status)}</td>
                    <td className="text-center">
                      <Link to={`/jobs/${app.job.id}`} className="btn btn-outline-primary btn-sm rounded-pill px-3">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-5">
            <i className="bi bi-journal-x text-muted display-1"></i>
            <h5 className="fw-bold mt-3 text-dark">No Applications Yet</h5>
            <p className="text-secondary small">You haven't submitted any job applications yet. Go to Browse Jobs to start applying!</p>
            <Link to="/profile" className="btn btn-primary rounded-pill btn-sm px-4">
              Browse Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
