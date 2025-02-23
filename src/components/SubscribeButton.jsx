import axios from 'axios';
import { useEffect, useState } from 'react';
import useAuth from '../contexts/AuthContext';
import useUser from '../contexts/UserContext';

function SubscribeButton({ channelId, channelName, className }) {
  const { user, token } = useAuth();
  const { isSubscribed, updateSubscriptions, fetchSubscriptions } = useUser();

  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Sync local state with global subscriptions state
  useEffect(() => {
    setSubscribed(isSubscribed(channelId));
  }, [channelId, isSubscribed]);

  const handleSubscribeToggle = async () => {
    if (!user) return alert("Please log in to subscribe!");
    if (loading) return;

    setLoading(true);

    try {
      const res = await axios.post(
        `https://youtube-backend-clone.onrender.com/api/v1/subscription/toggle-subscription/${channelId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const newState = !subscribed;
        setSubscribed(newState); // Optimistic update
        updateSubscriptions(channelId, newState ? "subscribe" : "unsubscribe");
        fetchSubscriptions(); // Ensure backend sync
      }
    } catch (err) {
      console.error("Subscription error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Prevent showing button for the user's own channel
  if (!user || user.username === channelName) return null;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); // Prevents navigation trigger
        handleSubscribeToggle();
      }}
      className={`btn bg-gray-900 text-white text-sm sm:text-base font-medium rounded-full px-4 py-2 
        shadow-md hover:bg-gray-700 hover:shadow-lg transition-all duration-300 ml-auto my-auto
        ${loading ? "opacity-50 cursor-not-allowed" : ""} ${className}`}>
      {loading ? "Processing..." : (subscribed ? "Unsubscribe" : "Subscribe")}
    </button>
  );
}

export default SubscribeButton;
