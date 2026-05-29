import React, { useState } from "react";
import recruiterService from "../services/recruiterService";

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: "",
    salary: "",
    skills: "",
    experience: "",
    location: "",
    jobType: "",
    description: "",
    responsibilities: "",
    qualification: "",
    active: true
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await recruiterService.createJob(formData);
      alert("Job posted successfully");

      setFormData({
        title: "",
        salary: "",
        skills: "",
        experience: "",
        location: "",
        jobType: "",
        description: "",
        responsibilities: "",
        qualification: "",
        active: true
      });

    } catch (error) {
      console.error(error);
      alert("Error posting job");
    }
  };

  return (
    <div className="container py-4 text-start">
      {/* Banner / Header Card */}
      <div className="card border-0 shadow-sm rounded-3 p-4 mb-4 bg-white">
        <h2 className="fw-bold text-dark mb-1">
          <i className="bi bi-file-earmark-plus text-primary me-2"></i>Post a New Job Opening
        </h2>
        <p className="text-secondary mb-0">Fill out the detailed segments below to publish a search listing for talent.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-lg-8">
            {/* Basic Info Card */}
            <div className="card shadow-sm border-0 rounded-3 p-4 mb-4 bg-white">
              <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">
                <i className="bi bi-info-circle text-primary me-2"></i>1. Basic Information
              </h5>
              
              <div className="mb-3">
                <label className="form-label small fw-bold">Job Title <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control bg-light border-0 py-2"
                  placeholder="e.g. Senior Full Stack React Developer"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold">Salary Bracket</label>
                  <input
                    type="text"
                    className="form-control bg-light border-0 py-2"
                    placeholder="e.g. $80,000 - $110,000"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold">Location</label>
                  <input
                    type="text"
                    className="form-control bg-light border-0 py-2"
                    placeholder="e.g. San Francisco, CA or Remote"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold">Job Type <span className="text-danger">*</span></label>
                  <select
                    className="form-select bg-light border-0 py-2"
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold">Required Experience</label>
                  <input
                    type="text"
                    className="form-control bg-light border-0 py-2"
                    placeholder="e.g. 3+ years"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Job Details / Description Card */}
            <div className="card shadow-sm border-0 rounded-3 p-4 bg-white mb-4">
              <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">
                <i className="bi bi-file-earmark-text text-primary me-2"></i>2. Role Details & Context
              </h5>

              <div className="mb-3">
                <label className="form-label small fw-bold">Role Description <span className="text-danger">*</span></label>
                <textarea
                  className="form-control bg-light border-0 py-2"
                  rows="6"
                  placeholder="Describe the job overview, organizational structure, and team environment..."
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Key Responsibilities</label>
                <textarea
                  className="form-control bg-light border-0 py-2"
                  rows="4"
                  placeholder="Bullet point main tasks, deliverables, and expectations..."
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Requirements & Action Side Panel */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 rounded-3 p-4 bg-white mb-4">
              <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">
                <i className="bi bi-ui-checks text-primary me-2"></i>3. Core Requirements
              </h5>

              <div className="mb-3">
                <label className="form-label small fw-bold">Target Skills <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control bg-light border-0 py-2"
                  placeholder="e.g. React, Java, AWS"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Desired Qualifications</label>
                <textarea
                  className="form-control bg-light border-0 py-2"
                  rows="4"
                  placeholder="e.g. BS in Computer Science or equivalent experience..."
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <div className="card shadow-sm border-0 rounded-3 p-4 bg-white mb-4">
              <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">
                <i className="bi bi-toggle2-on text-primary me-2"></i>4. Listing Status
              </h5>

              <div className="form-check form-switch mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="active"
                  id="activeSwitch"
                  checked={formData.active}
                  onChange={handleChange}
                  role="switch"
                  style={{ cursor: "pointer" }}
                />
                <label className="form-check-label small fw-bold" htmlFor="activeSwitch" style={{ cursor: "pointer" }}>
                  Active Job (Open for applications)
                </label>
              </div>

              <div className="d-grid mt-4">
                <button type="submit" className="btn btn-primary rounded-pill py-2 fw-bold shadow-sm">
                  Publish Job Posting
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostJob;