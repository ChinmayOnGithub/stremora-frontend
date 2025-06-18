import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideo } from '../contexts/index.js';
import { VideoCard } from '../components/index.js';
import { useBackendCheck } from '../hooks/useBackendCheck.js';
import { BackendError } from '../components/BackendError.jsx';

// Skeleton shimmer animation (add to the file for local styles)
const skeletonShimmer = `
  @keyframes skeleton-shimmer {
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
`;

// Add shimmer style to the document head (only once)
if (typeof document !== 'undefined' && !document.getElementById('skeleton-shimmer-style')) {
  const style = document.createElement('style');
  style.id = 'skeleton-shimmer-style';
  style.innerHTML = skeletonShimmer;
  document.head.appendChild(style);
}

const shimmerClass =
  'relative overflow-hidden before:content-[""] before:absolute before:inset-0 before:bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0)_100%)] before:animate-[skeleton-shimmer_1.2s_infinite]';

function Home() {
  const navigate = useNavigate();
  const { loading: videoLoading, fetchTrendingVideos, fetchRecommendedVideos } = useVideo();
  const { available, loading: backendLoading, retry, retrying } = useBackendCheck();

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const topVideos = trendingVideos.videos.slice(0, 5);

  const tags = [
    "Gaming",
    "Technology"
  ]

  // Custom onRetry handler for BackendError (just retry backend check)
  const handleRetry = useCallback(() => {
    retry();
  }, [retry]);

  // Fetch trending videos on mount
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

  // Fetch recommended videos on mount and when page changes
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

  const isLoading = (backendLoading && !trendingVideos.videos.length) || (videoLoading && !recommendedVideos.videos.length);
  const hasMorePages = recommendedVideos.page < recommendedVideos.pages;

  const loadMore = () => {
    if (!isLoadingMore && hasMorePages) {
      setPage(p => p + 1);
    }
  };

  // Add intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMorePages && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const loadMoreTrigger = document.getElementById('load-more-trigger');
    if (loadMoreTrigger) {
      observer.observe(loadMoreTrigger);
    }

    return () => {
      if (loadMoreTrigger) {
        observer.unobserve(loadMoreTrigger);
      }
    };
  }, [hasMorePages, isLoadingMore, loadMore]);

  // Optimized auto-play with useCallback
  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % topVideos.length);
  }, [topVideos.length]);

  useEffect(() => {
    if (!isAutoPlaying || !topVideos.length) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, topVideos.length]);

  const handleSlideChange = useCallback((index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  }, []);

  if (isLoading) return <SkeletonHome />;
  if (!available) return <BackendError onRetry={handleRetry} retrying={retrying} />;

  const featuredVideo = trendingVideos.videos[0];
  // featuredVideo.tags = featuredVideo.tags || ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'];


  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900">
      {/* Featured Section Slider */}
      {topVideos.length > 0 && (
        <div className="relative w-full h-[25vh] md:h-[35vh] lg:h-[40vh] mb-4 overflow-hidden bg-gray-50 dark:bg-black">
          {topVideos.map((video, index) => (
            <div
              key={video._id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent z-10" />
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${video.thumbnail || '/default-thumbnail.jpg'})`,
                  filter: 'blur(3px)',
                  transform: 'scale(1.1)'
                }}
              />
              <div className="absolute inset-0 bg-black/40 z-[5]" />
              <div className="relative z-20 h-full w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-8 md:pb-12">
                <div className="max-w-2xl backdrop-blur-md bg-black/30 p-4 md:p-6 rounded-xl border border-white/10">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-3 line-clamp-2">
                    {video.title}
                  </h1>
                  <p className="text-gray-200 text-sm md:text-base lg:text-lg line-clamp-2 mb-4 md:mb-6">
                    {video.description}
                  </p>
                  <button
                    onClick={() => navigate(`/watch/${video._id}`)}
                    className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-medium transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Watch Now
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation */}
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 z-20 flex justify-between">
            <button
              onClick={() => handleSlideChange((currentSlide - 1 + topVideos.length) % topVideos.length)}
              className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors duration-200"
              aria-label="Previous slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => handleSlideChange((currentSlide + 1) % topVideos.length)}
              className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors duration-200"
              aria-label="Next slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {topVideos.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideChange(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentSlide ? 'bg-amber-500 w-4' : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tags Section */}
      <div className="w-full mx-auto px-2 sm:px-6 lg:px-8 mb-4">
        <div className="flex flex-wrap gap-2">
          {true ? (
            tags.map((tag, index) => (
              <button
                key={index}
                className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-300 rounded-md dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 border-1 border-gray-400 dark:border-gray-600 data-[selected=true]:bg-blue-500 data-[selected=true]:text-white data-[selected=true]:border-blue-500 dark:data-[selected=true]:bg-blue-600 dark:data-[selected=true]:border-blue-600 cursor-pointer"
                data-selected={false}
              >
                #{tag}
              </button>
            ))
          ) : (
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="text-sm font-medium">No tags available</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"> */}
        <div className="bg-gray-300/80 dark:bg-gray-950/95 backdrop-blur-sm rounded-none p-4 md:p-6 border border-gray-200/50 dark:border-gray-700/50">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Recommended Videos
          </h2>

          {/* Video Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {recommendedVideos.videos.map((video) => (
              <VideoCard
                key={video._id}
                video={video}
                onClick={() => navigate(`/watch/${video._id}`)}
                // className="
                // transform transition-all duration-200 hover:scale-[1.02] bg-white dark:bg-gray-800/80 rounded-lg overflow-hidden border border-gray-200/50 dark:border-gray-700/50
                // "
              />
            ))}
          </div>

          {/* Infinite Scroll Trigger */}
          {hasMorePages && (
            <div id="load-more-trigger" className="h-10 mt-8">
              {isLoadingMore && (
                <div className="flex justify-center">
                  <svg className="animate-spin h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    // </div>
  );
}

// Skeleton loader for Home page
function SkeletonHome() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 animate-pulse pt-2">
      {/* Featured Section Skeleton */}
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="relative flex items-end h-[22vh] sm:h-[28vh] md:h-[34vh] lg:h-[40vh] mb-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden">
          <div className={`absolute inset-0 bg-gray-200 dark:bg-gray-800 ${shimmerClass}`} />
          <div className="relative z-10 w-full max-w-2xl mx-4 sm:mx-8 my-6 sm:my-10 p-4 sm:p-6 md:p-8 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 flex flex-col gap-4 shadow-md">
            <div className={`h-8 sm:h-9 w-2/3 bg-gray-300 dark:bg-gray-700 rounded mb-2 ${shimmerClass}`} />
            <div className={`h-4 sm:h-5 w-1/2 bg-gray-200 dark:bg-gray-600 rounded mb-4 ${shimmerClass}`} />
            <div className={`h-9 sm:h-10 w-28 bg-gray-300 dark:bg-gray-700 rounded-lg ${shimmerClass}`} />
          </div>
          {/* Slider dots skeleton */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`h-2 w-4 rounded-full ${i === 0 ? 'bg-amber-300 dark:bg-amber-600' : 'bg-gray-400 dark:bg-gray-700'} ${shimmerClass}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Tags Skeleton */}
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 mb-4">
        <div className="flex flex-wrap gap-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className={`h-8 w-24 sm:w-28 bg-gray-200 dark:bg-gray-700 rounded-full shadow-sm border border-gray-200 dark:border-gray-800 ${shimmerClass}`} />
          ))}
        </div>
      </div>

      {/* Video Grid Skeleton */}
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 pb-12">
        <div className="bg-white/80 dark:bg-gray-950/90 rounded-xl shadow-md p-3 sm:p-4 md:p-6 border border-gray-200 dark:border-gray-800">
          <div className="h-7 w-44 sm:w-56 bg-gray-300 dark:bg-gray-700 rounded mb-6 mx-2" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col bg-gray-100 dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-800 overflow-hidden transition-all">
                {/* Thumbnail */}
                <div className={`aspect-video w-full bg-gray-200 dark:bg-gray-800 ${shimmerClass}`} />
                <div className="flex items-center gap-3 px-3 py-3">
                  {/* Avatar */}
                  <div className={`h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-700 border border-gray-200 dark:border-gray-800 ${shimmerClass}`} />
                  <div className="flex-1 flex flex-col gap-2">
                    {/* Title */}
                    <div className={`h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded ${shimmerClass}`} />
                    {/* Meta info */}
                    <div className={`h-3 w-1/2 bg-gray-300 dark:bg-gray-800 rounded ${shimmerClass}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
