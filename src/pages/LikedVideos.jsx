import { useEffect, useState } from 'react';
import { useAuth } from '../contexts';
import { VideoCard, VideoCardDetailed, Loading } from '../components/index.js';
import axios from 'axios';
import { FaThLarge, FaList, FaHeart, FaHeartBroken, FaSync } from 'react-icons/fa';

function LikedVideos() {
  const { user, token } = useAuth();
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const fetchLikedVideos = async () => {
    if (!user || !token) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/like/get-liked-videos`,
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000 // 10 seconds timeout
        }
      );
      
      if (response.data.success) {
        setVideos(response.data.data?.videos || []);
        setLastRefreshed(new Date());
      } else {
        setError("Failed to load liked videos. Please try again.");
      }
    } catch (error) {
      console.error('Error fetching liked videos:', error);
      setError(
        error.response?.data?.message || 
        error.message || 
        "Failed to load liked videos. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedVideos();
  }, [user, token]);

  const handleRefresh = () => {
    fetchLikedVideos();
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
        <Loading message="Loading your liked videos..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
        <div className="flex flex-col items-center justify-center text-red-500 dark:text-red-400">
          <FaHeartBroken className="text-4xl mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Videos</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
          >
            <FaSync /> Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div className="max-w-6xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
        <div className="flex flex-col items-center justify-center text-gray-600 dark:text-gray-300">
          <FaHeart className="text-4xl mb-4 text-red-500" />
          <h2 className="text-xl font-semibold mb-2">No Liked Videos Yet</h2>
          <p className="mb-4">Videos you like will appear here</p>
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
          >
            <FaSync /> Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4 pb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Liked Videos</h1>
          {lastRefreshed && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Last refreshed: {lastRefreshed.toLocaleTimeString()}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            title="Refresh list"
          >
            <FaSync className="text-gray-600 dark:text-gray-300" />
          </button>
          
          <div className="flex gap-2">
            <button
              className={`p-2 rounded ${view === 'grid' ? 'bg-amber-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
              onClick={() => setView('grid')}
              aria-label="Grid view"
            >
              <FaThLarge size={18} />
            </button>
            <button
              className={`p-2 rounded ${view === 'list' ? 'bg-amber-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
              onClick={() => setView('list')}
              aria-label="List view"
            >
              <FaList size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {videos.map(video => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 mb-4">
          {videos.map(video => (
            <VideoCardDetailed key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}

export default LikedVideos; 