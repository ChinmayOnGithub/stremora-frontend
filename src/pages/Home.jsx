import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useVideo } from '../contexts/index.js';
import { Button, Loading, VideoCard } from '../components/index.js';
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
  // featuredVideo.tags = featuredVideo.tags || ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'];


  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Featured Section */}
        {featuredVideo && (
          <div className="relative w-full h-[30vh] mb-8 overflow-hidden bg-gray-50 dark:bg-black">
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-10" />
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${featuredVideo.thumbnail || '/default-thumbnail.jpg'})`,
                filter: 'blur(2px)',
                transform: 'scale(1.1)'
              }}
            />
            <div className="absolute inset-0 bg-black/30 z-[5]" />
            <div className="relative z-20 h-full w-fit lg:w-[80%] md:w-[80%] sm:w-full sm:max-w-7xl  px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12">
              <div className="max-w-2xl backdrop-blur-sm bg-black/20 p-6 rounded-2xl">
                <h1 className="text-2xl sm:text-4xl font-bold text-white mb-4 line-clamp-2">
                  {featuredVideo.title}
                </h1>
                <p className="text-gray-200 line-clamp-2 mb-6">
                  {featuredVideo.description}
                </p>
                <button
                  onClick={() => navigate(`/watch/${featuredVideo._id}`)}
                  className="inline-flex items-center px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  {/* play icon */}
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tags for the genre here */}
        <div className="flex flex-wrap gap-4 mb-6 px-2 sm:px-6 lg:px-8 max-w-7xl">
          {featuredVideo?.tags?.length > 0 ? (
            <>
              {/* <h2 className="w-full text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Tags:
              </h2> */}
              {featuredVideo.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-1 rounded-sm text-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  #{tag}
                </span>
              ))}
            </>
          ) : (
            <h2 className="text-lg font-semibold text-gray-500 dark:text-gray-400">
              No tags available
            </h2>
          )}
        </div>


        {/* Main Content */}
        <div className="w-full bg-gray-200 dark:bg-gray-800/50 p-8 shadow-sm mx-auto px-4 sm:px-6 lg:px-8 pb-12">

          <div className="max-w-7xl mx-auto">
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
                  className="transform transition-all duration-200 bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden"
                />
              ))}
            </div>

            {/* Load More */}
            {hasMorePages && (
              <div className="mt-12 text-center">
                <Button
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className={`
                    inline-flex items-center px-6 py-3 rounded-md shadow-lg hover:shadow-xl
                    ${isLoadingMore
                      ? 'bg-amber-500/50 cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-600'
                    }
                    text-black font-medium transition-all duration-200
                  `}
                >
                  {isLoadingMore ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <h1 className='text-lg font-semibold text-white dark:text-gray-100'>Loading...</h1>
                    </>
                  ) : (
                    <h1 className="text-md font-semibold text-white dark:text-gray-100">
                      Load More
                    </h1>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
