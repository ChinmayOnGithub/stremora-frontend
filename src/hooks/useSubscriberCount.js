// hooks/useSubscriberCount.js
import { useEffect, useState } from "react";
import axios from "axios";

const useSubscriberCount = (channelId, dependency = []) => {
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [countLoading, setCountLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!channelId) {
      setSubscriberCount(0);
      setError(null);
      return;
    }

    const source = axios.CancelToken.source();
    let timeout;

    const fetchCount = async () => {
      setCountLoading(true);
      setError(null);

      timeout = setTimeout(() => {
        source.cancel('Request timed out after 10 seconds');
      }, 10000);

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/subscription/get-subscriber-count/${channelId}`,
          {
            cancelToken: source.token,
            timeout: 10000
          }
        );

        if (res.data.success) {
          setSubscriberCount(res.data.message.subscriberCount);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        if (axios.isCancel(err)) {
          console.warn('Subscriber count request canceled:', err.message);
        } else if (err.response?.status === 404) {
          setError('Channel not found');
        } else {
          setError('Failed to fetch subscriber count');
          console.error('Subscriber count error:', err);
        }
      } finally {
        clearTimeout(timeout);
        setCountLoading(false);
      }
    };

    fetchCount();

    return () => {
      source.cancel('Component unmounted');
      clearTimeout(timeout);
    };
  }, [channelId, ...dependency]);

  return { subscriberCount, countLoading, error };
};

export default useSubscriberCount;