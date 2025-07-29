// src/lib/axios.js
import axios from 'axios';

// 1️⃣ Determine the “API root” from env vars:
const backendUri = import.meta.env.VITE_BACKEND_URI
const baseUrlEnv = import.meta.env.VITE_BASE_URL

// Use VITE_BACKEND_URI if set, otherwise fall back to VITE_BASE_URL, otherwise localhost:
const apiRoot = backendUri
  ? backendUri.replace(/\/$/, '')
  : baseUrlEnv
    ? baseUrlEnv.replace(/\/$/, '')
    : 'http://localhost:8000'

// 2️⃣ Ensure “/api/v1” is in the path exactly once:
const baseURL = apiRoot.endsWith('/api/v1')
  ? apiRoot
  : `${apiRoot}/api/v1`

// 3️⃣ Create the Axios instance
const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 4️⃣ Request interceptor (logging)
axiosInstance.interceptors.request.use((config) => {
  console.log('%c[API Request]', 'color: #2563eb; font-weight: bold', {
    url: `${config.baseURL}${config.url}`,
    method: config.method?.toUpperCase(),
    withCredentials: config.withCredentials,
    timestamp: new Date().toISOString(),
  })
  return config
})

// 5️⃣ Response interceptor (logging)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('%c[API Error]', 'color: #dc2626; font-weight: bold', {
      url: `${error.config?.baseURL}${error.config?.url}`,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      timestamp: new Date().toISOString(),
      errorMessage: error.message,
    })
    return Promise.reject(error)
  }
)

export default axiosInstance
