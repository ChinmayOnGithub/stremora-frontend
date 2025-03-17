import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useAuth,
  // useUser,
  useVideo
} from '../contexts';
import {
  Loading,
  Pagination,
  Container,
  VideoCard,
  Banner,
  Button,
} from '../components/index.js';
import "../index.css"


function Home() {
  const navigate = useNavigate(); // React Router Navigation Hook
  const { videos, loading: videoLoading, error, fetchVideos } = useVideo();
  const { user, loading: authLoading } = useAuth();

  // Pagination state
  const [page, setPage] = useState(1);
  // const [limit, setLimit] = useState(20);
  const limit = 20; // made constant for now

  const [isBannerHidden, setIsBannerHidden] = useState(() => {
    return localStorage.getItem('bannerHidden') === 'true';
  });

  // Derived state for better readability
  const totalVideos = videos?.totalVideosCount || 0;
  const videoList = videos?.videos || [];

  // ------------------------------------------
  let accountAgeInDays = 0;
  if (user?.createdAt) {
    const oneDayInMs = 24 * 60 * 60 * 1000;
    const userCreationTime = new Date(user.createdAt).getTime();
    const currentTime = Date.now();
    const diff = currentTime - userCreationTime;
    accountAgeInDays = Math.floor(diff / oneDayInMs);
  }
  // -------------------------------------------
  // Data fetching
  useEffect(() => {
    fetchVideos(page, limit);  // Pass the page number
  }, [page, limit]);

  const watchVideo = (videoId) => {
    navigate(`/watch/${videoId}`);
  };

  // Banner handling
  const handleBannerClose = () => {
    localStorage.setItem('bannerHidden', 'true');
    setIsBannerHidden(true);
  };

  if (authLoading || videoLoading && (!videos || !videos.videos?.length)) {
    return <Loading message="Loading content..." />;
  }

  if (error) {
    return (
      // <ErrorMessage
      //   message="Failed to load videos"
      //   onRetry={() => fetchVideos(page, limit)}
      // />
      <p>Error while loading content</p>
    );
  }


  return (
    <div className='flex flex-col min-h-full'>
      <Banner className={`${isBannerHidden ? "hidden" : "block"} m-2 sm:m-4`}>
        {/* <div className={`relative m-2 sm:m-4 bg-black/10 dark:bg-white/10 rounded-[5px] min-w-[350px] ${isBannerHidden ? "hidden" : "block"}`}> */}
        {/* {!user && !authLoading && <button
          className='absolute w-6 h-6 flex items-center justify-center rounded-full right-0 top-0 m-4 bg-red-600 text-white font-bold transition-all duration-300 transform hover:scale-110 active:scale-90 hover:bg-red-700'
          onClick={handleBannerClose}
          aria-label='close banner button'>
          ✕
        </button>} */}
        {user ? (
          <div className="relative overflow-clip text-2xl font-bold text-gray-900 dark:text-white p-4 sm:p-8">
            <h1>
              Welcome Back, {user.username.charAt(0).toUpperCase() + user.username.slice(1)}! 👋
            </h1>
            <p className='font-light text-sm'>You have joined our family {accountAgeInDays} days ago</p>
            <img src="https://media.tenor.com/sCfC2XDlVPYAAAAj/wlcm.gif" alt="gif" className='absolute right-0 bottom-0 translate-y-[5px]  w-fit h-16 sm:h-32 select-none pointer-events-none'
            />
            {/* Static image overlay */}
            {/* <div className="absolute inset-0 flex items-center justify-center text-gray-900 dark:text-white text-2xl">
            </div> */}
          </div>
        ) : (
          <div className="text-center p-4 sm:p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Welcome to STREMORA!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Sign up or log in to explore thousands of videos and personalize your experience.
            </p>
            <Button
              onClick={() => navigate("/login")}
              variant="primary"

            >
              Log In
            </Button>
            <Button
              onClick={() => navigate("/register")}
              variant="secondary"
              className="ml-4"
            >
              Sign Up
            </Button>
          </div>
        )}
        {/* </div> */}
      </Banner>

      {/* ✅ Container with light/dark mode support */}
      <Container className='rounded-md mt-1'>
        {videos ? <div>
          {/* Title */}
          <h3 className='font-normal text-gray-500 dark:text-gray-400 italic text-sm my-0 mb-2'>Total Videos: <span className='font-semibold dark:text-amber-100'>{totalVideos}</span></h3>

          {/* ✅ Grid layout for videos */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 
          transition-[grid-template-columns] duration-300 ease-in-out @supports (grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))) { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }`}>
            {videoList?.map((video) => (
              <VideoCard
                key={video._id}
                video={video}
                onClick={() => watchVideo(video._id)}
              />
            ))}
          </div>
        </div>
          :
          <div>
            Error Fetching Videos
          </div>}
      </Container >

      {/* Pagination Component */}
      <div className='w-auto'>
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(videos.totalVideosCount / parseInt(limit, 10))}  // Fix: Ensure proper calculation
          setPage={setPage}
        />
      </div>
    </div >
  );
}

export default Home;
