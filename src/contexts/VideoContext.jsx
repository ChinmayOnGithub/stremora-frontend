import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import useAuth from "./AuthContext";
import PropTypes from 'prop-types';

export const VideoContext = createContext();

export function VideoProvider({ children }) {
  const [videos, setVideos] = useState([]); // Stores all videos
  const [channelVideos, setChannelVideos] = useState([]); // Stores channel-specific videos
  const [userVideos, setUserVideos] = useState([]); // Stores user-specific videos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useAuth();
  // Channel videos by filter and channelId
  const [latestChannelVideos, setLatestChannelVideos] = useState({}); // { [channelId]: { videos, page, total, loading, error } }
  const [oldestChannelVideos, setOldestChannelVideos] = useState({});
  const [popularChannelVideos, setPopularChannelVideos] = useState({});
  const activeChannelRef = useRef();

  // Helper to extract videos array from API response
  const extractVideos = useCallback((data) => {
    if (Array.isArray(data?.message?.videos)) return data.message.videos;
    if (Array.isArray(data?.data?.videos)) return data.data.videos;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.videos)) return data.videos;
    if (Array.isArray(data?.message)) return data.message;
    return [];
  }, []);

  // Fetch all videos (homepage/global)
  const fetchVideos = useCallback(async (page = 1, limit = 10, userId = "") => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      // Include authentication token if available
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/video/get-video/?page=${page}&limit=${limit}&userId=${userId}`,
        config
      );
      let videos = extractVideos(res.data);
      if (res.data.success) {
        if (userId) {
          if (user && userId === user._id) {
            setUserVideos(videos);
          } else {
            setChannelVideos(videos);
          }
        } else {
          setVideos(videos);
        }
      } else {
        throw new Error("Failed to fetch videos");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching videos");
    } finally {
      setLoading(false);
    }
  }, [extractVideos, user, token]);

  // Clear all channel video caches globally
  const clearChannelVideoCaches = useCallback(() => {
    setLatestChannelVideos({});
    setOldestChannelVideos({});
    setPopularChannelVideos({});
  }, []);

  // Fetch channel videos by filter and channelId, with pagination and race condition protection
  const fetchChannelVideos = useCallback(async (channelId, filter = 'latest', page = 1, limit = 10, expectedChannelId) => {
    let endpoint = '';
    let setArray;
    if (filter === 'popular') {
      endpoint = `/video/channel/${channelId}/popular`;
      setArray = setPopularChannelVideos;
    } else if (filter === 'oldest') {
      endpoint = `/video/channel/${channelId}/oldest`;
      setArray = setOldestChannelVideos;
    } else {
      endpoint = `/video/channel/${channelId}/latest`;
      setArray = setLatestChannelVideos;
    }
    setArray(prev => ({ ...prev, [channelId]: { ...(prev[channelId] || {}), loading: true, error: null } }));
    try {
      // Include authentication token if available
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URI}${endpoint}?page=${page}&limit=${limit}`, config);
      const videos = extractVideos(res.data);
      // Only update if this fetch is for the current channel
      if (!expectedChannelId || expectedChannelId === activeChannelRef.current) {
        setArray(prev => ({
          ...prev,
          [channelId]: {
            videos,
            page,
            total: res.data.data?.total || videos.length,
            loading: false,
            error: null
          }
        }));
      }
    } catch (err) {
      if (!expectedChannelId || expectedChannelId === activeChannelRef.current) {
        setArray(prev => ({
          ...prev,
          [channelId]: {
            videos: [],
            page,
            total: 0,
            loading: false,
            error: err.message || 'Failed to fetch channel videos'
          }
        }));
      }
    }
  }, [extractVideos, token]);

  // Fetch videos on component mount
  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Refresh videos when user authentication changes (login/logout)
  useEffect(() => {
    if (user) {
      // User logged in, refresh videos to get like information
      fetchVideos();
    } else {
      // User logged out, refresh videos to remove like information
      fetchVideos();
    }
  }, [user, fetchVideos]);

  // Function to refresh channel videos for current user
  const refreshChannelVideos = useCallback(async (channelId) => {
    if (!channelId) return;
    
    // Refresh all three filters for the channel
    const filters = ['latest', 'oldest', 'popular'];
    for (let i = 0; i < filters.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 100 * i)); // 100ms delay between requests
      fetchChannelVideos(channelId, filters[i], 1, 10, channelId);
    }
  }, [fetchChannelVideos]);

  // Helper function to format date
  const timeAgo = useCallback((isoDate) => {
    return formatDistanceToNow(new Date(isoDate), { addSuffix: true });
  }, []);

  const fetchTrendingVideos = useCallback(async (limit = 10) => {
    try {
      // Include authentication token if available
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/video/trending?limit=${limit}`,
        config
      );
      return {
        videos: response.data.success ? response.data.data : []
      };
    } catch (error) {
      console.error("Trending fetch error:", error);
      return { videos: [] };
    }
  }, [token]);

  const fetchRecommendedVideos = useCallback(async (page = 1, limit = 10) => {
    try {
      // Include authentication token if available
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/video/recommended?page=${page}&limit=${limit}`,
        config
      );
      return response.data.success ? {
        videos: response.data.data.videos || [],
        total: response.data.data.total || 0,
        page: response.data.data.page || 1,
        pages: response.data.data.pages || 1
      } : {
        videos: [],
        total: 0,
        page: 1,
        pages: 1
      };
    } catch (error) {
      console.error("Recommended fetch error:", error);
      return { videos: [], total: 0, page: 1, pages: 1 };
    }
  }, [token]);

  return (
    <VideoContext.Provider
      value={{
        videos,
        channelVideos,
        userVideos,
        latestChannelVideos,
        oldestChannelVideos,
        popularChannelVideos,
        loading,
        setLoading,
        error,
        fetchVideos,
        fetchChannelVideos,
        clearChannelVideoCaches,
        refreshChannelVideos,
        activeChannelRef,
        timeAgo,
        fetchTrendingVideos,
        fetchRecommendedVideos,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}

export default function useVideo() {
  return useContext(VideoContext);
}