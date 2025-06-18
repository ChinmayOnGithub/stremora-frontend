import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useVideo } from '../contexts/index.js';
import { Button, Loading, SubscriptionItem, VideoCard } from '../components/index.js';
import { useBackendCheck } from '../hooks/useBackendCheck.js';
import { BackendError } from '../components/BackendError.jsx';
import Layout from '../components/layout/Layout';
import { time } from 'framer-motion';
import CreatorCard from '../components/CreatorCard.jsx';

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const topVideos = trendingVideos.videos.slice(0, 5);

  const topCreators = [
    { _id: '1', name: 'Creator 1', thumbnail: '/path/to/thumbnail1.jpg' },
    { _id: '2', name: 'Creator 2', thumbnail: '/path/to/thumbnail2.jpg' },
    { _id: '3', name: 'Creator 3', thumbnail: '/path/to/thumbnail3.jpg' },
    { _id: '4', name: 'Creator 4', thumbnail: '/path/to/thumbnail4.jpg' },
    { _id: '5', name: 'Creator 5', thumbnail: '/path/to/thumbnail5.jpg' },
  ];

  const tags = [
    "Gaming",
    "Technology"
  ]

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

  if (isLoading) return <Loading message="Loading content..." />;
  if (!available || videoError) return <BackendError onRetry={retry} />;

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

export default Home;
