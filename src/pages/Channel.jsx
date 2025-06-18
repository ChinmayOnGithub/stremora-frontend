import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Loading,
  SubscribeButton,
  VideoCard,
  Banner,
  Button
} from "../components/index.js";
import useSubscriberCount from "../hooks/useSubscriberCount";
import { useAuth, useUser, useVideo } from '../contexts';

function Channel() {
  const { user, token, loading: authLoading, setLoading } = useAuth();
  const { channelName } = useParams();
  const { isSubscribed, updateSubscriptions } = useUser();
  const { fetchVideos, loading: videoLoading, channelVideos, userVideos } = useVideo();

  const [channel, setChannel] = useState(null);
  const [channelLoading, setChannelLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [subscriptionChanged, setSubscriptionChanged] = useState(false);
  const [activeTab, setActiveTab] = useState("videos");

  // Use the custom hook to get subscriber count
  const { subscriberCount, countLoading } = useSubscriberCount(channel?._id, [subscriptionChanged]);

  const navigate = useNavigate();

  // Fetch Channel Data
  useEffect(() => {
    if (!channelName.trim()) return;

    // Create cancel token source outside async function
    const source = axios.CancelToken.source(); // i dont know what does this like do
    let timeout;

    const fetchChannel = async () => {
      setChannelLoading(true);
      setNotFound(false);
      setLoading(true);
      // Set timeout for request abortion
      timeout = setTimeout(() => {
        source.cancel('Request timed out after 10 seconds');
      }, 10000); // 10 seconds timeout

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/users/c/${channelName}`,
          {
            cancelToken: source.token
          }
        );
        console.log("API Response (channel data):", res.data);
        setChannel(res.data?.data || null); // Ensure we set the correct object
      } catch (err) {
        if (axios.isCancel(err)) {
          console.error("Request canceled", err.message);
        } else if (err.response?.status === 404) {
          console.error("Channel not found");
          setChannel(null);
          setNotFound(true);
        } else {
          console.error("Something went wrong", err);
        }
      } finally {
        clearTimeout(timeout);
        setLoading(false);
        setChannelLoading(false);
      }
    };

    fetchChannel();

    // Cleanup function
    return () => {
      source.cancel('Component unmounted');
      clearTimeout(timeout);
    };
  }, [channelName, token, setLoading]);

  // Fetch videos for the channel
  useEffect(() => {
    if (!channel?._id) return;
    fetchVideos(1, 10, channel._id);
  }, [channel, fetchVideos]);

  const watchVideo = (videoId) => {
    navigate(`/watch/${videoId}`); // Redirect to watch page with video ID
  };

  if (channelLoading || authLoading) {
    return <Loading message="Loading channel..." />;
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-8">
        <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Channel not found
        </p>
        <Button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          Go Back
        </Button>
      </div>
    );
  }

  if (!channel) return null;

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full">
      {
        user?._id === channel?._id &&
        <Banner className="my-2 p-3 w-full">
          <div>
            <p>This is how people will see your channel</p>
          </div>
        </Banner>
      }
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
              {channelVideos?.length > 0 ? (
                channelVideos.map((video) => (
                  <VideoCard
                    key={video._id}
                    video={video}
                    onClick={() => watchVideo(video._id)}
                  />
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">No videos available.</p>
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
    </div>
  );
}

export default Channel;