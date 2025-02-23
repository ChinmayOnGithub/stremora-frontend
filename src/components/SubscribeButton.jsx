import axios from 'axios';
import { useEffect, useState } from 'react'
import useAuth from '../contexts/AuthContext';
import useUser from '../contexts/UserContext';

function SubscribeButton({ channelId, channelName, isSubscribed, className }) {

  const { user, token } = useAuth(); // Get logged-in user details
  // const { subscriptions, setSubscriptions } = useUser(); // Get & update user subscriptions
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    setSubscribed(isSubscribed); // ✅ Ensure it updates when prop changes
  }, [isSubscribed]);

  // // ✅ Check if user is subscribed when component mounts
  // useEffect(() => {
  //   if (!user || !channelId) return;

  //   setLoading(true);
  //   axios.get(`https://youtube-backend-clone.onrender.com/api/v1/subscription/get-subscribed-channels/${user._id}`, {
  //     headers: { Authorization: `Bearer ${user.token}` }
  //   })
  //     .then((res) => {
  //       const subscribedChannels = res.data.message.channels || [];
  //       setSubscribed(subscribedChannels.some((channel) => channel.channelDetails._id === channelId));
  //     })
  //     .catch((err) => {
  //       console.error("Error checking subscription:", err);
  //     }).finally(() => {
  //       setLoading(false)
  //     })
  // }, [channelId, user, token]);

  const handleSubscribeToggle = async () => {
    if (!user) return alert("Please log in to subscribe!");
    console.log(subscribed);


    if (loading) return; // Prevent multiple clicks
    setLoading(true);
    try {
      const res = await axios.post(
        `https://youtube-backend-clone.onrender.com/api/v1/subscription/toggle-subscription/${channelId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setSubscribed(!subscribed);
      }
    } catch (err) {
      console.error("Subscription error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIX: Prevent errors when `user` is null & return early
  if (!user || user.username === channelName) return null;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); // ✅ Prevents navigation trigger
        handleSubscribeToggle();
      }}

      className={`btn bg-gray-900 text-white text-sm sm:text-base font-medium rounded-full px-4 py-2 
      shadow-md hover:bg-gray-700 hover:shadow-lg transition-all duration-300 ml-auto my-auto
      ${loading ? "opacity-50 cursor-not-allowed" : ""} ${className}`}>
      {loading ? "Processing..." : (subscribed ? "Unsubscribe" : "Subscribe")}
    </button >
  )

}

export default SubscribeButton