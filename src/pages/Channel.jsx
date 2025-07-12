import { useEffect, useState, useRef } from "react";
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
  const { fetchVideos, loading: videoLoading, channelVideos, userVideos, fetchChannelVideos, latestChannelVideos, oldestChannelVideos, popularChannelVideos, clearChannelVideoCaches, activeChannelRef, refreshChannelVideos } = useVideo();

  const [channel, setChannel] = useState(null);
  const [channelLoading, setChannelLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState("videos");
  const [videoFilter, setVideoFilter] = useState("latest"); // latest, oldest, popular
  
  // Add ref to track if we've already fetched videos for this channel
  const fetchedChannelsRef = useRef(new Set());

  // Use the custom hook to get subscriber count - removed subscriptionChanged dependency
  const { subscriberCount, countLoading } = useSubscriberCount(channel?._id);

  // Helper to get the correct videos array for the current filter
  const getFilteredVideos = () => {
    const id = channel?._id;
    if (!id) return [];
    const data = {
      latest: latestChannelVideos[id],
      oldest: oldestChannelVideos[id],
      popular: popularChannelVideos[id],
    }[videoFilter];
    return data?.loading ? [] : data?.videos || [];
  };

  // When channel changes, clear all filter states, set ref, and prefetch all three filters
  useEffect(() => {
    if (!channel?._id) return;
    
    // Prevent duplicate fetches for the same channel
    if (fetchedChannelsRef.current.has(channel._id)) return;
    
    activeChannelRef.current = channel._id;
    fetchedChannelsRef.current.add(channel._id);
    
    clearChannelVideoCaches(); // Clears all filters globally
    
    // Fetch all three filters with a small delay to prevent overwhelming the server
    const fetchFilters = async () => {
      const filters = ['latest', 'oldest', 'popular'];
      for (let i = 0; i < filters.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100 * i)); // 100ms delay between requests
        fetchChannelVideos(channel._id, filters[i], 1, 10, activeChannelRef.current);
      }
    };
    
    fetchFilters();
  }, [channel?._id, fetchChannelVideos, clearChannelVideoCaches]); // Fixed dependencies

  // Refresh channel videos when user authentication changes (login/logout)
  useEffect(() => {
    if (channel?._id && user) {
      // Refresh videos to get updated like information
      refreshChannelVideos(channel._id);
    }
  }, [user, channel?._id, refreshChannelVideos]);

  // Cleanup effect to clear fetched channels when component unmounts
  useEffect(() => {
    return () => {
      fetchedChannelsRef.current.clear();
    };
  }, []);

  const navigate = useNavigate();

  // Fetch Channel Data
  useEffect(() => {
    if (!channelName.trim()) return;

    // Create cancel token source outside async function
    const source = axios.CancelToken.source();
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

  // Video filter options
  const videoFilters = [
    { label: "Latest", value: "latest" },
    { label: "Oldest", value: "oldest" },
    { label: "Popular", value: "popular" },
  ];

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
              // Removed the subscriptionChanged toggle that was causing infinite loops
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
            <>
              {/* Minimal text button group for video filter */}
              <div className="flex gap-4 mb-4 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm w-fit">
                {videoFilters.map(filter => (
                  <button
                    key={filter.value}
                    type="button"
                    className={`text-base font-semibold pb-1 border-b-2 transition-colors duration-200
                        ${videoFilter === filter.value
                          ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                          : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-amber-500'}
                      `}
                    onClick={() => setVideoFilter(filter.value)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {getFilteredVideos()?.length > 0 ? (
                  getFilteredVideos().map((video) => (
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
            </>
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