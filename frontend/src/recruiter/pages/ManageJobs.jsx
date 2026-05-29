import React, { useEffect, useState } from "react";
import recruiterService from "../services/recruiterService";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const res = await recruiterService.getMyJobs();
      setJobs(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this job?")) return;

    try {
      await recruiterService.deleteJob(id);
      loadJobs();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Manage Jobs</h2>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Title</th>
            <th>Location</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {jobs.map(job => (
            <tr key={job.id}>
              <td>{job.title}</td>
              <td>{job.location}</td>
              <td>{job.jobType}</td>
              <td>
                {job.active ? "Active" : "Inactive"}
              </td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(job.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageJobs;