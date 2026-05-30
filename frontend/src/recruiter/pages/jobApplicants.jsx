import React, { useEffect, useState } from "react";
import recruiterService from "../services/recruiterService";

const JobApplicants = ({ applicant, onClose }) => {
  const [hiringRisk, setHiringRisk] = useState(null);
  const [loadingRisk, setLoadingRisk] = useState(false);

  useEffect(() => {
    if (applicant && applicant.id) {
      loadHiringRisk(applicant.id);
    }
  }, [applicant]);

  const loadHiringRisk = async (appId) => {
    setLoadingRisk(true);
    try {
      const res = await recruiterService.getHiringRiskScore(appId);
      setHiringRisk(res.data);
    } catch (err) {
      console.error("Error loading hiring risk score:", err);
    } finally {
      setLoadingRisk(false);
    }
  };

  const handleResumeDownload = async () => {
  try {
    const response = await recruiterService.downloadResume(applicant.id);

    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = resume.fileName || "resume.pdf";

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error("Resume download failed:", error);
    alert("Unable to download resume");
  }
};

  if (!applicant) {
    return <p className="text-center text-muted py-5">No applicant selected</p>;
  }

  // Under the application mapping, the profile detail lies in app.candidateProfile
  const profile = applicant.candidateProfile || {};
  const resume = profile.resume || {};

  return (
    <div className="card shadow-lg border-0 rounded-3 p-4 bg-white text-start">
      <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1 text-primary">{profile.fullName || applicant.fullName || "Name Not Specified"}</h4>
          <span className="badge bg-secondary-subtle text-secondary rounded-pill px-3">Candidate Profile Overview</span>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="btn-close" aria-label="Close"></button>
        )}
      </div>

      {/* AI Hiring Risk Score Panel */}
      <div className="card border-0 shadow-sm rounded-3 p-4 mb-4 bg-white border-start border-4 border-warning shadow-sm">
        <div className="d-flex align-items-center mb-3">
          <div className="bg-warning-subtle text-warning rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
            <i className="bi bi-shield-fill-check fs-5"></i>
          </div>
          <div>
            <h5 className="fw-bold text-dark mb-0">AI Hiring Risk Evaluator</h5>
            <span className="small text-muted">Evaluation: Skill Match (50%), Experience (30%), Profile (20%)</span>
          </div>
        </div>

        {loadingRisk ? (
          <div className="text-center py-3">
            <div className="spinner-border spinner-border-sm text-warning" role="status">
              <span className="visually-hidden">Calculating risk...</span>
            </div>
            <span className="ms-2 small text-secondary">Analyzing hiring risk...</span>
          </div>
        ) : hiringRisk ? (
          <div>
            {/* Score & Risk Category Gauge */}
            <div className="row align-items-center mb-3 g-3">
              <div className="col-sm-4 text-center border-end">
                <h2 className={`fw-bold mb-0 ${
                  hiringRisk.riskCategory === 'Low Risk' ? 'text-success' : hiringRisk.riskCategory === 'Medium Risk' ? 'text-warning' : 'text-danger'
                }`}>{hiringRisk.overallScore}/100</h2>
                <span className={`badge rounded-pill fw-bold ${
                  hiringRisk.riskCategory === 'Low Risk' ? 'bg-success-subtle text-success' : hiringRisk.riskCategory === 'Medium Risk' ? 'bg-warning-subtle text-warning' : 'bg-danger-subtle text-danger'
                }`}>{hiringRisk.riskCategory}</span>
              </div>
              <div className="col-sm-8">
                <div className="d-flex justify-content-between mb-1 small text-muted">
                  <span>Compatibility Index</span>
                  <span>{hiringRisk.candidateExperience} yrs exp vs {hiringRisk.requiredExperience} yrs req</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div
                    className={`progress-bar progress-bar-striped progress-bar-animated ${
                      hiringRisk.riskCategory === 'Low Risk' ? 'bg-success' : hiringRisk.riskCategory === 'Medium Risk' ? 'bg-warning' : 'bg-danger'
                    }`}
                    role="progressbar"
                    style={{ width: `${hiringRisk.overallScore}%` }}
                    aria-valuenow={hiringRisk.overallScore}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            </div>

            {/* Match Breakdown list */}
            <div className="row g-2 mt-2">
              <div className="col-md-4">
                <div className="border rounded p-2 text-center bg-light">
                  <div className="small text-muted">Skill Match</div>
                  <strong className="text-dark">{hiringRisk.skillMatchScore}%</strong>
                </div>
              </div>
              <div className="col-md-4">
                <div className="border rounded p-2 text-center bg-light">
                  <div className="small text-muted">Experience Match</div>
                  <strong className="text-dark">{hiringRisk.experienceMatchScore}%</strong>
                </div>
              </div>
              <div className="col-md-4">
                <div className="border rounded p-2 text-center bg-light">
                  <div className="small text-muted">Profile Complete</div>
                  <strong className="text-dark">{hiringRisk.profileCompletionScore}%</strong>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="alert alert-info py-2 small mb-0">
            <i className="bi bi-info-circle me-1"></i> Calculation not available.
          </div>
        )}
      </div>


      <div className="row mb-4">
        <div className="col-md-6 mb-2">
          <strong><i className="bi bi-envelope me-2 text-muted"></i>Email:</strong>{" "}
          <span className="text-secondary">{profile.email || "Not specified"}</span>
        </div>
        <div className="col-md-6 mb-2">
          <strong><i className="bi bi-telephone me-2 text-muted"></i>Phone:</strong>{" "}
          <span className="text-secondary">{profile.phoneNumber || "Not specified"}</span>
        </div>
        <div className="col-md-6 mb-2">
          <strong><i className="bi bi-geo-alt me-2 text-muted"></i>Location:</strong>{" "}
          <span className="text-secondary">{profile.address || "Not specified"}</span>
        </div>
        <div className="col-md-6 mb-2">
          <strong><i className="bi bi-gender-ambiguous me-2 text-muted"></i>Gender:</strong>{" "}
          <span className="text-secondary">{profile.gender || "Not specified"}</span>
        </div>
      </div>

      {profile.bio && (
        <div className="mb-4">
          <h5 className="fw-bold border-bottom pb-1 text-dark mb-2">Professional Summary</h5>
          <p className="text-secondary small">{profile.bio}</p>
        </div>
      )}

      {/* Resume File Name */}
      <div className="mb-4">
        <h5 className="fw-bold border-bottom pb-1 text-dark mb-2">Attached Resume</h5>
        {resume.fileName ? (
          <div className="d-flex justify-content-between align-items-center p-3 border rounded bg-light">

  <div className="d-flex align-items-center">
    <i className="bi bi-file-earmark-pdf-fill text-danger fs-2 me-3"></i>

    <div>
      <h6 className="mb-0 fw-bold">{resume.fileName}</h6>

      <span className="small text-muted">
        {resume.fileType || "Document"}
      </span>
    </div>
  </div>

  <button
    className="btn btn-primary btn-sm"
    onClick={handleResumeDownload}
  >
    <i className="bi bi-download me-1"></i>
    Download Resume
  </button>

</div>
        ) : (
          <p className="small text-danger"><i className="bi bi-exclamation-circle me-1"></i> No resume attached to this profile.</p>
        )}
      </div>

      {/* Skills */}
      <div className="mb-4">
        <h5 className="fw-bold border-bottom pb-1 text-dark mb-2">Skills</h5>
        <div className="d-flex flex-wrap gap-2 pt-1">
          {profile.skills && profile.skills.length > 0 ? (
            profile.skills.map((s) => (
              <span key={s.id} className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill small">
                {s.name}
              </span>
            ))
          ) : (
            <span className="text-muted small">No specific skills listed.</span>
          )}
        </div>
      </div>

      {/* Work Experience */}
      <div className="mb-4">
        <h5 className="fw-bold border-bottom pb-1 text-dark mb-2">Work Experience</h5>
        {profile.experienceList && profile.experienceList.length > 0 ? (
          profile.experienceList.map((e) => (
            <div key={e.id} className="mb-3">
              <h6 className="fw-bold mb-1 text-dark">{e.role} at <span className="text-primary">{e.companyName}</span></h6>
              <div className="small text-muted mb-1"><i className="bi bi-calendar3 me-1"></i> {e.yearsOfExperience} Years</div>
              <p className="small text-secondary mb-0">{e.description}</p>
            </div>
          ))
        ) : (
          <span className="text-muted small">No professional experience listed.</span>
        )}
      </div>

      {/* Education */}
      <div className="mb-4">
        <h5 className="fw-bold border-bottom pb-1 text-dark mb-2">Education</h5>
        {profile.educationList && profile.educationList.length > 0 ? (
          profile.educationList.map((edu) => (
            <div key={edu.id} className="mb-3">
              <h6 className="fw-bold mb-1 text-dark">{edu.degree}</h6>
              <div className="small text-secondary">{edu.college} ({edu.startYear} - {edu.endYear || "Present"})</div>
              {edu.cgpa && <div className="small text-success fw-semibold">CGPA/Score: {edu.cgpa}</div>}
            </div>
          ))
        ) : (
          <span className="text-muted small">No education details listed.</span>
        )}
      </div>

      {/* Certifications */}
      <div className="mb-0">
        <h5 className="fw-bold border-bottom pb-1 text-dark mb-2">Certifications</h5>
        {profile.certificates && profile.certificates.length > 0 ? (
          profile.certificates.map((c) => (
            <div key={c.id} className="mb-2">
              <h6 className="fw-bold mb-0 text-dark">{c.name}</h6>
              <span className="small text-muted">Issued by {c.issuer} {c.issueDate && `on ${c.issueDate}`}</span>
            </div>
          ))
        ) : (
          <span className="text-muted small">No certifications listed.</span>
        )}
      </div>
    </div>
  );
};

export default JobApplicants;