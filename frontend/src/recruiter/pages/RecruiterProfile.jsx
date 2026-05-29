import React, { useEffect, useState } from "react";
import recruiterService from "../services/recruiterService";

const RecruiterProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await recruiterService.getProfile();
      setProfile(res.data);
      setFormData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await recruiterService.updateProfile(formData);
      alert("Profile updated");
      setEditMode(false);
      loadProfile();
    } catch (err) {
      console.error(err);
    }
  };

  if (!profile) {
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
      {/* Banner / Header Card */}
      <div className="card border-0 shadow-sm rounded-3 p-4 mb-4 bg-white">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary text-white rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: "65px", height: "65px" }}>
              <i className="bi bi-building fs-3"></i>
            </div>
            <div>
              <h2 className="fw-bold text-dark mb-1">{profile.companyName || "Company Profile"}</h2>
              <span className="badge bg-primary-subtle text-primary rounded-pill px-3">Recruiter Account Active</span>
            </div>
          </div>
          {!editMode && (
            <button
              className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm"
              onClick={() => setEditMode(true)}
            >
              <i className="bi bi-pencil-square me-2"></i>Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* VIEW MODE */}
      {!editMode && (
        <div className="row g-4">
          {/* Main Info Card */}
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 rounded-3 p-4 bg-white h-100">
              <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">
                <i className="bi bi-info-circle-fill text-primary me-2"></i>Company Description
              </h5>
              <p className="text-secondary" style={{ whiteSpace: "pre-line", lineHeight: "1.7" }}>
                {profile.companyDescription || "No description provided yet. Click edit to add details about your company culture, team, and benefits."}
              </p>
            </div>
          </div>

          {/* Quick Info Side Panel */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 rounded-3 p-4 bg-white h-100">
              <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">
                <i className="bi bi-info-square-fill text-primary me-2"></i>Company Details
              </h5>
              <div className="d-flex flex-column gap-3">
                <div>
                  <strong className="d-block small text-muted text-uppercase mb-1"><i className="bi bi-geo-alt me-2"></i>Location</strong>
                  <span className="text-secondary">{profile.companyLocation || "Not specified"}</span>
                </div>
                <div>
                  <strong className="d-block small text-muted text-uppercase mb-1"><i className="bi bi-globe me-2"></i>Website URL</strong>
                  {profile.website ? (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-none">
                      {profile.website}
                    </a>
                  ) : (
                    <span className="text-secondary">Not specified</span>
                  )}
                </div>
                <div>
                  <strong className="d-block small text-muted text-uppercase mb-1"><i className="bi bi-envelope me-2"></i>Contact Email</strong>
                  <span className="text-secondary">{profile.contactEmail || "Not specified"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODE */}
      {editMode && (
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow border-0 rounded-3 p-4 bg-white">
              <h4 className="fw-bold text-dark border-bottom pb-3 mb-4">
                <i className="bi bi-pencil-square text-primary me-2"></i>Edit Company Profile
              </h4>
              
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label small fw-bold">Company Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName || ""}
                      onChange={handleChange}
                      className="form-control bg-light border-0 py-2"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label small fw-bold">Company Location</label>
                    <input
                      type="text"
                      name="companyLocation"
                      value={formData.companyLocation || ""}
                      onChange={handleChange}
                      className="form-control bg-light border-0 py-2"
                      placeholder="e.g. San Francisco, CA"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label small fw-bold">Website URL</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website || ""}
                      onChange={handleChange}
                      className="form-control bg-light border-0 py-2"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label small fw-bold">Contact Email</label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail || ""}
                      onChange={handleChange}
                      className="form-control bg-light border-0 py-2"
                      placeholder="contact@company.com"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold">Company Description <span className="text-danger">*</span></label>
                  <textarea
                    name="companyDescription"
                    value={formData.companyDescription || ""}
                    onChange={handleChange}
                    rows="6"
                    className="form-control bg-light border-0 py-2"
                    placeholder="Describe your company culture, technology stack, and values..."
                    required
                  ></textarea>
                </div>

                <div className="d-flex justify-content-end gap-2 border-top pt-3">
                  <button
                    type="button"
                    className="btn btn-light rounded-pill px-4"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">
                    Save Details
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterProfile;