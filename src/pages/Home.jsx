import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useVideo } from '../contexts/index.js';
import {
  Loading,
  Pagination,
  VideoCard,
  Button,
} from '../components/index.js';
import Container from '../components/layout/Container';
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
  const [activeCategory, setActiveCategory] = useState('All');

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

  // Get time of day for personalized greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  useEffect(() => {
    if (available) fetchVideos(page, limit);
  }, [available, fetchVideos, page, limit]);

  useEffect(() => {
    // Save banner state to localStorage when it changes
    localStorage.setItem('bannerHidden', isBannerHidden);
  }, [isBannerHidden]);

  if (isLoading) return <Loading message="Loading content..." />;
  if (!available || videoError) return <BackendError onRetry={retry} />;

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 w-screen overflow-hidden transition-colors duration-150">
      {/* Header spacer - match header height */}
      <div className="h-16 w-full"></div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Two-column layout for desktop */}
        <div className="flex flex-col lg:flex-row lg:gap-6">
          {/* Main content column */}
          <div className="w-full lg:w-8/12">
            {/* Welcome section with card design */}
            <section className="pt-6 pb-5 w-full">
              {user ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center gap-3 w-full transition-colors duration-150">
                  <div className="relative h-12 w-12 flex-shrink-0">
                    <img
                      src={user.avatar || '/default-avatar.png'}
                      alt={`${user.username}'s avatar`}
                      className="h-full w-full rounded-full object-cover ring-2 ring-violet-700 dark:ring-amber-500"
                    />
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-1 ring-white dark:ring-gray-800"></span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{greeting}</p>
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white truncate">{user.username}</h1>
                  </div>
                  <Button
                    onClick={() => navigate('/upload')}
                    className="ml-auto bg-violet-700 hover:bg-violet-800 dark:bg-amber-500 dark:hover:bg-amber-600 text-white flex-shrink-0"
                    size="sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                      <path d="M10.75 6.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" />
                    </svg>
                    Upload
                  </Button>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 transition-colors duration-150">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Discover videos</h1>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => navigate('/login')}
                        className="flex-1 sm:flex-none border-violet-700 text-violet-700 hover:bg-violet-50 dark:border-amber-500 dark:text-amber-500 dark:hover:bg-gray-700"
                      >
                        Sign in
                      </Button>
                      <Button
                        onClick={() => navigate('/register')}
                        className="flex-1 sm:flex-none bg-violet-700 hover:bg-violet-800 dark:bg-amber-500 dark:hover:bg-amber-600 text-white"
                      >
                        Register
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Featured banner with simplified gradient */}
            {!isBannerHidden && (
              <section className="my-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-colors duration-150">
                  <div className="h-24 bg-violet-700 dark:bg-amber-600 relative transition-colors duration-150">
                    <button
                      onClick={() => setIsBannerHidden(true)}
                      className="absolute top-2 right-2 rounded-full p-1.5 text-white/80 hover:text-white hover:bg-black/10 transition-colors"
                      aria-label="Close banner"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Welcome to Stremora</h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                      Discover videos from creators around the world and share your own content.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={() => navigate('/explore')}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                      >
                        Explore
                      </Button>
                      {user && (
                        <Button
                          onClick={() => navigate('/upload')}
                          className="bg-violet-700 hover:bg-violet-800 dark:bg-amber-500 dark:hover:bg-amber-600 text-white"
                        >
                          Upload
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Category navigation with Reddit-style tabs */}
            <section className="mb-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3">
                <div className="relative">
                  <div className="flex w-full items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {['All', 'Music', 'Gaming', 'Education', 'Entertainment', 'Sports', 'News', 'Technology'].map(category => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`whitespace-nowrap px-3 py-1.5 text-sm font-medium transition-colors flex-shrink-0 rounded-md ${activeCategory === category
                          ? 'bg-violet-100 text-violet-800 dark:bg-amber-900/30 dark:text-amber-300'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                          }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-800 pointer-events-none"></div>
                </div>
              </div>
            </section>

            {/* Videos section with card-based layout */}
            <section className="space-y-4">
              {/* Section header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Trending Videos</h2>
                  <span className="rounded-full bg-violet-100 dark:bg-amber-900/30 px-2.5 py-0.5 text-xs font-medium text-violet-800 dark:text-amber-300">
                    {totalVideos}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
                  <select className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 shadow-sm focus:border-violet-500 dark:focus:border-amber-500 focus:outline-none">
                    <option>Popular</option>
                    <option>Newest</option>
                    <option>Oldest</option>
                  </select>
                </div>
              </div>

              {/* Video grid */}
              {videoList.length > 0 ? (
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                  {videoList.map(video => (
                    <div key={video._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col h-full">
                      <VideoCard
                        video={video}
                        onClick={() => navigate(`/watch/${video._id}`)}
                        className="w-full border-0 flex-1 flex flex-col"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
                  <div className="mb-4 rounded-full bg-violet-100 dark:bg-amber-900/30 p-3 inline-flex">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-violet-600 dark:text-amber-500">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">No videos found</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Be the first to upload content in this category
                  </p>
                  <Button
                    onClick={() => navigate('/upload')}
                    className="mt-4 bg-violet-700 hover:bg-violet-800 dark:bg-amber-500 dark:hover:bg-amber-600 text-white"
                  >
                    Upload Video
                  </Button>
                </div>
              )}
            </section>

            {/* Recommended section */}
            {videoList.length > 0 && (
              <section className="mt-12 space-y-6 w-full">
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recommended for You</h2>
                  <button className="text-sm text-violet-700 dark:text-amber-500 hover:underline">
                    View all
                  </button>
                </div>

                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                  {videoList.slice(0, 5).map(video => (
                    <div key={`rec-${video._id}`} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
                      <VideoCard
                        video={video}
                        onClick={() => navigate(`/watch/${video._id}`)}
                        className="w-full border-0"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Simplify CTA section background */}
            <section className="mt-12 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 sm:p-6 w-full shadow-sm transition-colors duration-150">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 w-full">
                <div className="w-full sm:w-auto">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white break-words">Ready to share your content?</h2>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Join thousands of creators sharing their passion.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  {user ? (
                    <Button
                      onClick={() => navigate('/upload')}
                      className="w-full sm:w-auto"
                      size="lg"
                    >
                      Upload Now
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => navigate('/login')}
                        className="w-full sm:w-auto"
                      >
                        Sign in
                      </Button>
                      <Button
                        onClick={() => navigate('/register')}
                        className="w-full sm:w-auto"
                      >
                        Register
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </section>

            {/* Add back pagination */}
            {totalVideos > limit && (
              <div className="mt-6 flex justify-center w-full">
                <Pagination
                  currentPage={page}
                  totalPages={Math.ceil(totalVideos / limit)}
                  setPage={setPage}
                  className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-2 focus:ring-violet-500 dark:focus:ring-amber-500"
                />
              </div>
            )}
          </div>

          {/* Sidebar column - only visible on desktop */}
          <div className="hidden lg:block lg:w-4/12 space-y-4 self-start">
            <div className="sticky top-20 space-y-4">
              {/* Upload CTA card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Share Your Content</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Join thousands of creators and start sharing your videos with the world.
                </p>
                <Button
                  onClick={() => navigate('/upload')}
                  className="w-full bg-violet-700 hover:bg-violet-800 dark:bg-amber-500 dark:hover:bg-amber-600 text-white"
                  size="md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1.5">
                    <path d="M10.75 6.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" />
                  </svg>
                  Upload Video
                </Button>
              </div>

              {/* Top creators card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Top Creators</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Creator {i}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">1.2k subscribers</p>
                      </div>
                      <button className="ml-auto text-xs font-medium text-violet-700 dark:text-amber-500 hover:underline">
                        Follow
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {['Music', 'Gaming', 'Education', 'Entertainment', 'Sports', 'News', 'Technology'].map(category => (
                    <button
                      key={category}
                      className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
