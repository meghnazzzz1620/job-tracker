import axios from "axios";

// ✅ USE RAILWAY BACKEND URL
const API_BASE_URL = "https://job-tracker-production-fe66.up.railway.app";

export const signup = (user) => {
  return axios.post(`${API_BASE_URL}/auth/signup`, user);
};

export const login = (user) => {
  return axios.post(`${API_BASE_URL}/auth/login`, user);
};
