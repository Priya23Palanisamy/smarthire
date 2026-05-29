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

  if (!profile) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">

      <h2>Recruiter Profile</h2>

      {/* VIEW MODE */}
      {!editMode && (
        <div className="card p-4 shadow-sm mt-3">
          <p><b>Company:</b> {profile.companyName}</p>
          <p><b>Email:</b> {profile.contactEmail}</p>
          <p><b>Website:</b> {profile.website}</p>
          <p><b>Location:</b> {profile.companyLocation}</p>
          <p><b>Description:</b> {profile.companyDescription}</p>

          <button
            className="btn btn-primary"
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
        </div>
      )}

      {/* EDIT MODE */}
      {editMode && (
        <form onSubmit={handleSubmit} className="card p-4 shadow mt-3">

          <input name="companyName" value={formData.companyName} onChange={handleChange} className="form-control mb-2" />
          <input name="website" value={formData.website} onChange={handleChange} className="form-control mb-2" />
          <input name="companyLocation" value={formData.companyLocation} onChange={handleChange} className="form-control mb-2" />
          <input name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="form-control mb-2" />

          <textarea name="companyDescription" value={formData.companyDescription} onChange={handleChange} className="form-control mb-2" />

          <button className="btn btn-success">Save</button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>

        </form>
      )}

    </div>
  );
};

export default RecruiterProfile;