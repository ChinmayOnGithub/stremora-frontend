import axios from "axios";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import useAuth from "./AuthContext.jsx";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // ✅ Fetch user subscriptions
  const fetchSubscriptions = useCallback(async () => {
    if (!user?._id) {
      setSubscriptions([]); // Clear subscriptions when user logs out
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/subscription/get-subscribed-channels/${user._id}`
      );

      if (res.data.success) {
        setSubscriptions(res.data.message.channels);
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  // ✅ Fetch subscriptions on mount & when user changes
  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  // ✅ Check if a channel is subscribed
  const isSubscribed = (channelId) => {
    return subscriptions.some((sub) => sub.channelDetails?._id === channelId);
  };

  // ✅ Update subscriptions after toggling (Optimistic UI update)
  const updateSubscriptions = (channelId, action) => {
    setSubscriptions((prev) => {
      if (action === "subscribe") {
        return [...prev, { channelDetails: { _id: channelId } }]; // Add channel
      } else {
        return prev.filter((sub) => sub.channelDetails?._id !== channelId); // Remove channel
      }
    });

    // ✅ Refetch from backend to ensure accurate state
    fetchSubscriptions();
  };

  return (
    <UserContext.Provider value={{ subscriptions, isSubscribed, updateSubscriptions, fetchSubscriptions, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export default function useUser() {
  return useContext(UserContext);
}