import { useEffect, useState, useRef } from "react";
import axiosInstance from '../lib/axios.js'; // Use the new, correct instance
import axios from "axios"; // Keep for the isCancel check

const useSubscriberCount = (channelId) => {
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [countLoading, setCountLoading] = useState(true); // Start as true
  const [error, setError] = useState(null);
  const lastChannelId = useRef(null);

  useEffect(() => {
    // If there's no channelId, reset to default state and do nothing.
    if (!channelId) {
      setSubscriberCount(0);
      setCountLoading(false);
      return;
    }

    // Prevent re-fetching if the channelId hasn't changed.
    if (lastChannelId.current === channelId) {
      return;
    }

    lastChannelId.current = channelId;

    // Use the modern AbortController for cancellation.
    const controller = new AbortController();

    const fetchCount = async () => {
      setCountLoading(true);
      setError(null);

      try {
        // Use axiosInstance and pass the AbortController's signal.
        const res = await axiosInstance.get(
          `/subscription/get-subscriber-count/${channelId}`,
          {
            signal: controller.signal, // This is the new way to cancel requests.
          }
        );

        if (res.data.success) {
          // Ensure the data path is correct based on your API response.
          setSubscriberCount(res.data.data.subscriberCount);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        // The error check for cancellation remains the same.
        if (axios.isCancel(err)) {
          console.warn('Subscriber count request canceled:', err.message);
        } else if (err.response?.status === 404) {
          setError('Channel not found');
        } else {
          setError('Failed to fetch subscriber count');
          console.error('Subscriber count error:', err);
        }
      } finally {
        setCountLoading(false);
      }
    };

    fetchCount();

    // The cleanup function now calls controller.abort().
    return () => {
      controller.abort();
    };
  }, [channelId]); // The dependency array correctly watches for changes to channelId.

  return { subscriberCount, countLoading, error };
};

export default useSubscriberCount;
