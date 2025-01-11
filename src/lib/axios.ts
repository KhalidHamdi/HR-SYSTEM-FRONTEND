import axios from 'axios';

const api = axios.create({
<<<<<<< HEAD
  baseURL: 'http://localhost:8000/api',
=======
  // baseURL: 'http://localhost:8000/api',
  baseURL: 'https://hr-system-backend.vercel.app/api',
>>>>>>> 5520b80a3d1ca799e01b2ce21951b6a2f5c64817
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;