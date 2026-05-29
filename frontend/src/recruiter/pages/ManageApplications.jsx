import React, { useEffect, useState } from "react";
import recruiterService from "../services/recruiterService";
import JobApplicants from "./jobApplicants";

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  
  // Interview scheduling modal state
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [schedulingAppId, setSchedulingAppId] = useState(null);
  const [interviewDetails, setInterviewDetails] = useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const res = await recruiterService.getApplications();
      setApplications(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status, details = "") => {
    try {
      setLoading(true);
      await recruiterService.updateApplicationStatus(id, { 
        status, 
        interviewDetails: details 
      });
      alert(`Candidate application status updated to: ${status}`);
      loadApplications();
    } catch (error) {
      alert("Failed to update candidate status.");
    } finally {
      setLoading(false);
    }
  };

  const triggerInterviewSchedule = (id) => {
    setSchedulingAppId(id);
    setInterviewDetails("Date: \nTime: \nPlatform/Link: ");
    setShowInterviewModal(true);
  };

  const submitInterviewSchedule = () => {
    if (!interviewDetails.trim()) {
      alert("Please provide interview schedule details!");
      return;
    }
    setShowInterviewModal(false);
    handleUpdateStatus(schedulingAppId, "INTERVIEW_SCHEDULED", interviewDetails);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPLIED":
        return <span className="badge bg-secondary-subtle text-secondary rounded-pill px-3 py-1 fw-bold">Applied</span>;
      case "SHORTLISTED":
        return <span className="badge bg-warning-subtle text-warning rounded-pill px-3 py-1 fw-bold">Shortlisted</span>;
      case "INTERVIEW_SCHEDULED":
        return <span className="badge bg-info-subtle text-info rounded-pill px-3 py-1 fw-bold">Interview Scheduled</span>;
      case "REJECTED":
        return <span className="badge bg-danger-subtle text-danger rounded-pill px-3 py-1 fw-bold">Rejected</span>;
      case "SELECTED":
        return <span className="badge bg-success-subtle text-success rounded-pill px-3 py-1 fw-bold">Selected</span>;
      default:
        return <span className="badge bg-light text-dark rounded-pill px-3 py-1 fw-bold">{status}</span>;
    }
  };

  if (loading && applications.length === 0) {
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
      <div className="row">
        {/* Main List */}
        <div className={selectedApp ? "col-lg-6" : "col-12"}>
          <div className="card shadow-sm border-0 rounded-3 p-4 bg-white">
            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
              <h4 className="fw-bold mb-0 text-primary">
                <i className="bi bi-people-fill me-2"></i>Job Seekers Applications
              </h4>
              <span className="badge bg-primary text-white rounded-pill px-3 py-2 small">{applications.length} Total</span>
            </div>

            {applications.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">Candidate</th>
                      <th scope="col">Job Title</th>
                      <th scope="col">Status</th>
                      <th scope="col" className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr 
                        key={app.id} 
                        className={selectedApp?.id === app.id ? "table-primary" : ""}
                        style={{ cursor: "pointer" }}
                      >
                        <td onClick={() => setSelectedApp(app)}>
                          <span className="fw-bold text-dark d-block">
                            {app.candidateProfile?.fullName || "Candidate"}
                          </span>
                          <span className="small text-muted">@{app.candidateProfile?.username || "username"}</span>
                        </td>
                        <td onClick={() => setSelectedApp(app)} className="fw-semibold text-secondary">
                          {app.jobTitle}
                        </td>
                        <td onClick={() => setSelectedApp(app)}>
                          {getStatusBadge(app.status)}
                        </td>
                        <td>
                          <div className="d-flex gap-1 justify-content-center">
                            <button
                              className="btn btn-sm btn-outline-success rounded-pill px-2"
                              onClick={(e) => { e.stopPropagation(); handleUpdateStatus(app.id, "SHORTLISTED"); }}
                              title="Shortlist Candidate"
                            >
                              Shortlist
                            </button>
                            <button
                              className="btn btn-sm btn-outline-info rounded-pill px-2"
                              onClick={(e) => { e.stopPropagation(); triggerInterviewSchedule(app.id); }}
                              title="Schedule Interview"
                            >
                              Interview
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger rounded-pill px-2"
                              onClick={(e) => { e.stopPropagation(); handleUpdateStatus(app.id, "REJECTED"); }}
                              title="Reject Candidate"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5">
                <i className="bi bi-people text-muted display-2"></i>
                <h5 className="fw-bold mt-3 text-dark">No Applications Yet</h5>
                <p className="text-secondary small">Job seekers haven't applied to your job postings yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Selected Candidate Slide-Over Details */}
        {selectedApp && (
          <div className="col-lg-6">
            <JobApplicants 
              applicant={selectedApp} 
              onClose={() => setSelectedApp(null)} 
            />
          </div>
        )}
      </div>

      {/* Optional Interview Details Modal */}
      {showInterviewModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Interview Dispatcher Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowInterviewModal(false)}></button>
              </div>
              <div className="modal-body">
                <p className="small text-muted mb-2">
                  Input coordinates, date, and link. These will be automatically emailed to the candidate.
                </p>
                <textarea
                  className="form-control font-monospace"
                  rows="5"
                  value={interviewDetails}
                  onChange={(e) => setInterviewDetails(e.target.value)}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary btn-sm rounded-pill px-3" onClick={() => setShowInterviewModal(false)}>Cancel</button>
                <button className="btn btn-primary btn-sm rounded-pill px-4" onClick={submitInterviewSchedule}>Schedule & Email Candidate</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageApplications;