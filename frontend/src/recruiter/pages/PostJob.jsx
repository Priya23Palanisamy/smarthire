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
    <div className="container mt-4">
      <h2>Post New Job</h2>

      <form onSubmit={handleSubmit} className="card p-4 shadow">

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Job Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Salary"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
        />

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Skills"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
        />

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Experience"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
        />

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Job Type"
          name="jobType"
          value={formData.jobType}
          onChange={handleChange}
        />

        <textarea
          className="form-control mb-3"
          placeholder="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <textarea
          className="form-control mb-3"
          placeholder="Responsibilities"
          name="responsibilities"
          value={formData.responsibilities}
          onChange={handleChange}
        />

        <textarea
          className="form-control mb-3"
          placeholder="Qualification"
          name="qualification"
          value={formData.qualification}
          onChange={handleChange}
        />

        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            name="active"
            checked={formData.active}
            onChange={handleChange}
          />
          <label className="form-check-label">
            Active Job
          </label>
        </div>

        <button className="btn btn-success">
          Post Job
        </button>
      </form>
    </div>
  );
};

export default PostJob;