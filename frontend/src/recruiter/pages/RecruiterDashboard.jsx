import React, { useEffect, useState } from "react";
import recruiterService from "../services/recruiterService";
import { Link } from "react-router-dom";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const jobsRes = await recruiterService.getMyJobs();
      const appRes = await recruiterService.getApplications();

      setJobs(jobsRes.data);
      setApplications(appRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const activeJobs = jobs.filter(job => job.active).length;

  return (
    <div className="container py-4">

      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Recruiter Dashboard</h2>

        <div className="d-flex gap-2">
          <Link to="/recruiter/post-job" className="btn btn-primary">
            + Post Job
          </Link>

          <Link to="/recruiter/jobs" className="btn btn-outline-dark">
            Manage Jobs
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3">

        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3 text-center">
            <h6>Total Jobs</h6>
            <h2>{jobs.length}</h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3 text-center">
            <h6>Active Jobs</h6>
            <h2>{activeJobs}</h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3 text-center">
            <h6>Total Applicants</h6>
            <h2>{applications.length}</h2>
          </div>
        </div>

      </div>

      {/* Quick Links */}
      <div className="mt-4">
        <h5 className="mb-3">Quick Actions</h5>

        <div className="row g-3">
          <div className="col-md-3">
            <Link to="/recruiter/profile" className="text-decoration-none">
              <div className="card p-3 text-center shadow-sm">
                Profile
              </div>
            </Link>
          </div>

          <div className="col-md-3">
            <Link to="/recruiter/applications" className="text-decoration-none">
              <div className="card p-3 text-center shadow-sm">
                Applications
              </div>
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};

export default RecruiterDashboard;