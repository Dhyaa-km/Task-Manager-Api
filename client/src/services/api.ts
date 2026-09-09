import axios from "axios";

const api = axios.create({
  baseURL: "https://task-manager-api-8ma3.onrender.com/api",
  withCredentials: true,
});

export const setAccessToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export default api;