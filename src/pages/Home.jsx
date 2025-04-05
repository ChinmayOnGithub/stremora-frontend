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
    <main className="min-h-screen pt-16">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 -z-10 opacity-30 dark:opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#3b82f6 0.5px, transparent 0.5px), radial-gradient(#3b82f6 0.5px, #ffffff 0.5px)`,
          backgroundSize: `20px 20px`,
          backgroundPosition: `0 0, 10px 10px`,
          filter: 'blur(0.5px)'
        }}
      ></div>

      <Container className="py-6 mt-2">
        {/* Compact Header with User Info + Categories */}
        <div className="flex flex-col space-y-5">
          {/* Top Bar - User Welcome + Actions */}
          <div className="flex flex-wrap items-center justify-between gap-y-3">
            {/* User Welcome or App Logo */}
            {user ? (
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="relative">
                  <img
                    src={user.avatar || '/default-avatar.png'}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover border border-primary/20 dark:border-amber-500/20"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-green-500 border border-white dark:border-gray-900"></div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground dark:text-gray-400">
                    {greeting}
                  </p>
                  <h1 className="text-sm font-medium text-foreground dark:text-white">
                    {user.username}
                  </h1>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-amber-500/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary dark:text-amber-500">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                  </svg>
                </div>
                <h1 className="text-lg font-semibold text-foreground dark:text-white">
                  Stremora
                </h1>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {user ? (
                <Button
                  onClick={() => navigate('/upload')}
                  size="sm"
                  className="h-9 px-4 text-sm flex items-center gap-1.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M10.75 6.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" />
                  </svg>
                  Upload
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/login')}
                    size="sm"
                    className="h-9 px-4 text-sm"
                  >
                    Sign in
                  </Button>
                  <Button
                    onClick={() => navigate('/register')}
                    size="sm"
                    className="h-9 px-4 text-sm"
                  >
                    Register
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Category Navigation - Horizontal Scrollable */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1 px-1 -mx-1">
            {['All', 'Music', 'Gaming', 'Education', 'Entertainment', 'Sports', 'News', 'Technology'].map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${activeCategory === category
                  ? 'bg-primary text-white dark:bg-amber-500'
                  : 'bg-muted-foreground/5 text-muted-foreground hover:bg-muted-foreground/10 dark:bg-gray-800 dark:hover:bg-gray-700'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Content - Compact Banner */}
        {!isBannerHidden && (
          <div className="mt-4 relative overflow-hidden rounded-lg aspect-[21/9] max-h-[180px]">
            <img
              src="https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80"
              alt="Featured content"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <span className="inline-block rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-medium text-white mb-1 dark:bg-amber-500/90">
                Featured
              </span>
              <h3 className="text-sm font-bold text-white mb-1">
                Discover trending content from creators worldwide
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => navigate('/featured')}
                  className="text-[10px] h-7 px-2"
                  size="sm"
                >
                  Explore
                </Button>
                <button
                  onClick={() => setIsBannerHidden(true)}
                  className="rounded-full p-1 text-white/60 transition-all hover:bg-white/10 hover:text-white"
                  aria-label="Close"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Videos Section - Compact Header */}
        <div className="mt-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground dark:text-white">
                Trending Videos
              </h2>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary dark:bg-amber-900/30 dark:text-amber-300">
                {totalVideos}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-400">
              <span className="text-xs">Sort by:</span>
              <select className="rounded-md border border-muted-foreground/20 bg-background px-2 py-1 text-xs dark:border-gray-700 dark:bg-gray-800">
                <option>Popular</option>
                <option>Newest</option>
                <option>Oldest</option>
              </select>
            </div>
          </div>

          {/* Video Grid - Dense Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {videoList.map(video => (
              <VideoCard
                key={video._id}
                video={video}
                onClick={() => navigate(`/watch/${video._id}`)}
                className="overflow-hidden rounded-md border border-muted-foreground/10 bg-background shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-800/90 cursor-pointer"
              />
            ))}
          </div>

          {/* Empty State - Compact */}
          {videoList.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-3 rounded-full bg-primary/10 p-3 dark:bg-amber-900/20">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-primary dark:text-amber-400">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-base font-medium text-foreground dark:text-white">No videos found</h3>
              <p className="mt-1 text-sm text-muted-foreground dark:text-gray-400">
                Be the first to upload content
              </p>
              <Button
                onClick={() => navigate('/upload')}
                className="mt-4"
                size="sm"
              >
                Upload Video
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalVideos > limit && (
            <div className="mt-6 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={Math.ceil(totalVideos / limit)}
                setPage={setPage}
              />
            </div>
          )}
        </div>

        {/* Recommended Section */}
        <div className="mt-8 space-y-5">
          <h2 className="text-lg font-semibold text-foreground dark:text-white">
            Recommended for You
          </h2>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {/* Placeholder recommended videos - same as trending for now */}
            {videoList.slice(0, 6).map(video => (
              <VideoCard
                key={`rec-${video._id}`}
                video={video}
                onClick={() => navigate(`/watch/${video._id}`)}
                className="overflow-hidden rounded-md border border-muted-foreground/10 bg-background shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-800/90 cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Compact CTA Banner */}
        <div className="mt-8 rounded-lg border border-muted-foreground/10 bg-gradient-to-r from-primary/5 to-primary/10 p-5 dark:border-gray-800 dark:from-amber-900/10 dark:to-amber-800/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="mb-3 sm:mb-0">
              <h2 className="text-base font-semibold text-foreground dark:text-white">Ready to share your content?</h2>
              <p className="mt-1 text-sm text-muted-foreground dark:text-gray-300">
                Join thousands of creators sharing their passion
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {user ? (
                <Button
                  onClick={() => navigate('/upload')}
                  className="text-sm w-full sm:w-auto"
                >
                  Upload Now
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/login')}
                    className="text-sm w-full sm:w-auto"
                  >
                    Sign in
                  </Button>
                  <Button
                    onClick={() => navigate('/register')}
                    className="text-sm w-full sm:w-auto"
                  >
                    Register
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}

export default Home;
