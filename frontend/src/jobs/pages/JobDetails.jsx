import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import jobService from '../services/jobService';
import { useAuth } from '../../auth/context/AuthContext';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasApplied, setHasApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyBox, setShowApplyBox] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await jobService.getJobById(id);
      setJob(response.data);
      if (user && !user.roles?.includes('ROLE_RECRUITER')) {
        checkApplicationStatus(response.data.id);
      }
    } catch (err) {
      setError('Job details could not be retrieved.');
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async (jobId) => {
    try {
      const response = await jobService.getMyApplications();
      const alreadyApplied = response.data.some(app => app.job.id === jobId);
      setHasApplied(alreadyApplied);
    } catch (err) {
      // Ignored
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in as a Job Seeker to apply!');
      navigate('/login');
      return;
    }

    if (user.roles?.includes('ROLE_RECRUITER')) {
      alert('Recruiters cannot apply for job postings!');
      return;
    }

    if (!coverLetter.trim()) {
      alert('Cover Letter is required!');
      return;
    }

    setSubmitting(true);
    try {
      await jobService.applyForJob(job.id, { coverLetter });
      setHasApplied(true);
      setShowApplyBox(false);
      alert('Your job application has been successfully submitted!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
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

  if (error || !job) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger">{error || 'Job posting not found.'}</div>
        <Link to="/profile" className="btn btn-primary">Back to Listings</Link>
      </div>
    );
  }

  return (
    <div className="container py-4 text-start">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 rounded-3 p-4 mb-4 bg-white">
            
            {/* Header info */}
            <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-4">
              <div>
                <span className="badge bg-primary-subtle text-primary mb-2 rounded-pill px-3 py-1 fw-bold">{job.jobType}</span>
                <h2 className="fw-bold text-dark mb-1">{job.title}</h2>
                <h5 className="text-secondary fw-semibold mb-2">
                  <i className="bi bi-building me-1"></i> {job.companyName}
                </h5>
                <div className="d-flex gap-3 text-muted small">
                  <span><i className="bi bi-geo-alt me-1"></i>{job.location || 'Location Not Specified'}</span>
                  <span><i className="bi bi-cash me-1"></i>{job.salary || 'Salary Competitive'}</span>
                </div>
              </div>
              <div>
                <Link to="/profile" className="btn btn-outline-secondary rounded-pill btn-sm">
                  Back to List
                </Link>
              </div>
            </div>

            {/* Description Sections */}
            <h5 className="fw-bold text-dark mb-2">Job Description</h5>
            <p className="text-secondary mb-4" style={{ whiteSpace: 'pre-line' }}>{job.description}</p>

            {job.responsibilities && (
              <>
                <h5 className="fw-bold text-dark mb-2">Key Responsibilities</h5>
                <p className="text-secondary mb-4" style={{ whiteSpace: 'pre-line' }}>{job.responsibilities}</p>
              </>
            )}

            {job.qualification && (
              <>
                <h5 className="fw-bold text-dark mb-2">Requirements & Qualifications</h5>
                <p className="text-secondary mb-4" style={{ whiteSpace: 'pre-line' }}>{job.qualification}</p>
              </>
            )}

            <div className="row bg-light rounded p-3 mb-4 g-3">
              <div className="col-md-6">
                <strong>Required Experience:</strong> <span className="text-secondary d-block">{job.experience || 'Not specified'}</span>
              </div>
              <div className="col-md-6">
                <strong>Target Skills:</strong> <span className="text-primary d-block fw-semibold">{job.skills || 'Not specified'}</span>
              </div>
              <div className="col-md-6">
                <strong>Application Deadline:</strong> <span className="text-danger d-block fw-bold">{job.applicationDeadline || 'No deadline'}</span>
              </div>
              <div className="col-md-6">
                <strong>Website:</strong> <span className="text-secondary d-block">
                  {job.website ? <a href={job.website} target="_blank" rel="noopener noreferrer">{job.website}</a> : 'Not specified'}
                </span>
              </div>
            </div>

            {/* Interactive Apply Area */}
            <div className="border-top pt-4">
              {hasApplied ? (
                <div className="alert alert-success d-flex align-items-center mb-0 rounded-3">
                  <i className="bi bi-check-circle-fill fs-4 me-3"></i>
                  <div>
                    <h6 className="mb-0 fw-bold">Application Submitted</h6>
                    <span className="small">You have already applied for this job opening. Track status in your applications history.</span>
                  </div>
                </div>
              ) : user && user.roles?.includes('ROLE_RECRUITER') ? (
                <div className="alert alert-warning mb-0 rounded-3 text-center">
                  <i className="bi bi-exclamation-triangle fs-4 d-block mb-1"></i>
                  <span className="small">Recruiter profiles cannot submit job seeker applications.</span>
                </div>
              ) : (
                <>
                  {!showApplyBox ? (
                    <button
                      onClick={() => setShowApplyBox(true)}
                      className="btn btn-primary btn-lg rounded-pill w-100 fw-bold shadow-sm"
                    >
                      Apply For This Position
                    </button>
                  ) : (
                    <div className="card border p-3 rounded bg-light">
                      <h5 className="fw-bold text-dark mb-3">Submit Job Application</h5>
                      <p className="small text-muted mb-3">
                        <i className="bi bi-info-circle me-1"></i> Your uploaded resume will be attached automatically to this application.
                      </p>
                      
                      <form onSubmit={handleApplySubmit}>
                        <div className="mb-3">
                          <label className="form-label small fw-bold">Cover Letter / Pitch</label>
                          <textarea
                            className="form-control"
                            rows="4"
                            required
                            placeholder="Write a brief cover letter describing why you are a great fit for this job..."
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                          ></textarea>
                        </div>
                        <div className="d-flex gap-2 justify-content-end">
                          <button
                            type="button"
                            onClick={() => setShowApplyBox(false)}
                            className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={submitting}
                            className="btn btn-sm btn-primary rounded-pill px-4"
                          >
                            {submitting ? 'Submitting...' : 'Submit Application'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
