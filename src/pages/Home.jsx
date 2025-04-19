import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useVideo } from '../contexts/index.js';
import { Loading, VideoCard } from '../components/index.js';
import { useBackendCheck } from '../hooks/useBackendCheck.js';
import { BackendError } from '../components/BackendError.jsx';
import Layout from '../components/layout/Layout';

function Home() {
  const navigate = useNavigate();
  const { videos, loading: videoLoading, error: videoError, fetchVideos, fetchTrendingVideos, fetchRecommendedVideos } = useVideo();
  const { available, loading: backendLoading, retry } = useBackendCheck();

  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [trendingVideos, setTrendingVideos] = useState({ videos: [] });
  const [recommendedVideos, setRecommendedVideos] = useState({
    videos: [],
    total: 0,
    page: 1,
    pages: 1
  });
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch trending videos
  useEffect(() => {
    const loadTrending = async () => {
      try {
        const data = await fetchTrendingVideos(10);
        if (data?.videos?.length > 0) {
          setTrendingVideos(data);
        }
      } catch (error) {
        console.error("Trending fetch failed:", error);
      }
    };

    if (available) {
      loadTrending();
    }
  }, [available, fetchTrendingVideos]);

  // Fetch recommended videos
  useEffect(() => {
    const loadRecommended = async () => {
      try {
        setIsLoadingMore(true);
        const data = await fetchRecommendedVideos(page, limit);
        if (data?.videos) {
          setRecommendedVideos(prev => ({
            ...data,
            videos: page === 1 ? data.videos : [...prev.videos, ...data.videos].filter((v, i, a) => 
              a.findIndex(t => t._id === v._id) === i
            ),
            page: data.page,
            pages: data.pages
          }));
        }
      } catch (error) {
        console.error("Recommended fetch failed:", error);
      } finally {
        setIsLoadingMore(false);
      }
    };

    if (available) loadRecommended();
  }, [available, page, limit, fetchRecommendedVideos]);

  const isLoading = (backendLoading && !videos) || (videoLoading && !recommendedVideos.videos.length);
  const hasMorePages = recommendedVideos.page < recommendedVideos.pages;

  const loadMore = () => {
    if (!isLoadingMore && hasMorePages) {
      setPage(p => p + 1);
    }
  };

  if (isLoading) return <Loading message="Loading content..." />;
  if (!available || videoError) return <BackendError onRetry={retry} />;

  const featuredVideo = trendingVideos.videos[0];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Featured Section */}
        {featuredVideo && (
          <div className="relative w-full h-[50vh] mb-8 overflow-hidden bg-gray-50 dark:bg-black">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${featuredVideo.thumbnail || '/default-thumbnail.jpg'})`,
                filter: 'blur(2px)',
                transform: 'scale(1.1)'
              }} 
            />
            <div className="absolute inset-0 bg-black/30 z-[5]" />
            <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12">
              <div className="max-w-2xl backdrop-blur-sm bg-black/20 p-6 rounded-2xl">
                <h1 className="text-4xl font-bold text-white mb-4 line-clamp-2">
                  {featuredVideo.title}
                </h1>
                <p className="text-gray-200 line-clamp-2 mb-6">
                  {featuredVideo.description}
                </p>
                <button 
                  onClick={() => navigate(`/watch/${featuredVideo._id}`)}
                  className="inline-flex items-center px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                  Watch Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Recommended Videos
            </h2>

            {/* Video Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recommendedVideos.videos.map((video) => (
                <VideoCard
                  key={video._id}
                  video={video}
                  onClick={() => navigate(`/watch/${video._id}`)}
                  className="transform hover:scale-[1.02] hover:shadow-xl transition-all duration-200 bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden"
                />
              ))}
            </div>

            {/* Load More */}
            {hasMorePages && (
              <div className="mt-12 text-center">
                <button
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className={`
                    inline-flex items-center px-6 py-3 rounded-lg shadow-lg hover:shadow-xl
                    ${isLoadingMore 
                      ? 'bg-amber-500/50 cursor-not-allowed' 
                      : 'bg-amber-500 hover:bg-amber-600'
                    }
                    text-black font-medium transition-all duration-200
                  `}
                >
                  {isLoadingMore ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
