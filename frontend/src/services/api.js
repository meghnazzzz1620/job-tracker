import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

/* ---------------- JOB APIs ---------------- */

export const getJobs = () => api.get("/jobs");

export const createJob = (job) => api.post("/jobs", job);

export const updateJobStatus = (jobId, status) =>
  api.put(`/jobs/${jobId}/status`, { status });

export const deleteJob = (jobId) => api.delete(`/jobs/${jobId}`);

/* ---------------- AUTH APIs ---------------- */

export const signup = (user) => api.post("/auth/signup", user);

export const login = (user) => api.post("/auth/login", user);
