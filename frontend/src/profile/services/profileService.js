import axios from 'axios';

const API_URL = 'http://localhost:8080/api/profile';

// Helper to get authorization header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getMyProfile = () => {
  return axios.get(`${API_URL}/me`, { headers: getAuthHeader() });
};

const updateProfile = (profileData) => {
  return axios.put(`${API_URL}/update`, profileData, { headers: getAuthHeader() });
};

const uploadProfileImage = (formData) => {
  return axios.post(`${API_URL}/upload-image`, formData, {
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
};

const uploadResume = (formData) => {
  return axios.post(`${API_URL}/upload-resume`, formData, {
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
};

const deleteResume = () => {
  return axios.delete(`${API_URL}/delete-resume`, { headers: getAuthHeader() });
};

const downloadResume = () => {
  return axios.get(`${API_URL}/download-resume`, {
    headers: getAuthHeader(),
    responseType: 'blob', // Critical for file downloads
  });
};

// Skills CRUD
const addSkill = (skillData) => {
  return axios.post(`${API_URL}/add-skill`, skillData, { headers: getAuthHeader() });
};

const updateSkill = (id, skillData) => {
  return axios.put(`${API_URL}/update-skill/${id}`, skillData, { headers: getAuthHeader() });
};

const deleteSkill = (id) => {
  return axios.delete(`${API_URL}/delete-skill/${id}`, { headers: getAuthHeader() });
};

// Education CRUD
const addEducation = (eduData) => {
  return axios.post(`${API_URL}/add-education`, eduData, { headers: getAuthHeader() });
};

const updateEducation = (id, eduData) => {
  return axios.put(`${API_URL}/update-education/${id}`, eduData, { headers: getAuthHeader() });
};

const deleteEducation = (id) => {
  return axios.delete(`${API_URL}/delete-education/${id}`, { headers: getAuthHeader() });
};

// Experience CRUD
const addExperience = (expData) => {
  return axios.post(`${API_URL}/add-experience`, expData, { headers: getAuthHeader() });
};

const updateExperience = (id, expData) => {
  return axios.put(`${API_URL}/update-experience/${id}`, expData, { headers: getAuthHeader() });
};

const deleteExperience = (id) => {
  return axios.delete(`${API_URL}/delete-experience/${id}`, { headers: getAuthHeader() });
};

// Certificates CRUD
const addCertificate = (certData) => {
  return axios.post(`${API_URL}/add-certificate`, certData, { headers: getAuthHeader() });
};

const updateCertificate = (id, certData) => {
  return axios.put(`${API_URL}/update-certificate/${id}`, certData, { headers: getAuthHeader() });
};

const deleteCertificate = (id) => {
  return axios.delete(`${API_URL}/delete-certificate/${id}`, { headers: getAuthHeader() });
};

const profileService = {
  getMyProfile,
  updateProfile,
  uploadProfileImage,
  uploadResume,
  deleteResume,
  downloadResume,
  addSkill,
  updateSkill,
  deleteSkill,
  addEducation,
  updateEducation,
  deleteEducation,
  addExperience,
  updateExperience,
  deleteExperience,
  addCertificate,
  updateCertificate,
  deleteCertificate,
};

export default profileService;
