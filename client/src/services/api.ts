import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Use env var in production
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user.token && config.headers) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
});

export default api;
