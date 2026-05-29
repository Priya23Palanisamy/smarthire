import React from "react";

const JobApplicants = ({ applicant, onClose }) => {
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
          <div className="d-flex align-items-center p-3 border rounded bg-light">
            <i className="bi bi-file-earmark-pdf-fill text-danger fs-2 me-3"></i>
            <div>
              <h6 className="mb-0 fw-bold">{resume.fileName}</h6>
              <span className="small text-muted">{resume.fileType || "Document"}</span>
            </div>
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