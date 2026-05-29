import React, { useEffect, useState } from "react";
import recruiterService from "../services/recruiterService";

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const res = await recruiterService.getApplications();
      setApplications(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await recruiterService.updateApplicationStatus(id, { status });
      loadApplications();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Manage Applications</h2>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Job</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {applications.map(app => (
            <tr key={app.id}>
              <td>{app.candidateProfile?.fullName}</td>
              <td>{app.jobTitle}</td>
              <td>{app.status}</td>

              <td>
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={() => updateStatus(app.id, "SHORTLISTED")}
                >
                  Shortlist
                </button>

                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => updateStatus(app.id, "INTERVIEW_SCHEDULED")}
                >
                  Interview
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => updateStatus(app.id, "REJECTED")}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageApplications;