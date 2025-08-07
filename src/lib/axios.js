// src/lib/axios.js
import axios from 'axios';

// 1️⃣ Pick up the Render URL or fall back to localhost:
const backendUri = import.meta.env.VITE_BACKEND_URI   // e.g. “https://stremora-backend-1.onrender.com/api/v1”
const baseUrlEnv = import.meta.env.VITE_BASE_URL    // e.g. “https://stremora-backend-1.onrender.com”

// 2️⃣ Derive apiRoot (no trailing slash):
const apiRoot = (backendUri ?? baseUrlEnv ?? 'https://stremora-backend-1.onrender.com')
  .replace(/\/$/, '')

// 3️⃣ Ensure “/api/v1” exactly once:
const baseURL = apiRoot.endsWith('/api/v1')
  ? apiRoot
  : `${apiRoot}/api/v1`

// 4️⃣ Create the Axios instance
const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
})

// 5️⃣ Request logging
axiosInstance.interceptors.request.use(config => {
  console.log('%c[API Request]', 'color: #2563eb; font-weight: bold', {
    url: `${config.baseURL}${config.url}`,
    method: config.method?.toUpperCase(),
    withCredentials: config.withCredentials,
    timestamp: new Date().toISOString(),
  })
  return config
})

// 6️⃣ Error logging
axiosInstance.interceptors.response.use(
  res => res,
  err => {
    console.error('%c[API Error]', 'color: #dc2626; font-weight: bold', {
      url: `${err.config?.baseURL}${err.config?.url}`,
      method: err.config?.method?.toUpperCase(),
      status: err.response?.status,
      data: err.response?.data,
      timestamp: new Date().toISOString(),
      errorMessage: err.message,
    })
    return Promise.reject(err)
  }
)

// Add this to interceptors
axiosInstance.interceptors.request.use(config => {
  config.withCredentials = true;  // Ensure credentials are always sent
  return config;
});
export default axiosInstance
