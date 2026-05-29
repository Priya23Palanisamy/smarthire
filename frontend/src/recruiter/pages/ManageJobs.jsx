import React, { useEffect, useState } from "react";
import recruiterService from "../services/recruiterService";
import { useNavigate } from "react-router-dom";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        .mj-root {
          font-family: 'DM Sans', sans-serif;
          background: #f0f2f7;
          min-height: 100vh;
          padding: 2.5rem 0 4rem;
        }

        /* ── Page Header ── */
        .mj-header {
          background: linear-gradient(135deg, #1a1f36 0%, #2d3561 100%);
          border-radius: 20px;
          padding: 2rem 2.25rem;
          margin-bottom: 2rem;
          position: relative;
          overflow: hidden;
        }
        .mj-header::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 200px; height: 200px;
          background: rgba(255,255,255,0.04);
          border-radius: 50%;
        }
        .mj-header::after {
          content: '';
          position: absolute;
          bottom: -60px; right: 60px;
          width: 140px; height: 140px;
          background: rgba(99,179,237,0.08);
          border-radius: 50%;
        }
        .mj-header-icon {
          width: 48px; height: 48px;
          background: rgba(255,255,255,0.12);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1rem;
        }
        .mj-header-icon svg {
          width: 24px; height: 24px;
          stroke: #90cdf4;
        }
        .mj-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 0.35rem;
          letter-spacing: -0.02em;
        }
        .mj-subtitle {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.55);
          margin: 0;
        }
        .mj-job-count {
          background: rgba(99,179,237,0.18);
          color: #90cdf4;
          font-size: 0.78rem;
          font-weight: 600;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.04em;
          padding: 0.3rem 0.75rem;
          border-radius: 20px;
          border: 1px solid rgba(99,179,237,0.25);
        }

        /* ── Card Shell ── */
        .mj-card {
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 2px 16px rgba(26,31,54,0.07), 0 1px 3px rgba(26,31,54,0.05);
          overflow: hidden;
          border: 1px solid rgba(226,232,240,0.8);
        }
        .mj-card-toolbar {
          padding: 1.1rem 1.5rem;
          border-bottom: 1px solid #edf2f7;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .mj-toolbar-label {
          font-size: 0.78rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #718096;
        }

        /* ── Table ── */
        .mj-table-wrap {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .mj-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
          color: #2d3748;
          min-width: 640px;
        }
        .mj-table thead tr {
          background: #f7fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .mj-table thead th {
          padding: 0.9rem 1.25rem;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          color: #a0aec0;
          white-space: nowrap;
        }
        .mj-table tbody tr {
          border-bottom: 1px solid #f0f4f8;
          transition: background 0.15s;
        }
        .mj-table tbody tr:last-child {
          border-bottom: none;
        }
        .mj-table tbody tr:hover {
          background: #f7fafc;
        }
        .mj-table td {
          padding: 1rem 1.25rem;
          vertical-align: middle;
        }

        /* ── Job title cell ── */
        .mj-job-title {
          font-weight: 600;
          color: #1a202c;
          font-size: 0.92rem;
          line-height: 1.3;
        }
        .mj-job-id {
          font-size: 0.72rem;
          font-family: 'DM Mono', monospace;
          color: #a0aec0;
          margin-top: 0.15rem;
        }

        /* ── Location / Type chips ── */
        .mj-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: #f0f4f8;
          color: #4a5568;
          font-size: 0.78rem;
          font-weight: 500;
          padding: 0.28rem 0.65rem;
          border-radius: 8px;
          white-space: nowrap;
        }
        .mj-chip svg {
          width: 12px; height: 12px;
          opacity: 0.6;
          flex-shrink: 0;
        }

        /* ── Status badges ── */
        .mj-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.76rem;
          font-weight: 600;
          padding: 0.32rem 0.75rem;
          border-radius: 20px;
          letter-spacing: 0.02em;
        }
        .mj-badge-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .mj-badge-active {
          background: #f0fff4;
          color: #276749;
          border: 1px solid #c6f6d5;
        }
        .mj-badge-active .mj-badge-dot {
          background: #38a169;
          box-shadow: 0 0 0 2px rgba(56,161,105,0.25);
        }
        .mj-badge-inactive {
          background: #fff5f5;
          color: #9b2c2c;
          border: 1px solid #fed7d7;
        }
        .mj-badge-inactive .mj-badge-dot {
          background: #e53e3e;
        }

        /* ── Action buttons ── */
        .mj-actions {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: nowrap;
        }
        .mj-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.78rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          padding: 0.38rem 0.75rem;
          border-radius: 9px;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.17s;
          white-space: nowrap;
          text-decoration: none;
        }
        .mj-btn svg {
          width: 13px; height: 13px;
          flex-shrink: 0;
        }
        .mj-btn-view {
          background: #ebf8ff;
          color: #2b6cb0;
          border-color: #bee3f8;
        }
        .mj-btn-view:hover {
          background: #bee3f8;
          color: #1a4c7a;
        }
        .mj-btn-edit {
          background: #fffff0;
          color: #744210;
          border-color: #fefcbf;
        }
        .mj-btn-edit:hover {
          background: #fefcbf;
          color: #5a3100;
        }
        .mj-btn-delete {
          background: #fff5f5;
          color: #9b2c2c;
          border-color: #fed7d7;
        }
        .mj-btn-delete:hover {
          background: #fed7d7;
          color: #742a2a;
        }

        /* ── Empty state ── */
        .mj-empty {
          text-align: center;
          padding: 4.5rem 2rem;
        }
        .mj-empty-icon {
          width: 72px; height: 72px;
          background: #f0f4f8;
          border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.25rem;
        }
        .mj-empty-icon svg {
          width: 34px; height: 34px;
          stroke: #a0aec0;
        }
        .mj-empty-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 0.4rem;
        }
        .mj-empty-text {
          font-size: 0.88rem;
          color: #a0aec0;
          margin: 0;
        }

        /* ── Footer bar ── */
        .mj-card-footer {
          padding: 0.9rem 1.5rem;
          border-top: 1px solid #edf2f7;
          background: #fafbfc;
          font-size: 0.78rem;
          color: #a0aec0;
        }

        /* ── Responsive ── */
        @media (max-width: 575.98px) {
          .mj-root { padding: 1.25rem 0 3rem; }
          .mj-header { padding: 1.5rem 1.25rem; border-radius: 16px; }
          .mj-title { font-size: 1.35rem; }
          .mj-table thead th, .mj-table td { padding: 0.75rem 1rem; }
          .mj-btn span { display: none; }
          .mj-btn { padding: 0.38rem 0.55rem; }
          .mj-btn svg { width: 15px; height: 15px; }
        }
      `}</style>

      <div className="mj-root">
        <div className="container-lg px-3 px-md-4">

          {/* ── Page Header ── */}
          <div className="mj-header d-flex flex-column flex-sm-row align-items-sm-center justify-content-sm-between gap-3 mb-4">
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="mj-header-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="3"/>
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                  <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
                </svg>
              </div>
              <h1 className="mj-title">Manage Jobs</h1>
              <p className="mj-subtitle">Review, edit, and manage all your active job listings</p>
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <span className="mj-job-count">
                {jobs.length} {jobs.length === 1 ? 'Listing' : 'Listings'}
              </span>
            </div>
          </div>

          {/* ── Main Card ── */}
          <div className="mj-card">

            {/* Toolbar */}
            <div className="mj-card-toolbar">
              <span className="mj-toolbar-label">All Job Posts</span>
            </div>

            {/* Table / Empty State */}
            {jobs.length === 0 ? (
              <div className="mj-empty">
                <div className="mj-empty-icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/>
                  </svg>
                </div>
                <p className="mj-empty-title">No job listings yet</p>
                <p className="mj-empty-text">Job posts you create will appear here for management.</p>
              </div>
            ) : (
              <div className="mj-table-wrap">
                <table className="mj-table">
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Location</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map(job => (
                      <tr key={job.id}>
                        {/* Title */}
                        <td>
                          <div className="mj-job-title">{job.title}</div>
                          {job.id && (
                            <div className="mj-job-id">#{job.id}</div>
                          )}
                        </td>

                        {/* Location */}
                        <td>
                          <span className="mj-chip">
                            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
                              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z"/>
                              <circle cx="12" cy="11" r="3"/>
                            </svg>
                            {job.location}
                          </span>
                        </td>

                        {/* Type */}
                        <td>
                          <span className="mj-chip">
                            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
                              <circle cx="12" cy="12" r="10"/>
                              <polyline points="12 6 12 12 16 14"/>
                            </svg>
                            {job.jobType}
                          </span>
                        </td>

                        {/* Status */}
                        <td>
                          {job.active ? (
                            <span className="mj-badge mj-badge-active">
                              <span className="mj-badge-dot"></span>
                              Active
                            </span>
                          ) : (
                            <span className="mj-badge mj-badge-inactive">
                              <span className="mj-badge-dot"></span>
                              Inactive
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td>
                          <div className="mj-actions">
                            <button
  className="mj-btn mj-btn-view"
  onClick={() => navigate(`/jobs/${job.id}`)}
>View</button>

                            <button
  className="mj-btn mj-btn-edit"
  onClick={() => navigate(`/recruiter/edit-job/${job.id}`)}
>
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
  <span>Edit</span>
</button>

                            <button
                              className="mj-btn mj-btn-delete"
                              onClick={() => handleDelete(job.id)}
                            >
                              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                <path d="M10 11v6m4-6v6"/>
                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                              </svg>
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer */}
            {jobs.length > 0 && (
              <div className="mj-card-footer d-flex align-items-center justify-content-between flex-wrap gap-2">
                <span>Showing <strong>{jobs.length}</strong> {jobs.length === 1 ? 'job' : 'jobs'}</span>
                <span>{jobs.filter(j => j.active).length} active &nbsp;·&nbsp; {jobs.filter(j => !j.active).length} inactive</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default ManageJobs;