// src/lib/adminApi.js
import axios from 'axios'
import { getEnvVariable } from './utils'

// 1️⃣ Read the Render URL or fallback
const API_BASE_URL = getEnvVariable('VITE_BACKEND_URI')  // Should be “https://stremora-backend-1.onrender.com/api/v1”
  || getEnvVariable('VITE_API_BASE_URL')                // alternate name
  || 'https://stremora-backend-1.onrender.com/api/v1'

const apiClient = axios.create({
  baseURL: API_BASE_URL.replace(/\/$/, ''), // strip trailing slash
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
})

// 2️⃣ Attach JWT from localStorage if present
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 3️⃣ Export admin endpoints
export const adminApi = {
  getUsers: () => apiClient.get('/admin/users'),
  deleteUser: id => apiClient.delete(`/admin/users/${id}`),
  getVideos: () => apiClient.get('/admin/videos'),
  deleteVideo: id => apiClient.delete(`/admin/videos/${id}`),
  updateUser: (id, data) => apiClient.patch(`/admin/users/${id}`, data),
  updateVideo: (id, data) => apiClient.patch(`/admin/videos/${id}`, data),
}

export default apiClient
