import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import profileService from '../services/profileService';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    dob: '',
    address: '',
    bio: '',
    email: '',
    phoneNumber: '',
    linkedinUrl: '',
    githubUrl: '',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await profileService.getMyProfile();
      const p = response.data;
      setFormData({
        fullName: p.fullName || '',
        gender: p.gender || '',
        dob: p.dob || '',
        address: p.address || '',
        bio: p.bio || '',
        email: p.email || '',
        phoneNumber: p.phoneNumber || '',
        linkedinUrl: p.linkedinUrl || '',
        githubUrl: p.githubUrl || '',
      });
    } catch (err) {
      setError('Failed to fetch profile details.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validations
    if (!formData.fullName.trim()) {
      alert('Full Name is required');
      return;
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    setSubmitting(true);
    try {
      await profileService.updateProfile(formData);
      alert('Profile updated successfully!');
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
    } finally {
      setSubmitting(false);
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
        <div className="col-lg-8">
          <div className="card shadow border-0 rounded-3 p-4">
            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
              <h4 className="fw-bold mb-0 text-primary">
                <i className="bi bi-person-bounding-box me-2"></i>Edit Profile Details
              </h4>
              <button onClick={() => navigate('/profile')} className="btn btn-outline-secondary btn-sm rounded-pill">
                Cancel
              </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <h5 className="fw-bold text-dark mb-3">1. Personal Information</h5>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Full Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Gender</label>
                  <select name="gender" className="form-select" value={formData.gender} onChange={handleChange}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    className="form-control"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Professional Summary / Bio</label>
                <textarea
                  name="bio"
                  rows="4"
                  className="form-control"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell recruiters about yourself, your career path, and achievements..."
                ></textarea>
              </div>

              <h5 className="fw-bold text-dark mb-3 mt-4">2. Contact & Socials</h5>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Contact Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your-email@example.com"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    className="form-control"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+1234567890"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    name="linkedinUrl"
                    className="form-control"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">GitHub Profile URL</label>
                  <input
                    type="url"
                    name="githubUrl"
                    className="form-control"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 border-top d-flex justify-content-end gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="btn btn-light px-4 rounded-pill"
                >
                  Back to Dashboard
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary px-4 rounded-pill shadow-sm"
                >
                  {submitting ? 'Saving Changes...' : 'Save Profile Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
