import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import profileService from '../services/profileService';



const ResumeUpload = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await profileService.getMyProfile();
      setProfile(response.data);
    } catch (err) {
      setError('Failed to fetch profile details.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // File validation: Size <= 5MB
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert('Resume exceeds 5MB limit!');
      e.target.value = null;
      return;
    }

    // File validation: Extension
    const allowedExtensions = /(\.pdf|\.doc|\.docx)$/i;
    if (!allowedExtensions.exec(selectedFile.name)) {
      alert('Invalid file format! Allowed: PDF, DOC, DOCX');
      e.target.value = null;
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a resume file first');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);
    try {
      const response = await profileService.uploadResume(formData);
      setProfile(response.data);
      setFile(null);
      alert('Resume uploaded successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your current resume? This action cannot be undone.')) return;

    setUploading(true);
    try {
      await profileService.deleteResume();
      alert('Resume deleted successfully!');
      fetchProfile();
    } catch (err) {
      alert('Failed to delete resume');
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadResume = async () => {
  try {
    const response = await profileService.downloadResume();

    const blob = new Blob([response.data]);

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;

    // Optional filename
    link.setAttribute(
      'download',
      profile?.resume?.fileName || 'resume'
    );

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.error(err);
    alert('Failed to download resume');
  }
};

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-12">
          <div className="card shadow border-0 rounded-3 p-4">
            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
              <h4 className="fw-bold mb-0 text-primary">
                <i className="bi bi-file-earmark-pdf-fill me-2"></i>Resume Management
              </h4>
              <button onClick={() => navigate('/profile')} className="btn btn-outline-secondary btn-sm rounded-pill">
                Back
              </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {profile?.resume ? (
              <div className="mb-4">
                <div className="alert alert-success d-flex align-items-center rounded-3 mb-3">
                  <i className="bi bi-check-circle-fill fs-4 me-3"></i>
                  <div>
                    <h6 className="mb-0 fw-bold">Resume Active & Searchable</h6>
                    <span className="small">Your resume is successfully loaded on your profile.</span>
                  </div>
                </div>

                <div className="border rounded bg-light p-3 d-flex align-items-center mb-3">
                  <i className="bi bi-file-earmark-text-fill text-primary fs-1 me-3"></i>
                  <div className="flex-grow-1">
                    <h6 className="mb-1 text-dark fw-bold">{profile.resume.fileName}</h6>
                    <span className="small text-muted">{profile.resume.fileType}</span>
                  </div>
                </div>

                <div className="d-flex gap-2 justify-content-end">
                  <button
                  type="button"
  onClick={handleDownloadResume}
  className="btn btn-sm btn-success rounded-pill px-3"
>
  <i className="bi bi-download me-1"></i> Download File
</button>
                  <button
                    onClick={handleDelete}
                    disabled={uploading}
                    className="btn btn-sm btn-outline-danger rounded-pill px-3"
                  >
                    <i className="bi bi-trash me-1"></i> Delete Resume
                  </button>
                </div>
              </div>
            ) : (
              <div className="alert alert-warning text-center rounded-3 mb-4">
                <i className="bi bi-exclamation-triangle fs-3 d-block mb-2"></i>
                <h6 className="fw-bold">No Resume Found!</h6>
                <span className="small text-secondary">Upload a resume (PDF, DOC, DOCX) up to 5MB to enable search and quick applications.</span>
              </div>
            )}

            <form onSubmit={handleUpload} className="mt-4 pt-3 border-top">
              <h5 className="fw-bold mb-3 text-dark">{profile?.resume ? 'Replace Current Resume' : 'Upload New Resume'}</h5>
              <div className="mb-3">
                <label className="form-label small text-muted">Allowed formats: PDF, DOC, DOCX (Max 5MB)</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={uploading || !file}
                className="btn btn-primary w-100 py-2 rounded-pill shadow-sm fw-bold"
              >
                {uploading ? 'Uploading File...' : 'Upload Resume'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
