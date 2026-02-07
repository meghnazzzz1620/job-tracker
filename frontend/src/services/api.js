import axios from "axios";

// ✅ MUST BE YOUR RAILWAY BACKEND URL
const API_BASE_URL = "https://job-tracker-production-fe66.up.railway.app";

const api = axios.create({
  baseURL: API_BASE_URL,
});

/* -------- JOB APIs -------- */

export const getJobs = () => {
  return api.get("/jobs");
};

export const createJob = (job) => {
  return api.post("/jobs", job);
};

export const updateJobStatus = (jobId, status) => {
  return api.put(`/jobs/${jobId}/status`, { status });
};

export const deleteJob = (jobId) => {
  return api.delete(`/jobs/${jobId}`);
};

export default api;
