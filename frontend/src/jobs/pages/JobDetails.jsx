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
  
  // Skill Gap Analyzer state
  const [skillGap, setSkillGap] = useState(null);
  const [loadingSkillGap, setLoadingSkillGap] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobDetails();
    if (user && !user.roles?.includes('ROLE_RECRUITER')) {
      fetchSkillGap();
    }
  }, [id, user]);

  const fetchSkillGap = async () => {
    setLoadingSkillGap(true);
    try {
      const response = await jobService.getSkillGap(id);
      setSkillGap(response.data);
    } catch (err) {
      console.error('Error fetching skill gap analyzer data:', err);
    } finally {
      setLoadingSkillGap(false);
    }
  };

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

            {/* AI Skill Gap Analyzer UI Card */}
            {user && !user.roles?.includes('ROLE_RECRUITER') && (
              <div className="card border-0 shadow-sm rounded-3 p-4 mb-4 bg-white border-start border-4 border-primary">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary-subtle text-primary rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    <i className="bi bi-cpu fs-5"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold text-dark mb-0">AI Skill Gap Analyzer</h5>
                    <span className="small text-muted">Real-time matching against your profile skills</span>
                  </div>
                </div>

                {loadingSkillGap ? (
                  <div className="text-center py-3">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Loading analysis...</span>
                    </div>
                    <span className="ms-2 small text-secondary">Analyzing skill match...</span>
                  </div>
                ) : skillGap ? (
                  <div>
                    {/* Match Score & Progress Bar */}
                    <div className="row align-items-center mb-3 g-3">
                      <div className="col-sm-4 text-center border-end">
                        <h2 className={`fw-bold mb-0 ${
                          skillGap.matchScore >= 75 ? 'text-success' : skillGap.matchScore >= 40 ? 'text-warning' : 'text-danger'
                        }`}>{skillGap.matchScore}%</h2>
                        <span className="small fw-semibold text-secondary">Match Score</span>
                      </div>
                      <div className="col-sm-8">
                        <div className="d-flex justify-content-between mb-1 small text-muted">
                          <span>Match Strength</span>
                          <span>{skillGap.matchedCount} of {skillGap.totalJobSkills} skills matched</span>
                        </div>
                        <div className="progress" style={{ height: '8px' }}>
                          <div
                            className={`progress-bar progress-bar-striped progress-bar-animated ${
                              skillGap.matchScore >= 75 ? 'bg-success' : skillGap.matchScore >= 40 ? 'bg-warning' : 'bg-danger'
                            }`}
                            role="progressbar"
                            style={{ width: `${skillGap.matchScore}%` }}
                            aria-valuenow={skillGap.matchScore}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Skill Breakdown lists */}
                    <div className="row mb-3 g-3">
                      <div className="col-md-6">
                        <h6 className="fw-bold text-dark small mb-2">
                          <i className="bi bi-check-circle-fill text-success me-1"></i> Matched Skills ({skillGap.matchedCount})
                        </h6>
                        {skillGap.matchedSkills && skillGap.matchedSkills.length > 0 ? (
                          <div className="d-flex flex-wrap gap-1">
                            {skillGap.matchedSkills.map((skill, index) => (
                              <span key={index} className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2.5 py-1.5 small fw-semibold">
                                ✓ {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="small text-secondary d-block ps-1">No matching skills found.</span>
                        )}
                      </div>

                      <div className="col-md-6">
                        <h6 className="fw-bold text-dark small mb-2">
                          <i className="bi bi-x-circle-fill text-danger me-1"></i> Missing Skills ({skillGap.missingCount})
                        </h6>
                        {skillGap.missingSkills && skillGap.missingSkills.length > 0 ? (
                          <div className="d-flex flex-wrap gap-1">
                            {skillGap.missingSkills.map((skill, index) => (
                              <span key={index} className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill px-2.5 py-1.5 small fw-semibold">
                                ✗ {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="small text-success d-block ps-1">You have all the required skills!</span>
                        )}
                      </div>
                    </div>

                    {/* Recommendations Section */}
                    {skillGap.recommendations && skillGap.recommendations.length > 0 && (
                      <div className="bg-light rounded p-3 border-start border-3 border-warning mt-2">
                        <h6 className="fw-bold text-dark small mb-2">
                          <i className="bi bi-lightbulb-fill text-warning me-1"></i> Suggested Recommendations:
                        </h6>
                        <ul className="list-unstyled mb-0 small text-secondary">
                          {skillGap.recommendations.map((rec, index) => (
                            <li key={index} className="mb-1 d-flex align-items-center">
                              <i className="bi bi-arrow-right-short text-warning me-1 fw-bold fs-5"></i>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="alert alert-info py-2 small mb-0">
                    <i className="bi bi-info-circle me-1"></i> Add skills to your profile to see compatibility matches here.
                  </div>
                )}
              </div>
            )}

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
