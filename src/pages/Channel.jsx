import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading/Loading";
import Container from "../components/Container";
import SubscribeButton from "../components/SubscribeButton";
import useSubscriberCount from "../hooks/useSubscriberCount"; // Import the hook
import { useAuth, useUser, useVideo } from '../contexts';
import VideoCard from "../components/VideoCard";

function Channel() {
  const { user, token, loading, setLoading } = useAuth(); // ✅ Get loading state from context
  const { channelName } = useParams();
  const { subscriptions, isSubscribed, updateSubscriptions } = useUser();
  const [channel, setChannel] = useState(null);
  const [subscriptionChanged, setSubscriptionChanged] = useState(false); // State to trigger effect
  const [activeTab, setActiveTab] = useState("videos");
  const { fetchVideos, videos, loading: videoLoading, channelVideos, userVideos } = useVideo();

  // Use the custom hook to get subscriber count
  const { subscriberCount, countLoading } = useSubscriberCount(channel?._id, [subscriptionChanged]);

  const navigate = useNavigate();

  // Get Channel info
  useEffect(() => {
    if (!channelName.trim()) return;

    const fetchChannel = async () => {
      setLoading(true);
      const source = axios.CancelToken.source();
      const timeout = setTimeout(() => {
        source.cancel('Request timeout');
      }, 10000); // 10 seconds timeout

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/users/c/${channelName}`,
          {
            headers: {
              Authorization: `Bearer ${token}` // Ensure authToken is correctly set
            },
            cancelToken: source.token
          }
        );
        console.log("API Response:", res.data);
        setChannel(res.data?.data || null); // Ensure we set the correct object
      } catch (err) {
        if (axios.isCancel(err)) {
          console.error("Request canceled", err.message);
        } else if (err.response?.status === 404) {
          console.error("Channel not found");
          setChannel(null);
        } else {
          console.error("Something went wrong", err);
        }
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    };

    fetchChannel();
  }, [channelName, token, setLoading]);

  // Fetch videos for the channel
  useEffect(() => {
    if (!channel?._id) return;
    fetchVideos(1, 10, channel._id);
  }, [channel, fetchVideos]);

  const watchVideo = (videoId) => {
    navigate(`/watch/${videoId}`); // Redirect to watch page with video ID
  };

  if (loading) {
    return <Loading />;
  }

  if (!channel && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-8">
        <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Channel not found
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <Container>
      <div className="relative card h-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg">
        {channel?.coverImage ? (
          <img src={channel.coverImage} alt="Cover" className="w-full h-32 sm:h-64 object-cover rounded-t-lg" />
        ) : (
          <p className="flex justify-center items-center bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white w-full h-32 sm:h-64 object-cover rounded-t-lg">No cover image</p>
        )}

        <div className="flex flex-wrap items-center px-4 py-4 sm:px-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border border-gray-300 dark:border-gray-700">
            {channel?.avatar ? (
              <img src={channel.avatar} alt="User Avatar" className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                No Avatar
              </div>
            )}
          </div>

          <div className="ml-4 flex-1">
            <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-200">@{channel.username}</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{channel.fullname}</p>

            <div
              className="flex items-center text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
              {countLoading ? (
                <div className="relative flex items-center">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-amber-500 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500"></span>
                </div>
              ) : (
                <p>{subscriberCount}</p>
              )}
              <span className="ml-1">Subscribers</span>
            </div>
          </div>

          <SubscribeButton
            channelId={channel._id}
            channelName={channel.username}
            isSubscribed={isSubscribed(channel._id)}
            onSubscriptionChange={() => {
              const action = isSubscribed(channel._id) ? "unsubscribe" : "subscribe";
              updateSubscriptions(channel._id, action);
              setSubscriptionChanged(prev => !prev); // Toggle subscriptionChanged state
            }}
          />
        </div>

        {/* Tab bar */}
        <div className="border-b border-gray-300 dark:border-gray-700 flex">
          <button
            onClick={() => setActiveTab("videos")}
            className={`flex-1 py-2 text-center ${activeTab === "videos"
              ? "border-b-2 border-amber-500 text-amber-600 dark:text-amber-400"
              : "text-gray-600 dark:text-gray-400"
              }`}
          >
            Videos
          </button>
          <button
            onClick={() => setActiveTab("tweets")}
            className={`flex-1 py-2 text-center ${activeTab === "tweets"
              ? "border-b-2 border-amber-500 text-amber-600 dark:text-amber-400"
              : "text-gray-600 dark:text-gray-400"
              }`}
          >
            Tweets
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === "videos" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {channel._id === user?._id ? (
                // Display userVideos if the channel belongs to the logged-in user
                userVideos?.videos?.length > 0 ? (
                  userVideos.videos.map((video) => (
                    <VideoCard
                      key={video._id}
                      video={video}
                      onClick={() => watchVideo(video._id)}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">No videos available.</p>
                )
              ) : (
                // Display channelVideos if the channel does not belong to the logged-in user
                channelVideos?.videos?.length > 0 ? (
                  channelVideos.videos.map((video) => (
                    <VideoCard
                      key={video._id}
                      video={video}
                      onClick={() => watchVideo(video._id)}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">No videos available.</p>
                )
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg">Tweet 1</div>
              <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg">Tweet 2</div>
              <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg">Tweet 3</div>
            </div>
          )}
        </div>

      </div>
    </Container>
  );
}

export default Channel;