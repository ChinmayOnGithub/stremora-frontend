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
  const [limit, setLimit] = useState(20);
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
      <div className='m-2 sm:m-4 bg-black/10 dark:bg-white/10 rounded-[5px] min-w-[350px]'>
        {user ? (
          <div className="relative overflow-clip text-2xl font-bold text-gray-900 dark:text-white p-4 sm:p-8">
            <h1>
              Welcome Back, {user.username.charAt(0).toUpperCase() + user.username.slice(1)}! 👋
            </h1>
            <img src="https://media.tenor.com/sCfC2XDlVPYAAAAj/wlcm.gif" alt="gif" className='absolute right-0 bottom-0 translate-y-[5px]  w-fit h-16 sm:h-32 select-none pointer-events-none'
            />
            {/* Static image overlay */}
            {/* <div className="absolute inset-0 flex items-center justify-center text-gray-900 dark:text-white text-2xl">
            </div> */}
          </div>
        ) : (
          <div className="text-center p-4 sm:p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Welcome to Our Video Platform! 🎥
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Sign up or log in to explore thousands of videos and personalize your experience.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-500 transition-all duration-200"
            >
              Log In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="ml-4 bg-gray-300 dark:bg-black/50 text-gray-900 dark:text-white px-6 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-black/20 transition-all duration-200"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>

      {/* ✅ Container with light/dark mode support */}
      <Container>
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
