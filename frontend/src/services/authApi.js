import axios from "axios";

const API_BASE_URL = "http://localhost:8083";

export const signup = (user) => {
  return axios.post(`${API_BASE_URL}/auth/signup`, user);
};

export const login = (user) => {
  return axios.post(`${API_BASE_URL}/auth/login`, user);
};
