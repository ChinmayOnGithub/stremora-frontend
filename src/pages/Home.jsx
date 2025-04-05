import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useVideo } from '../contexts/index.js';
import {
  Loading,
  Pagination,
  Container,
  VideoCard,
  Button,
} from '../components/index.js';
import "../index.css"
import { useBackendCheck } from '../hooks/useBackendCheck.js';
import { BackendError } from '../components/BackendError.jsx';

function Home() {
  const navigate = useNavigate();
  const { videos, loading: videoLoading, error: videoError, fetchVideos } = useVideo();
  const { user } = useAuth();
  const { available, loading: backendLoading, retry } = useBackendCheck();

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isBannerHidden, setIsBannerHidden] = useState(
    () => localStorage.getItem('bannerHidden') === 'true'
  );

  // Derived values
  const totalVideos = videos?.totalVideosCount || 0;
  const videoList = videos?.videos || [];
  const isLoading = (backendLoading && !videos) || (videoLoading && !videoList.length);

  // Add accountAge calculation
  const accountAge = useMemo(() => {
    if (!user?.createdAt) return 0;
    const createdDate = new Date(user.createdAt);
    const diffTime = Date.now() - createdDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }, [user?.createdAt]);

  useEffect(() => {
    if (available) fetchVideos(page, limit);
  }, [available, fetchVideos, page, limit]);

  if (isLoading) return <Loading message="Loading content..." />;
  if (!available || videoError) return <BackendError onRetry={retry} />;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Compact Welcome Banner */}
      {!isBannerHidden && (
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm 
            rounded-xl p-4 shadow-lg">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={user.avatar || '/default-avatar.png'}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover ring-1 ring-amber-500/20"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                      <span className="text-xs">🎥</span>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-lg font-medium text-gray-900 dark:text-white">
                      Welcome back, {user.username}!
                    </h1>
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                      Sharing awesome content for {Math.min(accountAge, 365)} days
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/upload')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 
                    dark:bg-amber-500/20 dark:hover:bg-amber-500/30 transition-all group"
                >
                  <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Upload</span>
                  <span className="text-lg transform group-hover:rotate-90 transition-transform">🎬</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Join our community to start sharing your content
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate('/login')}
                    className="text-sm font-medium text-amber-600 hover:text-amber-700
                      dark:text-amber-400 dark:hover:text-amber-300"
                  >
                    Sign in
                  </button>
                  <span className="text-gray-300 dark:text-gray-600">|</span>
                  <button
                    onClick={() => navigate('/register')}
                    className="text-sm font-medium text-gray-700 hover:text-gray-900
                      dark:text-gray-300 dark:hover:text-white"
                  >
                    Register
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => setIsBannerHidden(true)}
              className="absolute top-2 right-2 p-1 rounded-full text-gray-400 
                hover:text-gray-600 hover:bg-black/5 transition-all"
              aria-label="Close"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Videos Section */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Trending Videos
          </h2>
          <span className="px-2 py-0.5 text-xs bg-amber-100 dark:bg-amber-900/30 
            text-amber-700 dark:text-amber-300 rounded-full">
            {totalVideos}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {videoList.map(video => (
            <VideoCard
              key={video._id}
              video={video}
              onClick={() => navigate(`/watch/${video._id}`)}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden
                transform hover:scale-[1.02] hover:shadow-lg
                transition-all duration-300 cursor-pointer"
            />
          ))}
        </div>

        {totalVideos > limit && (
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(totalVideos / limit)}
            setPage={setPage}
            className="flex justify-center bg-white dark:bg-gray-800 rounded-xl shadow-sm p-2"
          />
        )}
      </div>
    </main>
  );
}

export default Home;
