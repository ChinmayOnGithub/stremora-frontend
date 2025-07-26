import axios from 'axios';
import { getEnvVariable } from './utils';

const API_BASE_URL = getEnvVariable("VITE_API_BASE_URL");

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor to add auth token if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Admin API endpoints
export const adminApi = {
  getUsers: () => apiClient.get('/admin/users'),
  deleteUser: (userId) => apiClient.delete(`/admin/users/${userId}`),
  getVideos: () => apiClient.get('/admin/videos'),
  deleteVideo: (videoId) => apiClient.delete(`/admin/videos/${videoId}`),
  updateUser: (userId, data) => apiClient.patch(`/admin/users/${userId}`, data),
  updateVideo: (videoId, data) => apiClient.patch(`/admin/videos/${videoId}`, data),
};

export default apiClient;
