import axios from 'axios';
import { useEffect, useState } from 'react'
import useAuth from '../contexts/AuthContext';

function SubscribeButton(props) {
  const { channelId } = props
  const { user } = useAuth(); // Get logged-in user details
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);


  // ✅ Check if user is subscribed when component mounts
  useEffect(() => {
    if (!user || !channelId) return;

    axios.get(`https://youtube-backend-clone.onrender.com/api/v1/users/get-subscribed-channels/${user._id}`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then((res) => {
        const subscribedChannels = res.data.channels || [];
        setSubscribed(subscribedChannels.some(channel => channel.channelDetails._id === channelId));
      })
      .catch((err) => {
        console.error("Error checking subscription:", err);
      });
  }, [channelId, user]);

  const handleSubscribeToggle = async () => {
    if (!user) return alert("Please log in to subscribe!");

    setLoading(true);
    try {
      const res = await axios.post(
        `https://youtube-backend-clone.onrender.com/api/v1/users/toggle-subscription/${channelId}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
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


  return (
    <button
      onClick={handleSubscribeToggle}
      className={`btn bg-gray-900 text-white font-sm sm:font-medium rounded-full px-5 py-2 shadow-md hover:bg-gray-700 hover:shadow-lg transition-all duration-300 ml-auto my-auto
      ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
      {loading ? "Processing..." : subscribed ? "Unsubscribe" : "Subscribe"}

    </button>
  )
}

export default SubscribeButton