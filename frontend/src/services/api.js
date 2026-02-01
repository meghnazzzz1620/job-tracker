import axios from "axios";

export const api = axios.create({
  baseURL: "https://job-tracker-backend.onrender.com",
});

export const getJobs = () => api.get("/jobs");

export const createJob = (job) => api.post("/jobs", job);

export const updateJobStatus = (jobId, status) =>
  api.put(`/jobs/${jobId}/status`, { status });

export const deleteJob = (jobId) => api.delete(`/jobs/${jobId}`);
