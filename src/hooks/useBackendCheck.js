import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

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

  const checkBackend = useCallback(async (force = false) => {
    // Use cache unless forced
    if (!force && backendStatusCache.checked &&
      (Date.now() - backendStatusCache.timestamp) < CACHE_DURATION) {
      return;
    }

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URI;
      await axios.head(`${backendUrl}/health`, { timeout: 3000 });

      backendStatusCache.checked = true;
      backendStatusCache.available = true;
      backendStatusCache.timestamp = Date.now();
      backendStatusCache.error = null;

      setStatus({ loading: false, available: true, error: null });
    } catch (error) {
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
    }
  }, []);

  useEffect(() => {
    checkBackend();
  }, [checkBackend]);

  return { ...status, retry: () => checkBackend(true) };
} 