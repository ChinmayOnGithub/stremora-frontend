// src/pages/Channel.jsx

import { useEffect, useState, useRef } from "react";
// 1. Correctly import your axios instance
import axiosInstance from '../lib/axios.js';
import axios from 'axios'; // Keep this for the isCancel check
import { useNavigate, useParams } from "react-router-dom";
import {
  Loading,
  SubscribeButton,
  VideoCard,
  Banner,
  Button
} from "../components/index.js";
import useSubscriberCount from "../hooks/useSubscriberCount.js";
import { useAuth, useUser, useVideo } from '../contexts/index.js';

function Channel() {
  const { user, token, loading: authLoading, setLoading } = useAuth();
  const { channelName } = useParams();
  const { isSubscribed, updateSubscriptions } = useUser();
  const { fetchVideos, loading: videoLoading, channelVideos, userVideos, fetchChannelVideos, latestChannelVideos, oldestChannelVideos, popularChannelVideos, clearChannelVideoCaches, activeChannelRef, refreshChannelVideos } = useVideo();

  const [channel, setChannel] = useState(null);
  const [channelLoading, setChannelLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState("videos");
  const [videoFilter, setVideoFilter] = useState("latest");

  const fetchedChannelsRef = useRef(new Set());
  const { subscriberCount, countLoading } = useSubscriberCount(channel?._id);

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

  useEffect(() => {
    if (!channel?._id || fetchedChannelsRef.current.has(channel._id)) return;
    activeChannelRef.current = channel._id;
    fetchedChannelsRef.current.add(channel._id);
    clearChannelVideoCaches();
    const fetchFilters = async () => {
      const filters = ['latest', 'oldest', 'popular'];
      for (let i = 0; i < filters.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100 * i));
        fetchChannelVideos(channel._id, filters[i], 1, 10, activeChannelRef.current);
      }
    };
    fetchFilters();
  }, [channel?._id, fetchChannelVideos, clearChannelVideoCaches]);

  useEffect(() => {
    if (channel?._id && user) {
      refreshChannelVideos(channel._id);
    }
  }, [user, channel?._id, refreshChannelVideos]);

  useEffect(() => {
    return () => {
      fetchedChannelsRef.current.clear();
    };
  }, []);

  const navigate = useNavigate();

  // Fetch Channel Data
  useEffect(() => {
    if (!channelName.trim()) return;

    // 2. Use the modern AbortController
    const controller = new AbortController();

    const fetchChannel = async () => {
      setChannelLoading(true);
      setNotFound(false);
      setLoading(true);

      try {
        // 3. Use axiosInstance and pass the signal
        const res = await axiosInstance.get(
          `/users/c/${channelName}`,
          {
            signal: controller.signal // Pass the signal here
          }
        );
        setChannel(res.data?.data || null);
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
        setLoading(false);
        setChannelLoading(false);
      }
    };

    fetchChannel();

    // 4. The cleanup function now calls controller.abort()
    return () => {
      controller.abort();
    };
  }, [channelName, token, setLoading]);

  const watchVideo = (videoId) => {
    navigate(`/watch/${videoId}`);
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
            }}
          />
        </div>

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

        <div className="p-4">
          {activeTab === "videos" ? (
            <>
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