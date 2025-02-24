import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { createContext, useContext, useState, useEffect } from "react";

export const VideoContext = createContext();

export function VideoProvider({ children }) {
  const [videos, setVideos] = useState([]); // Stores all videos
  const [channelVideos, setChannelVideos] = useState([]); // Stores channel-specific videos
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch videos
  const fetchVideos = async (page = 1, limit = 10, userId = "") => {
    setLoading(true);
    setError(null); // Reset error state

    try {
      const res = await axios.get(
        `https://youtube-backend-clone.onrender.com/api/v1/video/get-video/?page=${page}&limit=${limit}&userId=${userId}`
      );

      if (res.data.success) {
        if (userId) {
          // If userId is provided, set channel-specific videos
          setChannelVideos(res.data.message);
        } else {
          // Otherwise, set all videos
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

  return (
    <VideoContext.Provider
      value={{
        videos,
        channelVideos,
        loading,
        setLoading,
        error,
        fetchVideos,
        timeAgo,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}

export default function useVideo() {
  return useContext(VideoContext);
}