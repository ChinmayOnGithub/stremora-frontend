import { useEffect, useState, useCallback } from 'react';
import axios from '@/lib/axios.js';

// Move cache outside to persist between renders
const CACHE_DURATION = 30000; // 30 seconds
const backendStatusCache = {
  checked: false,
  available: true,
  timestamp: 0,
  error: null
};

export function useBackendCheck() {
  const [status, setStatus] = useState({
    loading: !backendStatusCache.checked,
    available: backendStatusCache.available,
    error: null
  });
  const [retrying, setRetrying] = useState(false);

  const checkBackend = useCallback(async (force = false) => {
    // Use cache unless forced
    if (!force && backendStatusCache.checked &&
      (Date.now() - backendStatusCache.timestamp) < CACHE_DURATION) {
      return;
    }

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URI;
      if (!backendUrl) {
        console.warn("VITE_BACKEND_URI is undefined");
        throw new Error("Backend URL is not defined");
      }
      console.log("Checking backend at:", `${backendUrl}/health`); // Debug log

      const response = await axios.get(`${backendUrl}/health`, {
        timeout: 5000
      });

      console.log("Backend response:", response.data); // Debug log

      if (response.status !== 200) throw new Error('Backend not responding');

      const { status } = response.data;

      backendStatusCache.checked = true;
      backendStatusCache.available = status === 'healthy';
      backendStatusCache.timestamp = Date.now();

      setStatus({
        loading: false,
        available: status === 'healthy',
        error: status === 'degraded' ? 'Partial outage' : null
      });
      setRetrying(false);
    } catch (error) {
      console.error("Backend check error:", error); // Better error logging
      const isConnectionError = error.code === 'ECONNABORTED' || !error.response;

      backendStatusCache.checked = true;
      backendStatusCache.available = !isConnectionError;
      backendStatusCache.timestamp = Date.now();
      backendStatusCache.error = error;

      setStatus({
        loading: false,
        available: !isConnectionError,
        error: isConnectionError ? 'Connection failed' : null
      });
      setRetrying(true);
    }
  }, []);

  useEffect(() => {
    let retryInterval = null;
    if (!status.available && !status.loading) {
      setRetrying(true);
      retryInterval = setInterval(() => {
        checkBackend(true);
      }, 2000);
    } else {
      setRetrying(false);
    }
    return () => {
      if (retryInterval) clearInterval(retryInterval);
    };
  }, [status.available, status.loading, checkBackend]);

  useEffect(() => {
    checkBackend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ...status, retry: () => checkBackend(true), retrying };
} 