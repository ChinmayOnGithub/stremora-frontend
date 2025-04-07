import { useEffect, useState, useMemo, useRef } from 'react';
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
import { formatDistanceToNow } from 'date-fns';

function Home() {
  const navigate = useNavigate();
  const { videos, loading: videoLoading, error: videoError, fetchVideos, fetchTrendingVideos, fetchRecommendedVideos, timeAgo } = useVideo();
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

  // Add these states
  const [trendingVideos, setTrendingVideos] = useState({ videos: [] });
  const [recommendedPage, setRecommendedPage] = useState(1);
  const [recommendedVideos, setRecommendedVideos] = useState({
    videos: [],
    total: 0,
    page: 1,
    pages: 1
  });

  // Add this state
  const [hasFetchedTrending, setHasFetchedTrending] = useState(false);

  // Fetch trending videos
  useEffect(() => {
    const loadTrending = async () => {
      try {
        // Only fetch if we haven't already
        if (!hasFetchedTrending) {
          console.log("[DEBUG] Fetching trending videos...");
          const data = await fetchTrendingVideos(10);
          console.log("[DEBUG] Trending data:", data);

          if (data?.videos) {
            setTrendingVideos(data);
            setHasFetchedTrending(true);
          }
        }
      } catch (error) {
        console.error("[ERROR] Trending fetch failed:", error);
      }
    };

    if (available && !hasFetchedTrending) {
      loadTrending();
    }
  }, [available, fetchTrendingVideos, hasFetchedTrending]);

  // Fetch recommended videos
  useEffect(() => {
    const loadRecommended = async () => {
      try {
        console.log("[DEBUG] Fetching recommended videos...");
        const data = await fetchRecommendedVideos(recommendedPage, limit);
        console.log("[DEBUG] Recommended data:", data);

        if (data) {
          setRecommendedVideos(data);
        }
      } catch (error) {
        console.error("[ERROR] Recommended fetch failed:", error);
      }
    };

    if (available) loadRecommended();
  }, [available, recommendedPage, limit, fetchRecommendedVideos]);

  useEffect(() => {
    if (available) fetchVideos(page, limit);
  }, [available, fetchVideos, page, limit]);

  useEffect(() => {
    // Save banner state to localStorage when it changes
    localStorage.setItem('bannerHidden', isBannerHidden);
  }, [isBannerHidden]);

  const formatTimeAgo = (isoDate) => {
    return formatDistanceToNow(new Date(isoDate), { addSuffix: true });
  };

  if (isLoading) return <Loading message="Loading content..." />;
  if (!available || videoError) return <BackendError onRetry={retry} />;

  return (
    <Container className="min-h-screen w-screen">

      <main className="min-h-screen overflow-hidden transition-colors duration-150 relative">
        {/* Add subtle background pattern */}
        {/* <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] opacity-5 dark:opacity-10 pointer-events-none"></div> */}

        {/* Reduce header spacer height */}
        {/* <div className="h-8 w-full"></div> */}

        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Two-column layout for desktop */}
          <div className="flex flex-col lg:flex-row lg:gap-6">
            {/* Main content column */}
            <div className="w-full lg:w-8/12 space-y-3">
              {/* Welcome section - more compact */}
              <section className="pt-1 pb-3 w-full">
                {user ? (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 flex items-center gap-2 w-full transition-colors duration-150 border border-amber-100/50 dark:border-gray-700/50">
                    <div className="relative h-10 w-10 flex-shrink-0">
                      <img
                        src={user.avatar || '/default-avatar.png'}
                        alt={`${user.username}'s avatar`}
                        className="h-full w-full rounded-full object-cover ring-1 ring-amber-500 dark:ring-amber-400"
                      />
                      <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-1 ring-white dark:ring-gray-800"></span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{greeting}</p>
                      <h1 className="text-base font-semibold text-gray-900 dark:text-white truncate">{user.username}</h1>
                    </div>
                    <Button
                      onClick={() => navigate('/upload')}
                      className="ml-auto bg-amber-500 hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-600 text-white flex-shrink-0 shadow-sm hover:shadow transition-all"
                      size="xs"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 mr-1">
                        <path d="M10.75 6.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" />
                      </svg>
                      <span className="relative top-px text-xs">Upload</span>
                    </Button>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-4 transition-colors duration-150">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Discover videos</h1>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => navigate('/login')}
                          className="border-amber-500 text-amber-600 hover:bg-amber-50 dark:border-amber-500 dark:text-amber-400 dark:hover:bg-amber-700/20"
                        >
                          Sign in
                        </Button>
                        <Button
                          onClick={() => navigate('/register')}
                          className="bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white"
                        >
                          Register
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Category navigation - more compact */}
              <section className="mb-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2 border border-amber-100/50 dark:border-gray-700/50">
                  <div className="relative">
                    <div className="flex w-full items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
                      {['All', 'Music', 'Gaming', 'Education', 'Entertainment', 'Sports', 'News', 'Technology'].map(category => (
                        <button
                          key={category}
                          onClick={() => setActiveCategory(category)}
                          className={`whitespace-nowrap px-2.5 py-1 text-xs font-medium transition-colors flex-shrink-0 rounded-full ${activeCategory === category
                            ? 'bg-amber-500 text-white dark:bg-amber-500 dark:text-white'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                            }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Content sections with consistent styling */}
              <section className="space-y-3">
                {/* Trending Videos - Compact Height */}
                <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1 text-amber-500">
                        <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75c-1.036 0-1.875-.84-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75C3.84 21.75 3 20.91 3 19.875v-6.75z" />
                      </svg>
                      Trending Now
                    </h2>
                    <button className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center">
                      View All
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 ml-1">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  {/* Trending videos scroll */}
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white/90 dark:from-gray-800/90 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white/90 dark:from-gray-800/90 to-transparent z-10 pointer-events-none"></div>

                    <div className="flex overflow-x-auto py-2 gap-3 hide-scrollbar scroll-smooth">
                      {trendingVideos.videos.map(video => (
                        <div key={video._id} className="flex-shrink-0 w-72 transform hover:-translate-y-0.5 transition-transform">
                          <VideoCard
                            video={video}
                            onClick={() => navigate(`/watch/${video._id}`)}
                            className="trending-card"
                            compact={false}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Recommended Videos - Compact Height */}
                <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1 text-amber-500">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                      Recommended For You
                    </h2>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Sort:</span>
                      <select className="text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-1.5 py-0.5 text-gray-700 dark:text-gray-300 focus:border-amber-500 dark:focus:border-amber-500 focus:outline-none">
                        <option>Popular</option>
                        <option>Newest</option>
                        <option>Oldest</option>
                      </select>
                    </div>
                  </div>

                  {/* Recommended videos grid */}
                  {recommendedVideos?.videos?.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                        {recommendedVideos.videos.map(video => (
                          <div key={video._id} className="transform hover:-translate-y-0.5 transition-transform">
                            <VideoCard
                              video={video}
                              onClick={() => navigate(`/watch/${video._id}`)}
                              className="recommended-card"
                              compact={false}
                            />
                          </div>
                        ))}
                      </div>
                      {recommendedVideos.total > limit && (
                        <div className="mt-2 flex justify-center">
                          <Pagination
                            currentPage={recommendedPage}
                            totalPages={recommendedVideos.pages}
                            setPage={setRecommendedPage}
                            className="pagination-compact"
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-2 text-gray-500 text-xs">
                      <p>No recommendations available</p>
                    </div>
                  )}
                </section>
              </section>
            </div>

            {/* Sidebar column - only visible on desktop */}
            <div className="hidden lg:block lg:w-4/12 space-y-4 self-start">
              <div className="sticky top-20 space-y-4"></div>
              {/* Upload CTA card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Share Your Content</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Join thousands of creators and start sharing your videos with the world.
                </p>
                <Button
                  onClick={() => navigate('/upload')}
                  className="w-full bg-amber-500 hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-600 text-white flex-shrink-0 shadow-sm hover:shadow transition-all"
                  size="md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1.5">
                    <path d="M10.75 6.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" />
                  </svg>
                  <span className="relative top-px">Upload Video</span>
                </Button>
              </div>

              {/* Top creators card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-amber-100/50 dark:border-gray-700/50">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2 text-amber-500">
                    <path fillRule="evenodd" d="M10 1a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 1zm3.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zm1.5 0a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0zM10 19a.75.75 0 01-.75-.75v-1.5a.75.75 0 011.5 0v1.5A.75.75 0 0110 19z" clipRule="evenodd" />
                  </svg>
                  Top Creators
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "Alex Morgan", avatar: "https://randomuser.me/api/portraits/women/44.jpg", subscribers: "2.4M" },
                    { name: "David Chen", avatar: "https://randomuser.me/api/portraits/men/32.jpg", subscribers: "986K" },
                    { name: "Sophia Williams", avatar: "https://randomuser.me/api/portraits/women/68.jpg", subscribers: "1.7M" }
                  ].map((creator, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-amber-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="h-10 w-10 rounded-full flex-shrink-0 overflow-hidden border-2 border-amber-200 dark:border-amber-600">
                        <img src={creator.avatar} alt={creator.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{creator.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{creator.subscribers} subscribers</p>
                      </div>
                      <button className="ml-auto text-xs font-medium bg-amber-100 hover:bg-amber-200 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full transition-colors">
                        Follow
                      </button>
                    </div>
                  ))}
                  <button className="w-full text-sm text-amber-600 dark:text-amber-400 hover:underline mt-2 text-center">
                    View all creators
                  </button>
                </div>
              </div>

              {/* Categories card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-amber-100/50 dark:border-gray-700/50">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2 text-amber-500">
                    <path fillRule="evenodd" d="M2.5 3A1.5 1.5 0 001 4.5v4A1.5 1.5 0 002.5 10h6A1.5 1.5 0 0010 8.5v-4A1.5 1.5 0 008.5 3h-6zm11 2A1.5 1.5 0 0012 6.5v7a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5v-7A1.5 1.5 0 0019.5 5h-6zm-10 7A1.5 1.5 0 002 13.5v2A1.5 1.5 0 003.5 17h6a1.5 1.5 0 001.5-1.5v-2A1.5 1.5 0 009.5 12h-6z" clipRule="evenodd" />
                  </svg>
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'Music', count: '2.3K' },
                    { name: 'Gaming', count: '4.7K' },
                    { name: 'Education', count: '1.2K' },
                    { name: 'Entertainment', count: '3.8K' },
                    { name: 'Sports', count: '1.9K' },
                    { name: 'News', count: '876' },
                    { name: 'Technology', count: '2.1K' }
                  ].map(category => (
                    <button
                      key={category.name}
                      className="px-3 py-1.5 text-xs font-medium bg-amber-50 text-amber-800 dark:bg-gray-800 dark:text-amber-300 rounded-md hover:bg-amber-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
                    >
                      {category.name}
                      <span className="text-xs text-amber-500 dark:text-amber-400 font-normal">({category.count})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </Container>

  );
}

export default Home;
