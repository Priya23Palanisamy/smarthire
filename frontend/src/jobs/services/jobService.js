import axios from 'axios';

const API_URL = 'http://localhost:8080/api/jobs';

// Helper to get authorization header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Public Job Search
const getActiveJobs = (params = {}) => {
  return axios.get(API_URL, { params });
};

// Public Job Details
const getJobById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

// Authenticated Candidate Apply
const applyForJob = (jobId, coverLetterData) => {
  return axios.post(`${API_URL}/apply/${jobId}`, coverLetterData, { headers: getAuthHeader() });
};

// Authenticated My Applications
const getMyApplications = () => {
  return axios.get(`${API_URL}/my-applications`, { headers: getAuthHeader() });
};

// Authenticated Save Job
const saveJob = (jobId) => {
  return axios.post(`${API_URL}/save/${jobId}`, {}, { headers: getAuthHeader() });
};

// Authenticated Unsave Job
const unsaveJob = (jobId) => {
  return axios.delete(`${API_URL}/unsave/${jobId}`, { headers: getAuthHeader() });
};

// Authenticated Get Saved Jobs
const getSavedJobs = () => {
  return axios.get(`${API_URL}/saved`, { headers: getAuthHeader() });
};

// Authenticated Get Saved Job IDs
const getSavedJobIds = () => {
  return axios.get(`${API_URL}/saved-ids`, { headers: getAuthHeader() });
};

const jobService = {
  getActiveJobs,
  getJobById,
  applyForJob,
  getMyApplications,
  saveJob,
  unsaveJob,
  getSavedJobs,
  getSavedJobIds,
};

export default jobService;
