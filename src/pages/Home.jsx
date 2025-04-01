import React, { useEffect, useState, useMemo, useCallback } from 'react';
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
  const limit = 10; // made constant for now

  const [isBannerHidden, setIsBannerHidden] = useState(() => {
    return localStorage.getItem('bannerHidden') === 'true';
  });

  // Derived state for better readability
  const totalVideos = videos?.totalVideosCount || 0;
  const videoList = videos?.videos || [];

  // ------------------------------------------
  // Memoize account age calculation so it only recomputes when user.createdAt changes
  const accountAgeInDays = useMemo(() => {
    if (user?.createdAt) {
      const oneDayInMs = 24 * 60 * 60 * 1000;
      const userCreationTime = new Date(user.createdAt).getTime();
      const currentTime = Date.now();
      const diff = currentTime - userCreationTime;
      return Math.floor(diff / oneDayInMs);
    }
    return 0;
  }, [user?.createdAt]);
  // -------------------------------------------

  // Data fetching
  useEffect(() => {
    fetchVideos(page, limit);  // Pass the page number
  }, [page, limit, fetchVideos]);


  // Fetch videos when page or limit changes
  useEffect(() => {
    // fetchVideos(page, limit);
    // Optional: Scroll to top when page changes
    window.scrollTo(0, 0);
  }, [page]);


  // Memoize the watchVideo callback to avoid re-creation on each render
  const watchVideo = useCallback((videoId) => {
    navigate(`/watch/${videoId}`);
  }, [navigate]);

  // Banner handling
  const handleBannerClose = () => {
    localStorage.setItem('bannerHidden', 'true');
    setIsBannerHidden(true);
  };

  if ((authLoading || videoLoading) && (!videos || !videos.videos?.length)) {
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
      <Banner className={`${isBannerHidden ? "hidden" : "block"} mx-2 sm:mx-4 my-4 sm:my-6
      relative overflow-hidden rounded-xl from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-700 p-4 sm:p-6 transition-all duration-300`}>
        {/* Close Button */}
        {!user && (
          <button
            className="absolute top-2 right-2 p-1 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-200"
            onClick={handleBannerClose}
            aria-label="Close"
          >
            ×
          </button>
        )}

        {user ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
                Welcome Back, {user.username}!
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                Member for {accountAgeInDays} days
              </p>
            </div>
            <img
              src="https://media.tenor.com/sCfC2XDlVPYAAAAj/wlcm.gif"
              alt="Welcome"
              className="h-16 sm:h-20 opacity-90 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        ) : (
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
                Join Streamora
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base transition-colors duration-300">
                Unlock personalized video experiences
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => navigate("/login")}
                variant="primary"
                className="px-5 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate("/register")}
                variant="secondary"
                className="px-5 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base"
              >
                Create Account
              </Button>
            </div>
          </div>
        )}
      </Banner>

      {/* Enhanced Video Grid Section */}
      <Container className="rounded-md shadow-sm hover:shadow-md transition-shadow duration-300">
        {videos ? (
          <div className="space-y-6">
            <header className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-md text-gray-600 dark:text-gray-300">
                Trending Videos <span className="text-amber-600 dark:text-amber-400 ml-2">{totalVideos}+</span>
              </h3>
            </header>

            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6
          transition-[grid-template-columns] duration-300 ease-in-out @supports (grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))) { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); } transition-opacity duration-300`}>
              {videoList.map((video) => (
                <VideoCard
                  key={video?._id}
                  video={video}
                  onClick={() => watchVideo(video?._id)}
                  className="transform hover:-translate-y-1 transition-all duration-300"
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No videos found
          </div>
        )}
      </Container>

      {/* Pagination Component */}
      <div className='w-auto'>
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(videos?.totalVideosCount / parseInt(limit, 10))}  // Fix: Ensure proper calculation
          setPage={setPage}
          className="mx-auto rounded-xl shadow-lg p-2"
        />
      </div>
    </div>
  );
}

export default Home;
