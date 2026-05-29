import axios from 'axios';

const API_URL = 'http://localhost:8080/api/recruiter';

// Helper to get authorization header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Recruiter Profile APIs
const getProfile = () => {
  return axios.get(`${API_URL}/profile`, { headers: getAuthHeader() });
};

const createProfile = (profileData) => {
  return axios.post(`${API_URL}/profile`, profileData, { headers: getAuthHeader() });
};

const updateProfile = (profileData) => {
  return axios.put(`${API_URL}/profile`, profileData, { headers: getAuthHeader() });
};

// Job CRUD APIs
const createJob = (jobData) => {
  return axios.post(`${API_URL}/jobs`, jobData, { headers: getAuthHeader() });
};

const getMyJobs = () => {
  return axios.get(`${API_URL}/jobs`, { headers: getAuthHeader() });
};

const getJobById = (id) => {
  return axios.get(`${API_URL}/jobs/${id}`, { headers: getAuthHeader() });
};

const updateJob = (id, jobData) => {
  return axios.put(`${API_URL}/jobs/${id}`, jobData, { headers: getAuthHeader() });
};

const deleteJob = (id) => {
  return axios.delete(`${API_URL}/jobs/${id}`, { headers: getAuthHeader() });
};

// Application APIs
const getApplications = () => {
  return axios.get(`${API_URL}/applications`, { headers: getAuthHeader() });
};

const getJobApplications = (jobId) => {
  return axios.get(`${API_URL}/jobs/${jobId}/applications`, { headers: getAuthHeader() });
};

const updateApplicationStatus = (applicationId, statusData) => {
  return axios.put(`${API_URL}/application-status/${applicationId}`, statusData, { headers: getAuthHeader() });
};

const recruiterService = {
  getProfile,
  createProfile,
  updateProfile,
  createJob,
  getMyJobs,
  getJobById,
  updateJob,
  deleteJob,
  getApplications,
  getJobApplications,
  updateApplicationStatus,
};

export default recruiterService;
