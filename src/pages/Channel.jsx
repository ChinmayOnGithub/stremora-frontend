import { useEffect, useState } from "react";
import useAuth from "../contexts/AuthContext"
import axios from "axios";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading/Loading";
import Container from "../components/Container";
import SubscribeButton from "../components/SubscribeButton";
import useUser from "../contexts/UserContext";

function Channel() {
  const { token, loading, setLoading } = useAuth(); // ✅ Get loading state from context
  const { channelName } = useParams();
  const { subscriptions } = useUser();
  // console.log(useParams());

  const [channel, setChannel] = useState(null);
  const [subscriberCount, setSubscriberCount] = useState();
  const [subscriptionChanged, setSubscriptionChanged] = useState(false); // State to trigger effect
  const [countLoading, setCountLoading] = useState(false);



  useEffect(() => {
    if (!channelName.trim()) return;
    setLoading(true);
    axios.get(
      `https://youtube-backend-clone.onrender.com/api/v1/users/c/${channelName}`,
      // `http://localhost:8000/api/v1/users/c/${channelName}`,
      {
        headers: {
          Authorization: `Bearer ${token}` // Ensure authToken is correctly set
        }
      }
    )
      .then((res) => {
        console.log("API Response:", res.data);
        setChannel(res.data?.data || null); // Ensure we set the correct object
      })
      .catch((err) => {
        console.error("Something went wrong", err);
        setChannel(null); // Ensure state resets when an error occurs
      })
      .finally(() => {
        setLoading(false);
      });
  }, [channelName]);

  // Get Subscribers count
  useEffect(() => {
    setCountLoading(true)
    if (!channel?._id) {
      setCountLoading(false);
      return;
    }; // Prevent request if channel is not loaded
    axios.get(
      `https://youtube-backend-clone.onrender.com/api/v1/subscription/get-subscriber-count/${channel._id}`
    ).then((res) => {
      if (res.data.success) {
        setSubscriberCount(res.data.message.subscriberCount)
      }
    }).catch((err) => {
      console.error("Error fetching subscriber count", err);
    }).finally(() => {
      setCountLoading(false);
    });
  }, [channel, subscriptionChanged])

  if (loading || !channel) {
    return <Loading />
  }

  if (!channel && !loading) {
    return (
      <p>
        No channel found
      </p>
    )
  }





  return (
    <Container>
      <div className="relative card h-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg">
        {/* Cover Image */}
        {channel?.coverImage ? (
          <img src={channel.coverImage} alt="Cover" className="w-full h-32 sm:h-64 object-cover rounded-t-lg" />
        ) : (
          <p className="text-center text-gray-400 dark:text-gray-500">No cover image</p>
        )}

        {/* Channel Avatar, Name, Subscribe */}
        <div className="flex flex-wrap items-center px-4 py-4 sm:px-6">
          {/* Avatar */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border border-gray-300 dark:border-gray-700">
            {channel?.avatar ? (
              <img src={channel.avatar} alt="User Avatar" className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                No Avatar
              </div>
            )}
          </div>

          {/* Info */}
          <div className="ml-4 flex-1">
            <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-200">@{channel.username}</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{channel.fullname}</p>

            {/* Subscribers Count with Animation */}
            <div className="flex items-center text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
              {countLoading ? (
                <div className="relative flex items-center">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-blue-500 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500"></span>
                </div>
              ) : (
                <p>{subscriberCount}</p>
              )}
              <span className="ml-1">Subscribers</span>
            </div>
          </div>

          {/* Subscribe Button */}
          <SubscribeButton
            channelId={channel._id}
            channelName={channel.username}
            isSubscribed={subscriptions.some((sub) => sub._id === channel._id)}
            onSubscriptionChange={() => setSubscriptionChanged((prev) => !prev)}
          />
        </div>
      </div>
    </Container>
  );
}

export default Channel;
