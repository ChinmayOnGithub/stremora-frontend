// axios.js
import axios from 'axios';

const baseURL = import.meta.env.VITE_BACKEND_URI || 'https://stremora-backend-1.onrender.com/api/v1';

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use((config) => {
  console.log('%c[API Request]', 'color: #2563eb; font-weight: bold', {
    url: `${config.baseURL}${config.url}`,
    method: config.method?.toUpperCase(),
    headers: config.headers,
    withCredentials: config.withCredentials,
    timestamp: new Date().toISOString()
  });
  return config;
});

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('%c[API Error]', 'color: #dc2626; font-weight: bold', {
      url: `${error.config?.baseURL}${error.config?.url}`,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      timestamp: new Date().toISOString(),
      errorMessage: error.message
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;
