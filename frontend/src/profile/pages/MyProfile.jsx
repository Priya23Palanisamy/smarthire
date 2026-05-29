import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import profileService from '../services/profileService';
import { useAuth } from '../../auth/context/AuthContext';

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Modals / Item states for sub-entities CRUD
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [editingSkillId, setEditingSkillId] = useState(null);

  const [showEduModal, setShowEduModal] = useState(false);
  const [eduForm, setEduForm] = useState({ degree: '', college: '', startYear: '', endYear: '', cgpa: '' });
  const [editingEduId, setEditingEduId] = useState(null);

  const [showExpModal, setShowExpModal] = useState(false);
  const [expForm, setExpForm] = useState({ companyName: '', role: '', yearsOfExperience: '', description: '' });
  const [editingExpId, setEditingExpId] = useState(null);

  const [showCertModal, setShowCertModal] = useState(false);
  const [certForm, setCertForm] = useState({ name: '', issuer: '', issueDate: '', description: '' });
  const [editingCertId, setEditingCertId] = useState(null);

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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Local validation
    if (file.size > 2 * 1024 * 1024) {
      alert('File size exceeds 2MB limit!');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);
      const response = await profileService.uploadProfileImage(formData);
      setProfile(response.data);
      alert('Profile picture updated successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to upload profile picture.');
    } finally {
      setLoading(false);
    }
  };

  // Skill CRUD Handlers
  const handleSaveSkill = async () => {
    if (!skillInput.trim()) return;
    try {
      let res;
      if (editingSkillId) {
        res = await profileService.updateSkill(editingSkillId, { name: skillInput });
      } else {
        res = await profileService.addSkill({ name: skillInput });
      }
      setProfile(res.data);
      setSkillInput('');
      setEditingSkillId(null);
      setShowSkillModal(false);
    } catch (err) {
      alert('Error saving skill');
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      const res = await profileService.deleteSkill(id);
      setProfile(res.data);
    } catch (err) {
      alert('Error deleting skill');
    }
  };

  // Education CRUD Handlers
  const handleSaveEdu = async () => {
    if (!eduForm.degree || !eduForm.college || !eduForm.startYear) {
      alert('Please fill out degree, college, and start year.');
      return;
    }
    try {
      let res;
      if (editingEduId) {
        res = await profileService.updateEducation(editingEduId, eduForm);
      } else {
        res = await profileService.addEducation(eduForm);
      }
      setProfile(res.data);
      setEduForm({ degree: '', college: '', startYear: '', endYear: '', cgpa: '' });
      setEditingEduId(null);
      setShowEduModal(false);
    } catch (err) {
      alert('Error saving education entry');
    }
  };

  const handleDeleteEdu = async (id) => {
    if (!window.confirm('Delete this education entry?')) return;
    try {
      const res = await profileService.deleteEducation(id);
      setProfile(res.data);
    } catch (err) {
      alert('Error deleting education');
    }
  };

  // Experience CRUD Handlers
  const handleSaveExp = async () => {
    if (!expForm.companyName || !expForm.role || !expForm.yearsOfExperience) {
      alert('Please fill out company, role, and years of experience.');
      return;
    }
    try {
      let res;
      if (editingExpId) {
        res = await profileService.updateExperience(editingExpId, expForm);
      } else {
        res = await profileService.addExperience(expForm);
      }
      setProfile(res.data);
      setExpForm({ companyName: '', role: '', yearsOfExperience: '', description: '' });
      setEditingExpId(null);
      setShowExpModal(false);
    } catch (err) {
      alert('Error saving experience entry');
    }
  };

  const handleDeleteExp = async (id) => {
    if (!window.confirm('Delete this experience entry?')) return;
    try {
      const res = await profileService.deleteExperience(id);
      setProfile(res.data);
    } catch (err) {
      alert('Error deleting experience');
    }
  };

  // Certificate CRUD Handlers
  const handleSaveCert = async () => {
    if (!certForm.name || !certForm.issuer) {
      alert('Please fill out certificate name and issuer.');
      return;
    }
    try {
      let res;
      if (editingCertId) {
        res = await profileService.updateCertificate(editingCertId, certForm);
      } else {
        res = await profileService.addCertificate(certForm);
      }
      setProfile(res.data);
      setCertForm({ name: '', issuer: '', issueDate: '', description: '' });
      setEditingCertId(null);
      setShowCertModal(false);
    } catch (err) {
      alert('Error saving certificate entry');
    }
  };

  const handleDeleteCert = async (id) => {
    if (!window.confirm('Delete this certificate?')) return;
    try {
      const res = await profileService.deleteCertificate(id);
      setProfile(res.data);
    } catch (err) {
      alert('Error deleting certificate');
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

  if (error || !profile) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger">{error || 'Unable to load profile.'}</div>
        <Link to="/login" className="btn btn-primary">Back to Login</Link>
      </div>
    );
  }

  const profilePicUrl = profile.profileImageUrl
    ? `http://localhost:8080/api/profile/image/${profile.profileImageUrl}`
    : 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="row">
        {/* SIDEBAR NAVIGATION */}
        <div className="col-md-3 mb-4">
          <div className="card shadow border-0 p-3 text-center rounded-3">
            <div className="position-relative d-inline-block mx-auto mb-3">
              <img
                src={profilePicUrl}
                alt="Profile"
                className="rounded-circle border border-3 border-primary shadow"
                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
              />
              <label className="btn btn-primary btn-sm position-absolute bottom-0 end-0 rounded-circle p-1 shadow" style={{ cursor: 'pointer' }}>
                <i className="bi bi-camera-fill"></i> Camera
                <input type="file" onChange={handleImageUpload} className="d-none" accept="image/*" />
              </label>
            </div>
            <h4 className="fw-bold mb-1 text-primary">{profile.fullName || 'No Name Provided'}</h4>
            <p className="text-muted small mb-3">@{profile.username}</p>

            {/* Profile Completion Bar */}
            <div className="mb-4 text-start">
              <div className="d-flex justify-content-between mb-1">
                <span className="small fw-bold">Completion</span>
                <span className="small text-primary fw-bold">{profile.completionPercentage}%</span>
              </div>
              <div className="progress" style={{ height: '8px' }}>
                <div
                  className={`progress-bar progress-bar-striped progress-bar-animated ${profile.completionPercentage < 50 ? 'bg-danger' : profile.completionPercentage < 80 ? 'bg-warning' : 'bg-success'}`}
                  role="progressbar"
                  style={{ width: `${profile.completionPercentage}%` }}
                ></div>
              </div>
            </div>

            <hr />

            <div className="d-grid gap-2 text-start">
              <Link to="/profile/edit" className="btn btn-outline-primary rounded-pill btn-sm text-start ps-3">
                <i className="bi bi-pencil-square me-2"></i> Edit Details
              </Link>
              <Link to="/profile/resume" className="btn btn-outline-primary rounded-pill btn-sm text-start ps-3">
                <i className="bi bi-file-earmark-pdf me-2"></i> Resume Upload
              </Link>
              <button onClick={() => navigate('/dashboard')} className="btn btn-outline-secondary rounded-pill btn-sm text-start ps-3">
                <i className="bi bi-speedometer2 me-2"></i> Dashboard Home
              </button>
              <button onClick={logout} className="btn btn-outline-danger rounded-pill btn-sm text-start ps-3 mt-3">
                <i className="bi bi-box-arrow-right me-2"></i> Logout
              </button>
            </div>
          </div>
        </div>

        {/* PROFILE BODY */}
        <div className="col-md-9">
          {/* Main Info Card */}
          <div className="card shadow border-0 p-4 mb-4 rounded-3">
            <h5 className="border-bottom pb-2 fw-bold text-dark">
              <i className="bi bi-person-fill text-primary me-2"></i>About Me
            </h5>
            <p className="text-secondary">{profile.bio || 'Provide a professional bio to attract recruiters!'}</p>

            <div className="row mt-3 text-start">
              <div className="col-md-6 mb-2">
                <strong><i className="bi bi-gender-ambiguous me-2 text-muted"></i>Gender:</strong> <span className="text-secondary">{profile.gender || 'Not specified'}</span>
              </div>
              <div className="col-md-6 mb-2">
                <strong><i className="bi bi-calendar-event me-2 text-muted"></i>DOB:</strong> <span className="text-secondary">{profile.dob || 'Not specified'}</span>
              </div>
              <div className="col-md-6 mb-2">
                <strong><i className="bi bi-geo-alt me-2 text-muted"></i>Address:</strong> <span className="text-secondary">{profile.address || 'Not specified'}</span>
              </div>
              <div className="col-md-6 mb-2">
                <strong><i className="bi bi-telephone me-2 text-muted"></i>Phone:</strong> <span className="text-secondary">{profile.phoneNumber || 'Not specified'}</span>
              </div>
              <div className="col-md-6 mb-2">
                <strong><i className="bi bi-envelope me-2 text-muted"></i>Email:</strong> <span className="text-secondary">{profile.email || 'Not specified'}</span>
              </div>
            </div>

            <div className="mt-3">
              {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary rounded-pill btn-sm me-2">
                  <i className="bi bi-linkedin me-1"></i> LinkedIn
                </a>
              )}
              {profile.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark rounded-pill btn-sm">
                  <i className="bi bi-github me-1"></i> GitHub
                </a>
              )}
            </div>
          </div>

          {/* Resume Section */}
          <div className="card shadow border-0 p-4 mb-4 rounded-3">
            <h5 className="border-bottom pb-2 fw-bold text-dark d-flex justify-content-between align-items-center">
              <span><i className="bi bi-file-earmark-text text-primary me-2"></i>My Resume</span>
              <Link to="/profile/resume" className="btn btn-sm btn-primary rounded-pill">Manage</Link>
            </h5>
            {profile.resume ? (
              <div className="d-flex align-items-center p-3 border rounded bg-light">
                <i className="bi bi-file-earmark-pdf-fill text-danger fs-1 me-3"></i>
                <div className="flex-grow-1">
                  <h6 className="mb-0 fw-bold">{profile.resume.fileName}</h6>
                  <span className="small text-muted">{profile.resume.fileType}</span>
                </div>
                <a
                  href={`http://localhost:8080/api/profile/download-resume`}
                  className="btn btn-sm btn-success rounded-pill px-3"
                  download
                >
                  <i className="bi bi-download me-1"></i> Download
                </a>
              </div>
            ) : (
              <p className="text-secondary text-center py-3">No resume uploaded. Recruiters won't be able to review your experience!</p>
            )}
          </div>

          {/* Skills Section */}
          <div className="card shadow border-0 p-4 mb-4 rounded-3">
            <h5 className="border-bottom pb-2 fw-bold text-dark d-flex justify-content-between align-items-center">
              <span><i className="bi bi-lightbulb-fill text-primary me-2"></i>Skills</span>
              <button className="btn btn-sm btn-primary rounded-pill" onClick={() => { setEditingSkillId(null); setSkillInput(''); setShowSkillModal(true); }}>
                + Add
              </button>
            </h5>
            <div className="d-flex flex-wrap gap-2 pt-2">
              {profile.skills && profile.skills.length > 0 ? (
                profile.skills.map((s) => (
                  <span key={s.id} className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fs-6 d-flex align-items-center">
                    {s.name}
                    <i
                      className="bi bi-pencil-fill ms-2 small text-secondary cursor-pointer"
                      onClick={() => { setEditingSkillId(s.id); setSkillInput(s.name); setShowSkillModal(true); }}
                      style={{ cursor: 'pointer' }}
                    ></i>
                    <i
                      className="bi bi-x-circle-fill ms-2 small text-danger cursor-pointer"
                      onClick={() => handleDeleteSkill(s.id)}
                      style={{ cursor: 'pointer' }}
                    ></i>
                  </span>
                ))
              ) : (
                <p className="text-secondary">No skills listed yet.</p>
              )}
            </div>
          </div>

          {/* Experience Section */}
          <div className="card shadow border-0 p-4 mb-4 rounded-3">
            <h5 className="border-bottom pb-2 fw-bold text-dark d-flex justify-content-between align-items-center">
              <span><i className="bi bi-briefcase-fill text-primary me-2"></i>Work Experience</span>
              <button className="btn btn-sm btn-primary rounded-pill" onClick={() => { setEditingExpId(null); setExpForm({ companyName: '', role: '', yearsOfExperience: '', description: '' }); setShowExpModal(true); }}>
                + Add
              </button>
            </h5>
            {profile.experienceList && profile.experienceList.length > 0 ? (
              profile.experienceList.map((e) => (
                <div key={e.id} className="border-bottom py-3 last-no-border">
                  <div className="d-flex justify-content-between">
                    <h6 className="fw-bold mb-1 text-primary">{e.role} at {e.companyName}</h6>
                    <div>
                      <button className="btn btn-sm btn-light border-0 me-1" onClick={() => { setEditingExpId(e.id); setExpForm(e); setShowExpModal(true); }}>
                        <i className="bi bi-pencil text-muted"></i>
                      </button>
                      <button className="btn btn-sm btn-light border-0 text-danger" onClick={() => handleDeleteExp(e.id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                  <span className="small text-muted">{e.yearsOfExperience} Years of Experience</span>
                  <p className="mb-0 mt-2 text-secondary small">{e.description}</p>
                </div>
              ))
            ) : (
              <p className="text-secondary">No work experience listed yet.</p>
            )}
          </div>

          {/* Education Section */}
          <div className="card shadow border-0 p-4 mb-4 rounded-3">
            <h5 className="border-bottom pb-2 fw-bold text-dark d-flex justify-content-between align-items-center">
              <span><i className="bi bi-mortarboard-fill text-primary me-2"></i>Education</span>
              <button className="btn btn-sm btn-primary rounded-pill" onClick={() => { setEditingEduId(null); setEduForm({ degree: '', college: '', startYear: '', endYear: '', cgpa: '' }); setShowEduModal(true); }}>
                + Add
              </button>
            </h5>
            {profile.educationList && profile.educationList.length > 0 ? (
              profile.educationList.map((edu) => (
                <div key={edu.id} className="border-bottom py-3 last-no-border">
                  <div className="d-flex justify-content-between">
                    <h6 className="fw-bold mb-1 text-primary">{edu.degree}</h6>
                    <div>
                      <button className="btn btn-sm btn-light border-0 me-1" onClick={() => { setEditingEduId(edu.id); setEduForm(edu); setShowEduModal(true); }}>
                        <i className="bi bi-pencil text-muted"></i>
                      </button>
                      <button className="btn btn-sm btn-light border-0 text-danger" onClick={() => handleDeleteEdu(edu.id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                  <div className="small text-muted">{edu.college} ({edu.startYear} - {edu.endYear || 'Present'})</div>
                  {edu.cgpa && <div className="small text-success fw-bold mt-1">CGPA/Percentage: {edu.cgpa}</div>}
                </div>
              ))
            ) : (
              <p className="text-secondary">No education details listed yet.</p>
            )}
          </div>

          {/* Certificates Section */}
          <div className="card shadow border-0 p-4 rounded-3">
            <h5 className="border-bottom pb-2 fw-bold text-dark d-flex justify-content-between align-items-center">
              <span><i className="bi bi-patch-check-fill text-primary me-2"></i>Certificates</span>
              <button className="btn btn-sm btn-primary rounded-pill" onClick={() => { setEditingCertId(null); setCertForm({ name: '', issuer: '', issueDate: '', description: '' }); setShowCertModal(true); }}>
                + Add
              </button>
            </h5>
            {profile.certificates && profile.certificates.length > 0 ? (
              profile.certificates.map((c) => (
                <div key={c.id} className="border-bottom py-3 last-no-border">
                  <div className="d-flex justify-content-between">
                    <h6 className="fw-bold mb-1 text-primary">{c.name}</h6>
                    <div>
                      <button className="btn btn-sm btn-light border-0 me-1" onClick={() => { setEditingCertId(c.id); setCertForm(c); setShowCertModal(true); }}>
                        <i className="bi bi-pencil text-muted"></i>
                      </button>
                      <button className="btn btn-sm btn-light border-0 text-danger" onClick={() => handleDeleteCert(c.id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                  <div className="small text-muted">Issued by {c.issuer} {c.issueDate && `on ${c.issueDate}`}</div>
                  {c.description && <p className="mb-0 mt-2 text-secondary small">{c.description}</p>}
                </div>
              ))
            ) : (
              <p className="text-secondary">No certificates added yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* skill CRUD modal */}
      {showSkillModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">{editingSkillId ? 'Update Skill' : 'Add New Skill'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowSkillModal(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter skill name (e.g. Java, React)"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary btn-sm" onClick={() => setShowSkillModal(false)}>Close</button>
                <button className="btn btn-primary btn-sm" onClick={handleSaveSkill}>Save Skill</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* education CRUD modal */}
      {showEduModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">{editingEduId ? 'Edit Education' : 'Add Education'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowEduModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label small">Degree / Major</label>
                  <input type="text" className="form-control" value={eduForm.degree} onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })} placeholder="B.Tech, MBA, High School" />
                </div>
                <div className="mb-3">
                  <label className="form-label small">College / University</label>
                  <input type="text" className="form-control" value={eduForm.college} onChange={(e) => setEduForm({ ...eduForm, college: e.target.value })} placeholder="Harvard, ABC University" />
                </div>
                <div className="row">
                  <div className="col mb-3">
                    <label className="form-label small">Start Year</label>
                    <input type="number" className="form-control" value={eduForm.startYear} onChange={(e) => setEduForm({ ...eduForm, startYear: parseInt(e.target.value) || '' })} placeholder="2018" />
                  </div>
                  <div className="col mb-3">
                    <label className="form-label small">End Year</label>
                    <input type="number" className="form-control" value={eduForm.endYear} onChange={(e) => setEduForm({ ...eduForm, endYear: parseInt(e.target.value) || '' })} placeholder="2022" />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label small">CGPA / Percentage (optional)</label>
                  <input type="number" step="0.01" className="form-control" value={eduForm.cgpa} onChange={(e) => setEduForm({ ...eduForm, cgpa: parseFloat(e.target.value) || '' })} placeholder="9.5" />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary btn-sm" onClick={() => setShowEduModal(false)}>Close</button>
                <button className="btn btn-primary btn-sm" onClick={handleSaveEdu}>Save Education</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* experience CRUD modal */}
      {showExpModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">{editingExpId ? 'Edit Experience' : 'Add Experience'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowExpModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label small">Company Name</label>
                  <input type="text" className="form-control" value={expForm.companyName} onChange={(e) => setExpForm({ ...expForm, companyName: e.target.value })} placeholder="Google, Amazon" />
                </div>
                <div className="mb-3">
                  <label className="form-label small">Role / Designation</label>
                  <input type="text" className="form-control" value={expForm.role} onChange={(e) => setExpForm({ ...expForm, role: e.target.value })} placeholder="Software Engineer" />
                </div>
                <div className="mb-3">
                  <label className="form-label small">Years of Experience</label>
                  <input type="number" className="form-control" value={expForm.yearsOfExperience} onChange={(e) => setExpForm({ ...expForm, yearsOfExperience: parseInt(e.target.value) || '' })} placeholder="3" />
                </div>
                <div className="mb-3">
                  <label className="form-label small">Description / Key Responsibilities</label>
                  <textarea rows="3" className="form-control" value={expForm.description} onChange={(e) => setExpForm({ ...expForm, description: e.target.value })} placeholder="Worked on React web apps, built REST APIs..." />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary btn-sm" onClick={() => setShowExpModal(false)}>Close</button>
                <button className="btn btn-primary btn-sm" onClick={handleSaveExp}>Save Experience</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* certificate CRUD modal */}
      {showCertModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">{editingCertId ? 'Edit Certificate' : 'Add Certificate'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowCertModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label small">Certificate Name</label>
                  <input type="text" className="form-control" value={certForm.name} onChange={(e) => setCertForm({ ...certForm, name: e.target.value })} placeholder="AWS Solutions Architect" />
                </div>
                <div className="mb-3">
                  <label className="form-label small">Issuer / Credential Provider</label>
                  <input type="text" className="form-control" value={certForm.issuer} onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })} placeholder="Amazon Web Services, Coursera" />
                </div>
                <div className="mb-3">
                  <label className="form-label small">Issue Date</label>
                  <input type="date" className="form-control" value={certForm.issueDate} onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label small">Description (optional)</label>
                  <textarea rows="2" className="form-control" value={certForm.description} onChange={(e) => setCertForm({ ...certForm, description: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary btn-sm" onClick={() => setShowCertModal(false)}>Close</button>
                <button className="btn btn-primary btn-sm" onClick={handleSaveCert}>Save Certificate</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
