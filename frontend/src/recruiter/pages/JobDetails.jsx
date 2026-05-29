import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import recruiterService from "../../recruiter/services/recruiterService";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);

  useEffect(() => {
    loadJob();
  }, []);

  const loadJob = async () => {
    try {
      const res = await recruiterService.getJobById(id);
      setJob(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!job) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-4">

      {/* Header */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">

          <div>
            <h2 className="fw-bold text-dark mb-2">
              {job.title}
            </h2>

            <div className="d-flex flex-wrap gap-2">

              <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill">
                {job.jobType}
              </span>

              <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill">
                {job.location}
              </span>

              <span className="badge bg-dark-subtle text-dark px-3 py-2 rounded-pill">
                {job.salary}
              </span>

            </div>
          </div>

          <div>
            {job.active ? (
              <span className="badge bg-success px-3 py-2">
                Active
              </span>
            ) : (
              <span className="badge bg-danger px-3 py-2">
                Inactive
              </span>
            )}
          </div>

        </div>
      </div>

      <div className="row g-4">

        {/* Left Section */}
        <div className="col-lg-8">

          {/* Description */}
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h5 className="fw-bold mb-3">
              Job Description
            </h5>

            <p className="text-secondary">
              {job.description}
            </p>
          </div>

          {/* Responsibilities */}
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h5 className="fw-bold mb-3">
              Responsibilities
            </h5>

            <p className="text-secondary">
              {job.responsibilities}
            </p>
          </div>

        </div>

        {/* Right Section */}
        <div className="col-lg-4">

          {/* Skills */}
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h5 className="fw-bold mb-3">
              Required Skills
            </h5>

            <div className="d-flex flex-wrap gap-2">
              {job.skills?.split(",").map((skill, index) => (
                <span
                  key={index}
                  className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Qualifications */}
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h5 className="fw-bold mb-3">
              Qualifications
            </h5>

            <p className="text-secondary">
              {job.qualification}
            </p>
          </div>

          {/* Experience */}
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h5 className="fw-bold mb-3">
              Experience
            </h5>

            <p className="text-secondary">
              {job.experience}
            </p>
          </div>

          {/* Back Button */}
          <button
            className="btn btn-dark w-100 rounded-pill py-2"
            onClick={() => navigate(-1)}
          >
            Back
          </button>

        </div>

      </div>
    </div>
  );
};

export default JobDetails;