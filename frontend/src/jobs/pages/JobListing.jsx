import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import jobService from '../services/jobService';
import { useAuth } from '../../auth/context/AuthContext';

const JobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filter state
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [experience, setExperience] = useState('');
  
  const { user } = useAuth();

  useEffect(() => {
    fetchJobs();
    if (user && !user.roles?.includes('ROLE_RECRUITER')) {
      fetchSavedJobIds();
    }
  }, [user]);

  const fetchJobs = async (searchParams = {}) => {
    setLoading(true);
    try {
      const response = await jobService.getActiveJobs(searchParams);
      setJobs(response.data);
    } catch (err) {
      setError('Failed to fetch job postings.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobIds = async () => {
    try {
      const response = await jobService.getSavedJobIds();
      setSavedJobIds(response.data);
    } catch (err) {
      // Ignored
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs({ keyword, location, jobType, experience });
  };

  const handleClearFilters = () => {
    setKeyword('');
    setLocation('');
    setJobType('');
    setExperience('');
    fetchJobs();
  };

  const toggleSaveJob = async (jobId) => {
    if (!user) {
      alert('Please log in as a Candidate to save jobs!');
      return;
    }
    
    if (user.roles?.includes('ROLE_RECRUITER')) {
      alert('Recruiters cannot save jobs!');
      return;
    }

    const isAlreadySaved = savedJobIds.includes(jobId);
    try {
      if (isAlreadySaved) {
        await jobService.unsaveJob(jobId);
        setSavedJobIds(savedJobIds.filter(id => id !== jobId));
      } else {
        await jobService.saveJob(jobId);
        setSavedJobIds([...savedJobIds, jobId]);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update saved job status.');
    }
  };

  return (
    <div className="container py-4">
      {/* Search Bar Section */}
      <div className="card border-0 shadow-sm rounded-3 p-4 mb-4 bg-white">
        <h3 className="fw-bold text-dark mb-3"><i className="bi bi-search text-primary me-2"></i>Find Your Dream Job</h3>
        <form onSubmit={handleSearchSubmit}>
          <div className="row g-2">
            <div className="col-lg-4 col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-light border-0"><i className="bi bi-briefcase text-muted"></i></span>
                <input
                  type="text"
                  className="form-control bg-light border-0"
                  placeholder="Keyword, title, skills or company..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-light border-0"><i className="bi bi-geo-alt text-muted"></i></span>
                <input
                  type="text"
                  className="form-control bg-light border-0"
                  placeholder="City or remote..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
            <div className="col-lg-2 col-md-6">
              <select
                className="form-select bg-light border-0"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
              >
                <option value="">Job Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div className="col-lg-2 col-md-6">
              <input
                type="text"
                className="form-control bg-light border-0"
                placeholder="Experience (e.g. 2 years)"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>
            <div className="col-lg-1 col-md-12 d-grid">
              <button type="submit" className="btn btn-primary fw-bold"><i className="bi bi-funnel-fill"></i></button>
            </div>
          </div>
          {(keyword || location || jobType || experience) && (
            <div className="mt-3 text-start">
              <button type="button" onClick={handleClearFilters} className="btn btn-sm btn-outline-secondary rounded-pill px-3">
                Clear Filters <i className="bi bi-x-circle ms-1"></i>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Main Container */}
      <div className="row">
        {/* Jobs list grid */}
        <div className="col-12">
          {error && <div className="alert alert-danger">{error}</div>}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Matching active job openings...</p>
            </div>
          ) : jobs.length > 0 ? (
            <div className="row g-3">
              {jobs.map((job) => (
                <div key={job.id} className="col-md-6 col-lg-4">
                  <div className="card h-100 shadow-sm border-0 rounded-3 p-3 bg-white position-relative hover-shadow" style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}>
                    
                    {/* Header info */}
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <span className="badge bg-primary-subtle text-primary mb-2 rounded-pill px-3 py-1 small">{job.jobType}</span>
                        <h5 className="fw-bold mb-1 text-dark text-truncate" style={{ maxWidth: '240px' }}>
                          <Link to={`/jobs/${job.id}`} className="text-decoration-none text-dark">{job.title}</Link>
                        </h5>
                        <h6 className="text-secondary small fw-semibold mb-0"><i className="bi bi-building me-1"></i>{job.companyName}</h6>
                      </div>
                      
                      {/* Saved Heart Button (only for candidate users) */}
                      {(!user || !user.roles?.includes('ROLE_RECRUITER')) && (
                        <button
                          onClick={() => toggleSaveJob(job.id)}
                          className="btn btn-light rounded-circle p-2 shadow-sm border-0"
                          style={{ width: '40px', height: '40px' }}
                        >
                          <i className={`bi ${savedJobIds.includes(job.id) ? 'bi-heart-fill text-danger' : 'bi-heart text-muted'}`}></i>
                        </button>
                      )}
                    </div>

                    <p className="text-muted small text-start mb-3" style={{ display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '60px' }}>
                      {job.description}
                    </p>

                    <div className="row text-start g-2 border-top pt-3 mt-auto">
                      <div className="col-6 small text-secondary">
                        <i className="bi bi-geo-alt me-1 text-muted"></i>{job.location || 'Not specified'}
                      </div>
                      <div className="col-6 small text-secondary">
                        <i className="bi bi-cash me-1 text-muted"></i>{job.salary || 'Competitive'}
                      </div>
                      <div className="col-12 small text-secondary text-truncate">
                        <i className="bi bi-lightbulb me-1 text-muted"></i>Skills: <span className="text-primary">{job.skills || 'Not specified'}</span>
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
            <div className="text-center py-5 bg-white shadow-sm rounded-3">
              <i className="bi bi-search-heart text-muted display-1"></i>
              <h4 className="fw-bold mt-3">No Jobs Found</h4>
              <p className="text-secondary">We couldn't find any job posts matching your criteria. Try adjusting your keyword or clearing filters.</p>
              <button type="button" onClick={handleClearFilters} className="btn btn-primary rounded-pill btn-sm px-4">
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListing;
