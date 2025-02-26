import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading/Loading';
import Pagination from '../components/Pagination';
import { useEffect, useState } from 'react';
import "../index.css"
import Container from '../components/Container.jsx';
import { useAuth, useUser, useVideo } from '../contexts';
import VideoCard from '../components/VideoCard.jsx';


function Home() {
  // const [videos, setVideos] = useState([]); // Store videos only
  const navigate = useNavigate(); // ✅ React Router Navigation Hook
  const { videos, loading: videoLoading, error, timeAgo, fetchVideos } = useVideo();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { user } = useAuth();

  useEffect(() => {
    fetchVideos(page, limit);  // ✅ Pass the page number when calling the function
  }, [page]);


  const watchVideo = (videoId) => {
    navigate(`/watch/${videoId}`); // Redirect to watch page with video ID
  };


  if (videoLoading && videos.length === 0) {
    return <Loading message="videos are Loading..." />
  }


  return (
    <div className='flex flex-col min-h-full'>
      {/* ✅ Container with light/dark mode support */}
      <Container>

        {user ? (
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Welcome Back, {user.username.charAt(0).toUpperCase() + user.username.slice(1)}! 👋
          </h2>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Welcome to Our Video Platform! 🎥
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Sign up or log in to explore thousands of videos and personalize your experience.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-amber-400 text-white px-6 py-2 rounded-lg hover:bg-amber-500 transition-all duration-200"
            >
              Log In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="ml-4 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white px-6 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200"
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Title */}
        <h3 className='font-normal text-gray-500 dark:text-gray-400 italic text-sm my-2'>Total Videos: {videos.totalVideosCount}</h3>

        {/* ✅ Grid layout for videos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {videos?.videos?.map((video) => (
            <VideoCard
              key={video._id}
              video={video}
              onClick={() => watchVideo(video._id)}
            />
          ))}
        </div>
      </Container >


      {/* Pagination Component */}
      <div className='w-auto'>
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(videos.totalVideosCount / parseInt(limit, 10))}  // ✅ Fix: Ensure proper calculation
          setPage={setPage}
        />
      </div>
    </div>
  );
}

export default Home;
