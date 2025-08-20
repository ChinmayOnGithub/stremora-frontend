// // src/lib/axios.js

// import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// const axiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   withCredentials: true,
// });

// // This interceptor attaches the latest access token to every outgoing request.
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // This logic prevents multiple refresh calls from firing at once.
// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach(prom => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// // This interceptor handles responses, specifically looking for token expiration errors.
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         // If a refresh is already in progress, we add the failed request to a queue
//         return new Promise(function (resolve, reject) {
//           failedQueue.push({ resolve, reject });
//         })
//           .then(token => {
//             originalRequest.headers['Authorization'] = 'Bearer ' + token;
//             return axiosInstance(originalRequest);
//           })
//           .catch(err => {
//             return Promise.reject(err);
//           });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         console.log("Access token expired. Attempting to refresh...");
//         const refreshToken = localStorage.getItem("refreshToken");
//         if (!refreshToken) throw new Error("No refresh token available.");

//         // We use the default axios here to avoid an interceptor loop
//         const response = await axios.post(`${API_BASE_URL}/users/refresh-token`, {
//           refreshToken,
//         });

//         const { accessToken, refreshToken: newRefreshToken } = response.data.data;

//         localStorage.setItem("accessToken", accessToken);
//         localStorage.setItem("refreshToken", newRefreshToken);

//         // Retry the original request and process the queue
//         originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
//         processQueue(null, accessToken);

//         console.log("Token refreshed successfully. Retrying original request.");
//         return axiosInstance(originalRequest);

//       } catch (refreshError) {
//         console.error("Refresh token is invalid or expired. Logging out.", refreshError);
//         processQueue(refreshError, null);

//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("refreshToken");
//         localStorage.removeItem("user");

//         window.location.href = '/login';
//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;


import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://stremora-backend-1.onrender.com/api/v1';
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Create separate instances to avoid interceptor loops
const refreshAxios = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor to attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Track refresh status to prevent concurrent attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor for handling token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.log("API Error:", error.response?.status, error.response?.data);

    // Handle both 401 AND 500 errors (since your backend might return 500)
    const shouldRefresh = (error.response?.status === 401 || error.response?.status === 500)
      && !originalRequest._retry
      && !originalRequest.url?.includes('/refresh-token');

    if (shouldRefresh) {
      if (isRefreshing) {
        // Queue the request if refresh is already in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("Token expired/invalid. Attempting to refresh...");

        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Use separate axios instance for refresh
        const response = await refreshAxios.post('/users/refresh-token', {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        // Update stored tokens
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // Update original request
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        // Process queued requests
        processQueue(null, accessToken);

        console.log("Token refreshed successfully. Retrying request.");
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        console.error("Refresh failed:", refreshError);

        processQueue(refreshError, null);

        // Clear all auth data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
