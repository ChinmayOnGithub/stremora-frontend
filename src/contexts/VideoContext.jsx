import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { createContext, useContext, useState, useEffect } from "react";

export const VideoContext = createContext();  // const [user, setUser] = useState(null); // ✅ State to store the logged-in user

export function VideoProvider({ children }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch videos once when the component mounts
  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://youtube-backend-clone.onrender.com/api/v1/video/get-video");
      if (response.data.success) {
        setVideos(response.data.message); // Store only the video array
      }
    } catch (err) {
      console.error("Error fetching videos:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [])

  function timeAgo(isoDate) {
    return formatDistanceToNow(new Date(isoDate), { addSuffix: true });
  }
  return (
    <VideoContext.Provider value={{ videos, loading, setLoading, error, fetchVideos, timeAgo }}>
      {children}
    </VideoContext.Provider>
  )

}


export default function useVideo() {
  return useContext(VideoContext);
}
