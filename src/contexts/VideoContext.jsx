import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { createContext, useContext, useState, useEffect } from "react";
import useAuth from "./AuthContext";
import PropTypes from 'prop-types';

export const VideoContext = createContext();

export function VideoProvider({ children }) {
  const [videos, setVideos] = useState([]); // Stores all videos
  const [channelVideos, setChannelVideos] = useState([]); // Stores channel-specific videos
  const [userVideos, setUserVideos] = useState([]); // Stores user-specific videos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch videos
  const fetchVideos = async (page = 1, limit = 10, userId = "") => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/video/get-video/?page=${page}&limit=${limit}&userId=${userId}`
      );

      if (res.data.success) {
        if (userId) {
          // If userId is provided, set channel-specific videos
          if (userId === user._id) {
            setUserVideos(res.data.message);
          } else {
            setChannelVideos(res.data.message);
          }
        } else {
          // Otherwise, set all videos
          setChannelVideos([]);
          setVideos(res.data.message);
        }
      } else {
        throw new Error("Failed to fetch videos");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching videos");
    } finally {
      setLoading(false);
    }
  };

  // Fetch videos on component mount
  useEffect(() => {
    fetchVideos();
  }, []);

  // Helper function to format date
  const timeAgo = (isoDate) => {
    return formatDistanceToNow(new Date(isoDate), { addSuffix: true });
  };

  const fetchTrendingVideos = async (limit = 10) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/video/trending?limit=${limit}`
      );

      // Use response.data.data instead of response.data.message
      return {
        videos: response.data.success ? response.data.data : []
      };

    } catch (error) {
      console.error("Trending fetch error:", error);
      return { videos: [] };
    }
  };

  const fetchRecommendedVideos = async (page = 1, limit = 10) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/video/recommended?page=${page}&limit=${limit}`
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
  };

  return (
    <VideoContext.Provider
      value={{
        videos,
        channelVideos,
        userVideos,
        loading,
        setLoading,
        error,
        fetchVideos,
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