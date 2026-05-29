import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import jobService from '../services/jobService';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const response = await jobService.getSavedJobs();
      setSavedJobs(response.data);
    } catch (err) {
      setError('Could not load saved jobs.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (jobId) => {
    try {
      await jobService.unsaveJob(jobId);
      setSavedJobs(savedJobs.filter(job => job.id !== jobId));
      alert('Job successfully removed from saved list.');
    } catch (err) {
      alert('Failed to remove job from saved list.');
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
            <i className="bi bi-heart-fill text-danger me-2"></i>My Saved Jobs
          </h4>
          <span className="badge bg-primary text-white rounded-pill px-3 py-2 small">{savedJobs.length} Saved</span>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {savedJobs.length > 0 ? (
          <div className="row g-3">
            {savedJobs.map((job) => (
              <div key={job.id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm border-0 rounded-3 p-3 bg-white hover-shadow position-relative" style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}>
                  
                  {/* Header */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <span className="badge bg-primary-subtle text-primary mb-2 rounded-pill px-2 py-1 small">{job.jobType}</span>
                      <h5 className="fw-bold mb-1 text-dark text-truncate" style={{ maxWidth: '240px' }}>
                        <Link to={`/jobs/${job.id}`} className="text-decoration-none text-dark">{job.title}</Link>
                      </h5>
                      <h6 className="text-secondary small fw-semibold mb-0"><i className="bi bi-building me-1"></i>{job.companyName}</h6>
                    </div>
                    
                    {/* Unsave Button */}
                    <button
                      onClick={() => handleUnsave(job.id)}
                      className="btn btn-light rounded-circle p-2 shadow-sm border-0"
                      style={{ width: '40px', height: '40px' }}
                    >
                      <i className="bi bi-heart-fill text-danger"></i>
                    </button>
                  </div>

                  <p className="text-muted small mb-3" style={{ display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '60px' }}>
                    {job.description}
                  </p>

                  <div className="row g-2 border-top pt-3 mt-auto">
                    <div className="col-6 small text-secondary">
                      <i className="bi bi-geo-alt me-1 text-muted"></i>{job.location || 'Not specified'}
                    </div>
                    <div className="col-6 small text-secondary">
                      <i className="bi bi-cash me-1 text-muted"></i>{job.salary || 'Competitive'}
                    </div>
                  </div>

                  <div className="mt-3">
                    <Link to={`/jobs/${job.id}`} className="btn btn-outline-primary w-100 rounded-pill btn-sm fw-bold py-2">
                      View Details & Apply
                    </Link>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <i className="bi bi-heart-break text-muted display-1"></i>
            <h5 className="fw-bold mt-3 text-dark">No Saved Jobs</h5>
            <p className="text-secondary small">You haven't saved any job postings yet. Go to Browse Jobs to start exploring!</p>
            <Link to="/profile" className="btn btn-primary rounded-pill btn-sm px-4">
              Browse Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
