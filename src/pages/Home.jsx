// import { useEffect, useState, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useVideo } from '../contexts/index.js';
// import { VideoCard } from '../components/index.js';
// import { useBackendCheck } from '../hooks/useBackendCheck.js';
// import { BackendError } from '../components/BackendError.jsx';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
// import { Skeleton } from '@/components/ui/skeleton';
// import { Play, Tag, Loader2, ArrowRight, Flame, Rss } from 'lucide-react';
// import Autoplay from "embla-carousel-autoplay";

// function Home() {
//   const navigate = useNavigate();
//   // Assuming a new function `fetchSubscriptionVideos` exists in your context
//   const { loading: videoLoading, fetchTrendingVideos, fetchRecommendedVideos, fetchSubscriptionVideos } = useVideo();
//   const { available, loading: backendLoading, retry, retrying } = useBackendCheck();

//   // Your state and logic are preserved
//   const [page, setPage] = useState(1);
//   const [limit] = useState(12);
//   const [trendingVideos, setTrendingVideos] = useState({ videos: [] });
//   const [recommendedVideos, setRecommendedVideos] = useState({
//     videos: [],
//     total: 0,
//     page: 1,
//     pages: 1
//   });
//   // New state for subscription videos
//   const [subscriptionVideos, setSubscriptionVideos] = useState({ videos: [] });
//   const [isLoadingMore, setIsLoadingMore] = useState(false);
//   const heroVideo = trendingVideos.videos[0];
//   const topTrendingList = trendingVideos.videos.slice(1, 5);

//   const tags = ["Gaming", "Technology", "Music", "Education", "Vlogs"];

//   const handleRetry = useCallback(() => {
//     retry();
//   }, [retry]);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         // Fetch trending and initial recommended videos in parallel
//         const [trendingData, recommendedData] = await Promise.all([
//           fetchTrendingVideos(10),
//           fetchRecommendedVideos(1, 8) // Fetch only 8 for the 2-row display
//         ]);

//         if (trendingData?.videos?.length > 0) {
//           setTrendingVideos(trendingData);
//         }
//         if (recommendedData?.videos) {
//           setRecommendedVideos(recommendedData);
//         }

//         // Placeholder for fetching subscription videos - you can uncomment when logic is ready
//         // const subscriptionData = await fetchSubscriptionVideos();
//         // if (subscriptionData?.videos) {
//         //   setSubscriptionVideos(subscriptionData);
//         // }

//       } catch (error) {
//         console.error("Failed to fetch initial page data:", error);
//       }
//     };
//     if (available) {
//       loadData();
//     }
//   }, [available, fetchTrendingVideos, fetchRecommendedVideos]);


//   const isLoading = (backendLoading && !trendingVideos.videos.length) || (videoLoading && !recommendedVideos.videos.length);

//   if (isLoading) return <SkeletonHome />;
//   if (!available) return <BackendError onRetry={handleRetry} retrying={retrying} />;

//   return (
//     <div className="min-h-screen text-foreground">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

//         {/* Modern Hero Section */}
//         {heroVideo && (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-2 relative w-full aspect-video rounded-xl overflow-hidden shadow-lg cursor-pointer group" onClick={() => navigate(`/watch/${heroVideo._id}`)}>
//               <img src={heroVideo.thumbnail} alt={heroVideo.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
//               <div className="relative h-full flex flex-col justify-end p-6 text-white">
//                 <h1 className="text-2xl md:text-3xl font-bold line-clamp-2 [text-shadow:0_2px_4px_rgba(0,0,0,0.7)]">
//                   {heroVideo.title}
//                 </h1>
//                 <p className="text-sm text-gray-200 mt-2 line-clamp-2 [text-shadow:0_1px_2px_rgba(0,0,0,0.7)]">
//                   {heroVideo.description}
//                 </p>
//               </div>
//             </div>
//             <div className="flex flex-col space-y-4">
//               <h2 className="text-xl font-bold border-b pb-2 flex items-center gap-2"><Flame className="text-primary" /> Top Trending</h2>
//               {topTrendingList.map(video => (
//                 <div key={video._id} className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate(`/watch/${video._id}`)}>
//                   <img src={video.thumbnail} alt={video.title} className="w-28 h-16 rounded-md object-cover" />
//                   <div className="flex-1">
//                     <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">{video.title}</h3>
//                     <p className="text-xs text-muted-foreground">{video.owner?.username}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Content sections with contrasting background */}
//         <div className="space-y-12 rounded-lg bg-muted/50 p-6">
//           {/* Recommended Videos Section (Limited to 2 rows) */}
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <h2 className="text-2xl font-bold">Recommended For You</h2>
//               <Button variant="ghost">View All <ArrowRight className="ml-2 h-4 w-4" /></Button>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
//               {recommendedVideos.videos.map((video) => (
//                 <VideoCard
//                   key={video._id}
//                   video={video}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* From Your Subscriptions Section */}
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <h2 className="text-2xl font-bold flex items-center gap-2"><Rss className="text-primary" /> From Your Subscriptions</h2>
//               <Button variant="ghost">View All <ArrowRight className="ml-2 h-4 w-4" /></Button>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
//               {/* Placeholder: Using recommended videos for layout. Replace with `subscriptionVideos.videos` when logic is ready. */}
//               {recommendedVideos.videos.slice(0, 4).map((video) => (
//                 <VideoCard
//                   key={video._id}
//                   video={{ ...video, title: "New Video from Subscription" }} // Example title change
//                 />
//               ))}
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// // Skeleton loader for Home page, now using shadcn/ui components
// function SkeletonHome() {
//   return (
//     <div className="min-h-screen bg-background animate-pulse">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <Skeleton className="lg:col-span-2 w-full aspect-video rounded-xl" />
//           <div className="space-y-4">
//             <Skeleton className="h-8 w-48" />
//             {Array.from({ length: 4 }).map((_, i) => (
//               <div key={i} className="flex items-center gap-4">
//                 <Skeleton className="w-28 h-16 rounded-md" />
//                 <div className="flex-1 space-y-2">
//                   <Skeleton className="h-4 w-full" />
//                   <Skeleton className="h-4 w-2/3" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//         <div className="rounded-lg bg-muted/50 p-6 space-y-12">
//           <div className="space-y-4">
//             <Skeleton className="h-8 w-64" />
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {Array.from({ length: 4 }).map((_, i) => (
//                 <div key={i} className="space-y-2">
//                   <Skeleton className="aspect-video w-full rounded-lg" />
//                   <div className="flex items-start gap-3 pt-2">
//                     <Skeleton className="h-9 w-9 rounded-full" />
//                     <div className="flex-1 space-y-1">
//                       <Skeleton className="h-4 w-3/4" />
//                       <Skeleton className="h-3 w-1/2" />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div className="space-y-4">
//             <Skeleton className="h-8 w-64" />
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {Array.from({ length: 4 }).map((_, i) => (
//                 <div key={i} className="space-y-2">
//                   <Skeleton className="aspect-video w-full rounded-lg" />
//                   <div className="flex items-start gap-3 pt-2">
//                     <Skeleton className="h-9 w-9 rounded-full" />
//                     <div className="flex-1 space-y-1">
//                       <Skeleton className="h-4 w-3/4" />
//                       <Skeleton className="h-3 w-1/2" />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Home;

// /*
// // ============================================================================
// // Your original, feature-rich JSX is preserved here for reference.
// // ============================================================================
// return (
//     <div className="min-h-screen bg-gray-200 dark:bg-gray-900">
//       {topVideos.length > 0 && (
//         <div className="relative w-full h-[25vh] md:h-[35vh] lg:h-[40vh] mb-4 overflow-hidden bg-gray-50 dark:bg-black">
//           {topVideos.map((video, index) => (
//             <div
//               key={video._id}
//               className={`absolute inset-0 transition-opacity duration-500 ${
//                 index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
//               }`}
//             >
//               <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent z-10" />
//               <div
//                 className="absolute inset-0 bg-cover bg-center"
//                 style={{
//                   backgroundImage: `url(${video.thumbnail || '/default-thumbnail.jpg'})`,
//                   filter: 'blur(3px)',
//                   transform: 'scale(1.1)'
//                 }}
//               />
//               <div className="absolute inset-0 bg-black/40 z-[5]" />
//               <div className="relative z-20 h-full w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-8 md:pb-12">
//                 <div className="max-w-2xl backdrop-blur-md bg-black/30 p-4 md:p-6 rounded-xl border border-white/10">
//                   <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-3 line-clamp-2">
//                     {video.title}
//                   </h1>
//                   <p className="text-gray-200 text-sm md:text-base lg:text-lg line-clamp-2 mb-4 md:mb-6">
//                     {video.description}
//                   </p>
//                   <button
//                     onClick={() => navigate(`/watch/${video._id}`)}
//                     className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-medium transition-colors duration-200"
//                   >
//                     <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
//                       <path d="M8 5v14l11-7z" />
//                     </svg>
//                     Watch Now
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//           <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 z-20 flex justify-between">
//             <button
//               onClick={() => handleSlideChange((currentSlide - 1 + topVideos.length) % topVideos.length)}
//               className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors duration-200"
//               aria-label="Previous slide"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//               </svg>
//             </button>
//             <button
//               onClick={() => handleSlideChange((currentSlide + 1) % topVideos.length)}
//               className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors duration-200"
//               aria-label="Next slide"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//               </svg>
//             </button>
//           </div>
//           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
//             {topVideos.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => handleSlideChange(index)}
//                 className={`w-2 h-2 rounded-full transition-all duration-200 ${
//                   index === currentSlide ? 'bg-amber-500 w-4' : 'bg-white/50 hover:bg-white/75'
//                 }`}
//                 aria-label={`Go to slide ${index + 1}`}
//               />
//             ))}
//           </div>
//         </div>
//       )}
//       <div className="w-full mx-auto px-2 sm:px-6 lg:px-8 mb-4">
//         <div className="flex flex-wrap gap-2">
//           {true ? (
//             tags.map((tag, index) => (
//               <button
//                 key={index}
//                 className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-300 rounded-md dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 border-1 border-gray-400 dark:border-gray-600 data-[selected=true]:bg-blue-500 data-[selected=true]:text-white data-[selected=true]:border-blue-500 dark:data-[selected=true]:bg-blue-600 dark:data-[selected=true]:border-blue-600 cursor-pointer"
//                 data-selected={false}
//               >
//                 #{tag}
//               </button>
//             ))
//           ) : (
//             <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700">
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
//               </svg>
//               <span className="text-sm font-medium">No tags available</span>
//             </div>
//           )}
//         </div>
//       </div>
//         <div className="bg-gray-300/80 dark:bg-gray-950/95 backdrop-blur-sm rounded-none p-4 md:p-6 border border-gray-200/50 dark:border-gray-700/50">
//           <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6">
//             Recommended Videos
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
//             {recommendedVideos.videos.map((video) => (
//               <VideoCard
//                 key={video._id}
//                 video={video}
//                 onClick={() => navigate(`/watch/${video._id}`)}
//               />
//             ))}
//           </div>
//           {hasMorePages && (
//             <div id="load-more-trigger" className="h-10 mt-8">
//               {isLoadingMore && (
//                 <div className="flex justify-center">
//                   <svg className="animate-spin h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                   </svg>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//   );
// */

// ==============================================================
// import { useEffect, useState, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useVideo } from '../contexts/index.js';
// import { VideoCard } from '../components/index.js';
// import { useBackendCheck } from '../hooks/useBackendCheck.js';
// import { BackendError } from '../components/BackendError.jsx';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Play, Tag, Loader2, ArrowRight, Flame, Rss } from 'lucide-react';

// function Home() {
//   const navigate = useNavigate();
//   // Assuming a new function `fetchSubscriptionVideos` exists in your context
//   const { loading: videoLoading, fetchTrendingVideos, fetchRecommendedVideos, fetchSubscriptionVideos } = useVideo();
//   const { available, loading: backendLoading, retry, retrying } = useBackendCheck();

//   // Your state and logic are preserved
//   const [page, setPage] = useState(1);
//   const [limit] = useState(12);
//   const [trendingVideos, setTrendingVideos] = useState({ videos: [] });
//   const [recommendedVideos, setRecommendedVideos] = useState({
//     videos: [],
//     total: 0,
//     page: 1,
//     pages: 1
//   });
//   // New state for subscription videos
//   const [subscriptionVideos, setSubscriptionVideos] = useState({ videos: [] });
//   const [isLoadingMore, setIsLoadingMore] = useState(false);
//   const heroVideo = trendingVideos.videos[0];
//   const topTrendingList = trendingVideos.videos.slice(1, 5);

//   const tags = ["Gaming", "Technology", "Music", "Education", "Vlogs"];

//   const handleRetry = useCallback(() => {
//     retry();
//   }, [retry]);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         // Fetch trending and initial recommended videos in parallel
//         const [trendingData, recommendedData] = await Promise.all([
//           fetchTrendingVideos(10),
//           fetchRecommendedVideos(1, 8) // Fetch only 8 for the 2-row display
//         ]);

//         if (trendingData?.videos?.length > 0) {
//           setTrendingVideos(trendingData);
//         }
//         if (recommendedData?.videos) {
//           setRecommendedVideos(recommendedData);
//         }

//         // Placeholder for fetching subscription videos - you can uncomment when logic is ready
//         // const subscriptionData = await fetchSubscriptionVideos();
//         // if (subscriptionData?.videos) {
//         //   setSubscriptionVideos(subscriptionData);
//         // }

//       } catch (error) {
//         console.error("Failed to fetch initial page data:", error);
//       }
//     };
//     if (available) {
//       loadData();
//     }
//   }, [available, fetchTrendingVideos, fetchRecommendedVideos]);


//   const isLoading = (backendLoading && !trendingVideos.videos.length) || (videoLoading && !recommendedVideos.videos.length);

//   const loadMore = useCallback(() => {
//     if (!isLoadingMore && recommendedVideos.page < recommendedVideos.pages) {
//       setPage(p => p + 1);
//     }
//   }, [isLoadingMore, recommendedVideos.page, recommendedVideos.pages]);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting) {
//           loadMore();
//         }
//       },
//       { threshold: 0.5 }
//     );
//     const loadMoreTrigger = document.getElementById('load-more-trigger');
//     if (loadMoreTrigger) observer.observe(loadMoreTrigger);
//     return () => {
//       if (loadMoreTrigger) observer.unobserve(loadMoreTrigger);
//     };
//   }, [loadMore]);

//   if (isLoading) return <SkeletonHome />;
//   if (!available) return <BackendError onRetry={handleRetry} retrying={retrying} />;

//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

//         {/* Modern Hero Section */}
//         {heroVideo && (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-2 relative w-full aspect-video rounded-xl overflow-hidden shadow-lg cursor-pointer group" onClick={() => navigate(`/watch/${heroVideo._id}`)}>
//               <img src={heroVideo.thumbnail} alt={heroVideo.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
//               <div className="relative h-full flex flex-col justify-end p-6 text-white">
//                 <h1 className="text-2xl md:text-3xl font-bold line-clamp-2 [text-shadow:0_2px_4px_rgba(0,0,0,0.7)]">
//                   {heroVideo.title}
//                 </h1>
//                 <p className="text-sm text-gray-200 mt-2 line-clamp-2 [text-shadow:0_1px_2px_rgba(0,0,0,0.7)]">
//                   {heroVideo.description}
//                 </p>
//               </div>
//             </div>
//             <Card className="flex flex-col">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2"><Flame className="text-primary" /> Top Trending</CardTitle>
//               </CardHeader>
//               <CardContent className="flex flex-col space-y-4">
//                 {topTrendingList.map(video => (
//                   <div key={video._id} className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate(`/watch/${video._id}`)}>
//                     <img src={video.thumbnail} alt={video.title} className="w-28 h-16 rounded-md object-cover" />
//                     <div className="flex-1 min-w-0">
//                       <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">{video.title}</h3>
//                       <p className="text-xs text-muted-foreground">{video.owner?.username}</p>
//                     </div>
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>
//           </div>
//         )}

//         {/* Recommended Videos Section */}
//         <Card>
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <CardTitle className="text-2xl font-bold">Recommended For You</CardTitle>
//               <Button variant="ghost">View All <ArrowRight className="ml-2 h-4 w-4" /></Button>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
//               {recommendedVideos.videos.map((video) => (
//                 <VideoCard
//                   key={video._id}
//                   video={video}
//                 />
//               ))}
//             </div>
//             {recommendedVideos.page < recommendedVideos.pages && (
//               <div id="load-more-trigger" className="h-10 mt-8 flex justify-center items-center">
//                 {isLoadingMore && <Loader2 className="h-6 w-6 text-primary animate-spin" />}
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* From Your Subscriptions Section */}
//         <Card>
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <CardTitle className="text-2xl font-bold flex items-center gap-2"><Rss className="text-primary" /> From Your Subscriptions</CardTitle>
//               <Button variant="ghost">View All <ArrowRight className="ml-2 h-4 w-4" /></Button>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
//               {/* Placeholder: Using recommended videos for layout. Replace with `subscriptionVideos.videos` when logic is ready. */}
//               {recommendedVideos.videos.slice(0, 4).map((video) => (
//                 <VideoCard
//                   key={video._id}
//                   video={{ ...video, title: "New Video from Subscription" }}
//                 />
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//       </div>
//     </div>
//   );
// }

// // Skeleton loader for Home page, now using shadcn/ui components
// function SkeletonHome() {
//   return (
//     <div className="min-h-screen bg-background animate-pulse">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <Skeleton className="lg:col-span-2 w-full aspect-video rounded-xl" />
//           <div className="space-y-4">
//             <Skeleton className="h-8 w-48" />
//             {Array.from({ length: 4 }).map((_, i) => (
//               <div key={i} className="flex items-center gap-4">
//                 <Skeleton className="w-28 h-16 rounded-md" />
//                 <div className="flex-1 space-y-2">
//                   <Skeleton className="h-4 w-full" />
//                   <Skeleton className="h-4 w-2/3" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//         <Card>
//           <CardHeader><Skeleton className="h-8 w-64" /></CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {Array.from({ length: 4 }).map((_, i) => (
//                 <div key={i} className="space-y-2">
//                   <Skeleton className="aspect-video w-full rounded-lg" />
//                   <div className="flex items-start gap-3 pt-2">
//                     <Skeleton className="h-9 w-9 rounded-full" />
//                     <div className="flex-1 space-y-1">
//                       <Skeleton className="h-4 w-3/4" />
//                       <Skeleton className="h-3 w-1/2" />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

// export default Home;


// -------------------------------
// // src/pages/Home.jsx
// import React, { useEffect, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { useVideo } from "../contexts/index.js";
// import { VideoCard } from "../components/index.js";
// import { useBackendCheck } from "../hooks/useBackendCheck.js";
// import { BackendError } from "../components/BackendError.jsx";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Flame, Rss, Users, Twitter, ArrowRight, Loader2 } from "lucide-react";

// /**
//  * Home (grayscale) — all styles via Tailwind + inline styles only (no external CSS)
//  *
//  * Key rules enforced:
//  *  - Grayscale-only palette (no hue accents)
//  *  - Visible dotted grid overlay (inline background-image)
//  *  - Recommended section limited to 8 items (2 rows x 4)
//  *  - No external CSS files required
//  */

// /* ---- Layout tokens (for readability) ---- */
// const GUTTER = 32; // px (kept consistent via container padding)
// const GRID_STEP = 16; // grid dot spacing in px
// const RECOMMENDED_LIMIT = 8; // 2 rows x 4

// export default function Home() {
//   const navigate = useNavigate();
//   const { loading: videoLoading, fetchTrendingVideos, fetchRecommendedVideos } = useVideo();
//   const { available, loading: backendLoading, retry, retrying } = useBackendCheck();

//   const [trending, setTrending] = useState({ videos: [] });
//   const [recommended, setRecommended] = useState({ videos: [], page: 1, pages: 1 });
//   const [subscriptions, setSubscriptions] = useState({ videos: [] }); // placeholder
//   const [isLoadingMore, setIsLoadingMore] = useState(false);

//   const hero = trending.videos?.[0];
//   const topTrending = trending.videos?.slice(1, 5) ?? [];

//   // detect dark class on html — used only to pick grid dot color
//   const [isDark, setIsDark] = useState(() =>
//     typeof document !== "undefined" ? document.documentElement.classList.contains("dark") : false
//   );
//   useEffect(() => {
//     // listen for changes to <html> classlist (in case theme toggles)
//     if (typeof document === "undefined") return;
//     const el = document.documentElement;
//     const mo = new MutationObserver(() => setIsDark(el.classList.contains("dark")));
//     mo.observe(el, { attributes: true, attributeFilter: ["class"] });
//     return () => mo.disconnect();
//   }, []);

//   const gridDotColor = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)";
//   // dotted grid (two layered radial gradients offset for subtle dot pattern)
//   const gridBackground = `
//     radial-gradient(circle, ${gridDotColor} 1px, transparent 1px), 
//     radial-gradient(circle, ${gridDotColor} 1px, transparent 1px)
//   `;

//   const handleRetry = useCallback(() => retry(), [retry]);

//   useEffect(() => {
//     if (!available) return;
//     let mounted = true;
//     (async () => {
//       try {
//         const [tr, rec] = await Promise.all([
//           fetchTrendingVideos(10),
//           fetchRecommendedVideos(1, RECOMMENDED_LIMIT)
//         ]);
//         if (!mounted) return;
//         if (tr?.videos) setTrending(tr);
//         if (rec?.videos) setRecommended(rec);
//       } catch (err) {
//         console.error("Home initial load failed", err);
//       }
//     })();
//     return () => (mounted = false);
//   }, [available, fetchTrendingVideos, fetchRecommendedVideos]);

//   // Keep recommended capped to RECOMMENDED_LIMIT
//   useEffect(() => {
//     if (!recommended.videos) return;
//     if (recommended.videos.length > RECOMMENDED_LIMIT) {
//       setRecommended((p) => ({ ...p, videos: p.videos.slice(0, RECOMMENDED_LIMIT) }));
//     }
//   }, [recommended.videos]);

//   const isLoading = (backendLoading && !trending.videos.length) || (videoLoading && !recommended.videos.length);
//   if (isLoading) return <HomeSkeleton isDark={isDark} gridBackground={gridBackground} />;
//   if (!available) return <BackendError onRetry={handleRetry} retrying={retrying} />;

//   return (
//     <main
//       className="min-h-screen transition-colors duration-200"
//       style={{
//         backgroundColor: isDark ? "#0B0B0B" : "#F5F5F5",
//       }}
//     >
//       <div
//         className="mx-auto"
//         style={{
//           maxWidth: 1120,
//           paddingLeft: GUTTER,
//           paddingRight: GUTTER,
//           paddingTop: 32,
//           paddingBottom: 48,
//           // grid overlay — uses inline background, sized by GRID_STEP
//           backgroundImage: gridBackground,
//           backgroundSize: `${GRID_STEP}px ${GRID_STEP}px, ${GRID_STEP}px ${GRID_STEP}px`,
//           backgroundPosition: `0 0, ${GRID_STEP / 2}px ${GRID_STEP / 2}px`,
//         }}
//       >
//         {/* HERO + RIGHT RAIL */}
//         <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//           {/* HERO (left large) */}
//           {hero && (
//             <article
//               role="link"
//               tabIndex={0}
//               aria-label={hero.title}
//               onClick={() => navigate(`/watch/${hero._id}`)}
//               className="lg:col-span-2 relative rounded-xl overflow-hidden transform-gpu transition-transform"
//               style={{
//                 minHeight: 260,
//                 borderRadius: 12,
//                 boxShadow: isDark ? "0 10px 28px rgba(0,0,0,0.6)" : "0 10px 30px rgba(0,0,0,0.06)",
//                 cursor: "pointer",
//               }}
//               onMouseEnter={(e) => {
//                 if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
//                 e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
//               }}
//               onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
//             >
//               <img
//                 src={hero.thumbnail}
//                 alt={hero.title}
//                 loading="lazy"
//                 className="absolute inset-0 w-full h-full object-cover"
//                 style={{ display: "block" }}
//               />
//               <div
//                 className="absolute inset-0"
//                 style={{
//                   background:
//                     "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0) 70%)",
//                 }}
//               />
//               <div className="relative h-full flex flex-col justify-end p-6">
//                 <h2
//                   className="leading-tight"
//                   style={{
//                     fontSize: 28,
//                     fontWeight: 700,
//                     color: isDark ? "#EFEFEF" : "#0A0A0A",
//                     textShadow: "0 8px 22px rgba(0,0,0,0.6)",
//                   }}
//                 >
//                   {hero.title}
//                 </h2>
//                 <p style={{ marginTop: 8, color: isDark ? "#A6A6A6" : "#DADADA", fontSize: 14 }}>
//                   {hero.description || "No description"}
//                 </p>
//               </div>
//             </article>
//           )}

//           {/* RIGHT RAIL */}
//           <aside className="space-y-6">
//             {/* Top Trending */}
//             <Card
//               className="rounded-xl"
//               style={{
//                 borderRadius: 12,
//                 backgroundColor: isDark ? "#111111" : "#FFFFFF",
//                 border: `1px solid ${isDark ? "#1E1E1E" : "#E6E6E6"}`,
//                 boxShadow: isDark ? "0 8px 22px rgba(0,0,0,0.6)" : "0 8px 24px rgba(0,0,0,0.06)",
//               }}
//             >
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-3" style={{ color: isDark ? "#EFEFEF" : "#0A0A0A", fontWeight: 600 }}>
//                   <Flame className="h-5 w-5" /> Top Trending
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {topTrending.map((v) => (
//                   <div
//                     key={v._id}
//                     className="flex gap-4 items-center"
//                     role="button"
//                     tabIndex={0}
//                     onClick={() => navigate(`/watch/${v._id}`)}
//                     onKeyDown={(e) => e.key === "Enter" && navigate(`/watch/${v._id}`)}
//                     style={{ cursor: "pointer" }}
//                   >
//                     <img src={v.thumbnail} alt={v.title} loading="lazy" style={{ width: 112, height: 64, borderRadius: 8, objectFit: "cover" }} />
//                     <div style={{ minWidth: 0 }}>
//                       <div style={{ fontSize: 14, fontWeight: 600, color: isDark ? "#EFEFEF" : "#0A0A0A" }}>{v.title}</div>
//                       <div style={{ fontSize: 12, color: isDark ? "#A6A6A6" : "#6B6B6B" }}>{v.owner?.username}</div>
//                     </div>
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>

//             {/* Trending Creators */}
//             <Card
//               className="rounded-xl"
//               style={{
//                 borderRadius: 12,
//                 backgroundColor: isDark ? "#111111" : "#FFFFFF",
//                 border: `1px solid ${isDark ? "#1E1E1E" : "#E6E6E6"}`,
//                 boxShadow: isDark ? "0 8px 22px rgba(0,0,0,0.6)" : "0 8px 24px rgba(0,0,0,0.06)",
//               }}
//             >
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-3" style={{ color: isDark ? "#EFEFEF" : "#0A0A0A", fontWeight: 600 }}>
//                   <Users className="h-5 w-5" /> Trending Creators
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//                   {Array.from({ length: 3 }).map((_, i) => (
//                     <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                       <div style={{ width: 40, height: 40, borderRadius: 999, backgroundColor: isDark ? "#1E1E1E" : "#E6E6E6" }} />
//                       <div>
//                         <div style={{ fontSize: 14, color: isDark ? "#EFEFEF" : "#0A0A0A" }}>{`Creator ${i + 1}`}</div>
//                         <div style={{ fontSize: 12, color: isDark ? "#A6A6A6" : "#6B6B6B" }}>{`@creator${i + 1}`}</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Trending Tweets */}
//             <Card
//               className="rounded-xl"
//               style={{
//                 borderRadius: 12,
//                 backgroundColor: isDark ? "#111111" : "#FFFFFF",
//                 border: `1px solid ${isDark ? "#1E1E1E" : "#E6E6E6"}`,
//                 boxShadow: isDark ? "0 8px 22px rgba(0,0,0,0.6)" : "0 8px 24px rgba(0,0,0,0.06)",
//               }}
//             >
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-3" style={{ color: isDark ? "#EFEFEF" : "#0A0A0A", fontWeight: 600 }}>
//                   <Twitter className="h-5 w-5" /> Trending Tweets (coming soon)
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div style={{ color: isDark ? "#A6A6A6" : "#6B6B6B", fontSize: 13 }}>Short social previews will show here.</div>
//               </CardContent>
//             </Card>
//           </aside>
//         </section>

//         {/* Recommended (2 rows x 4 = 8) */}
//         <section style={{ marginTop: 24 }}>
//           <Card
//             className="rounded-xl"
//             style={{
//               borderRadius: 12,
//               backgroundColor: isDark ? "#111111" : "#FFFFFF",
//               border: `1px solid ${isDark ? "#1E1E1E" : "#E6E6E6"}`,
//               boxShadow: isDark ? "0 8px 22px rgba(0,0,0,0.6)" : "0 8px 24px rgba(0,0,0,0.06)",
//             }}
//           >
//             <CardHeader style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 16, paddingBottom: 16 }}>
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                 <CardTitle style={{ fontSize: 20, fontWeight: 700, color: isDark ? "#EFEFEF" : "#0A0A0A" }}>
//                   Recommended For You
//                 </CardTitle>
//                 <Button variant="ghost" className="!px-3">
//                   <span style={{ color: isDark ? "#A6A6A6" : "#6B6B6B" }}>View All</span>
//                   <ArrowRight className="ml-2" />
//                 </Button>
//               </div>
//             </CardHeader>

//             <CardContent style={{ paddingLeft: 24, paddingRight: 24, paddingBottom: 20 }}>
//               <div
//                 className="grid gap-5"
//                 style={{
//                   gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
//                 }}
//               >
//                 {/* responsive columns via inline style with media queries fallback */
//                   /* We'll rely on Tailwind classes for responsive breakpoints: */
//                 }
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
//                   {recommended.videos.slice(0, RECOMMENDED_LIMIT).map((v) => (
//                     <div
//                       key={v._id}
//                       style={{
//                         transition: "transform .18s cubic-bezier(.2,.9,.2,1)",
//                       }}
//                       onMouseEnter={(e) => {
//                         if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
//                         e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
//                       }}
//                       onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
//                     >
//                       <VideoCard video={v} />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </section>

//         {/* Subscriptions */}
//         <section style={{ marginTop: 24 }}>
//           <Card
//             className="rounded-xl"
//             style={{
//               borderRadius: 12,
//               backgroundColor: isDark ? "#111111" : "#FFFFFF",
//               border: `1px solid ${isDark ? "#1E1E1E" : "#E6E6E6"}`,
//               boxShadow: isDark ? "0 8px 22px rgba(0,0,0,0.6)" : "0 8px 24px rgba(0,0,0,0.06)",
//             }}
//           >
//             <CardHeader style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 16, paddingBottom: 16 }}>
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                 <CardTitle style={{ fontSize: 20, fontWeight: 700, color: isDark ? "#EFEFEF" : "#0A0A0A" }}>
//                   From Your Subscriptions
//                 </CardTitle>
//                 <Button variant="ghost" className="!px-3">
//                   <span style={{ color: isDark ? "#A6A6A6" : "#6B6B6B" }}>View All</span>
//                   <ArrowRight className="ml-2" />
//                 </Button>
//               </div>
//             </CardHeader>

//             <CardContent style={{ paddingLeft: 24, paddingRight: 24, paddingBottom: 20 }}>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
//                 {(subscriptions.videos.length ? subscriptions.videos : recommended.videos.slice(0, 4)).map((v) => (
//                   <div key={v._id} style={{ transition: "transform .18s cubic-bezier(.2,.9,.2,1)" }}>
//                     <VideoCard video={v} />
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </section>

//         {/* future notes */}
//         <section style={{ marginTop: 28, color: isDark ? "#A6A6A6" : "#6B6B6B", fontSize: 13 }}>
//           <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
//             <div>More sections will appear here (playlists, live channels, curated lists).</div>
//             <div style={{ fontSize: 12 }}>Designed for desktop (1280px+). Responsive to smaller screens.</div>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }

// /* Skeleton variant when loading */
// function HomeSkeleton({ isDark = false, gridBackground = "" }) {
//   return (
//     <main style={{ backgroundColor: isDark ? "#0B0B0B" : "#F5F5F5" }}>
//       <div
//         className="mx-auto"
//         style={{
//           maxWidth: 1120,
//           paddingLeft: GUTTER,
//           paddingRight: GUTTER,
//           paddingTop: 32,
//           paddingBottom: 48,
//           backgroundImage: gridBackground,
//           backgroundSize: `${GRID_STEP}px ${GRID_STEP}px, ${GRID_STEP}px ${GRID_STEP}px`,
//           backgroundPosition: `0 0, ${GRID_STEP / 2}px ${GRID_STEP / 2}px`,
//         }}
//       >
//         <div className="space-y-8">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-2">
//               <div style={{ borderRadius: 12, minHeight: 260, backgroundColor: isDark ? "#171717" : "#EDEDED" }} />
//             </div>
//             <div className="space-y-4">
//               <div style={{ height: 32, width: 200, backgroundColor: isDark ? "#171717" : "#EDEDED", borderRadius: 8 }} />
//               {Array.from({ length: 4 }).map((_, i) => (
//                 <div key={i} className="flex gap-4 items-center">
//                   <div style={{ width: 112, height: 64, backgroundColor: isDark ? "#171717" : "#EDEDED", borderRadius: 8 }} />
//                   <div style={{ flex: 1 }}>
//                     <div style={{ height: 12, width: "60%", backgroundColor: isDark ? "#171717" : "#EDEDED", borderRadius: 6, marginBottom: 8 }} />
//                     <div style={{ height: 10, width: "40%", backgroundColor: isDark ? "#171717" : "#EDEDED", borderRadius: 6 }} />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div style={{ borderRadius: 12, backgroundColor: isDark ? "#111111" : "#FFFFFF", padding: 20 }}>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {Array.from({ length: 4 }).map((_, i) => (
//                 <div key={i}>
//                   <div style={{ height: 140, borderRadius: 10, backgroundColor: isDark ? "#171717" : "#EDEDED" }} />
//                   <div style={{ height: 12, width: "60%", marginTop: 8, backgroundColor: isDark ? "#171717" : "#EDEDED", borderRadius: 6 }} />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }


// --------------------------------------------------


// // src/pages/Home.jsx
// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { useVideo } from "../contexts/index.js";
// import { VideoCard } from "../components/index.js";
// import { useBackendCheck } from "../hooks/useBackendCheck.js";
// import { BackendError } from "../components/BackendError.jsx";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Flame, Rss, Users, Twitter, ArrowRight } from "lucide-react";

// /**
//  * Home.jsx — corrected:
//  *  - All hooks are declared before any conditional return (fixes "Rendered more hooks..." error).
//  *  - Draws guide lines aligned to component borders (hero, rail, recommended, subs).
//  *  - Grayscale-only styling via inline styles + Tailwind.
//  */

// /* layout constants */
// const GUTTER = 32;
// const RECOMMENDED_LIMIT = 8;

// export default function Home() {
//   const navigate = useNavigate();

//   // --- Data hooks (always declared) ---
//   const { loading: videoLoading, fetchTrendingVideos, fetchRecommendedVideos } = useVideo();
//   const { available, loading: backendLoading, retry, retrying } = useBackendCheck();

//   // --- UI state hooks ---
//   const [trending, setTrending] = useState({ videos: [] });
//   const [recommended, setRecommended] = useState({ videos: [] });
//   const [subscriptions, setSubscriptions] = useState({ videos: [] });

//   // refs for guide calculations
//   const containerRef = useRef(null);
//   const heroRef = useRef(null);
//   const railRef = useRef(null);
//   const recommendedRef = useRef(null);
//   const subsRef = useRef(null);

//   // guides state
//   const [guides, setGuides] = useState({ vertical: [], horizontal: [], bounds: null });

//   // theme detection (reads <html>.classList)
//   const [isDark, setIsDark] = useState(
//     typeof document !== "undefined" ? document.documentElement.classList.contains("dark") : false
//   );

//   // ---------- ALL hooks declared above this line ----------
//   // Important: hooks MUST NOT be declared conditionally or after an early return.

//   // Compute guides from element rects; produce unique x positions (left/right) and y positions (top/bottom).
//   // Lines are drawn relative to the container's top-left.
//   const computeGuides = useCallback(() => {
//     const container = containerRef.current;
//     if (!container) return;
//     const containerRect = container.getBoundingClientRect();

//     const nodes = [
//       { ref: heroRef.current, id: "hero" },
//       { ref: railRef.current, id: "rail" },
//       { ref: recommendedRef.current, id: "recommended" },
//       { ref: subsRef.current, id: "subs" },
//     ];

//     const rects = nodes
//       .map((item) => {
//         const el = item.ref;
//         if (!el) return null;
//         const r = el.getBoundingClientRect();
//         return {
//           id: item.id,
//           left: Math.round(r.left - containerRect.left),
//           right: Math.round(r.right - containerRect.left),
//           top: Math.round(r.top - containerRect.top),
//           bottom: Math.round(r.bottom - containerRect.top),
//           width: Math.round(r.width),
//           height: Math.round(r.height),
//         };
//       })
//       .filter(Boolean);

//     const vSet = new Set();
//     const hSet = new Set();
//     rects.forEach((r) => {
//       vSet.add(r.left);
//       vSet.add(r.right);
//       hSet.add(r.top);
//       hSet.add(r.bottom);
//     });

//     // container edges
//     vSet.add(0);
//     vSet.add(Math.round(containerRect.width));
//     hSet.add(0);
//     hSet.add(Math.round(containerRect.height));

//     const vertical = Array.from(vSet).sort((a, b) => a - b);
//     const horizontal = Array.from(hSet).sort((a, b) => a - b);

//     setGuides({ vertical, horizontal, bounds: { width: Math.round(containerRect.width), height: Math.round(containerRect.height) } });
//   }, []);

//   // Theme mutation observer
//   useEffect(() => {
//     if (typeof document === "undefined") return;
//     const el = document.documentElement;
//     const mo = new MutationObserver(() => setIsDark(el.classList.contains("dark")));
//     mo.observe(el, { attributes: true, attributeFilter: ["class"] });
//     return () => mo.disconnect();
//   }, []);

//   // Data fetch effect
//   useEffect(() => {
//     if (!available) return;
//     let alive = true;
//     (async () => {
//       try {
//         const [t, r] = await Promise.all([fetchTrendingVideos(10), fetchRecommendedVideos(1, RECOMMENDED_LIMIT)]);
//         if (!alive) return;
//         if (t?.videos) setTrending(t);
//         if (r?.videos) setRecommended((prev) => ({ ...r, videos: r.videos.slice(0, RECOMMENDED_LIMIT) }));
//       } catch (err) {
//         console.error("Home load failed", err);
//       }
//     })();
//     return () => {
//       alive = false;
//     };
//   }, [available, fetchTrendingVideos, fetchRecommendedVideos]);

//   // Recompute guides when layout/data changes
//   useEffect(() => {
//     // compute after a tick to ensure DOM painted
//     const id = requestAnimationFrame(() => computeGuides());
//     const onResize = () => computeGuides();
//     const onScroll = () => computeGuides();

//     window.addEventListener("resize", onResize, { passive: true });
//     window.addEventListener("scroll", onScroll, { passive: true });

//     // ResizeObserver on container
//     let ro;
//     if (containerRef.current && typeof ResizeObserver !== "undefined") {
//       ro = new ResizeObserver(() => computeGuides());
//       ro.observe(containerRef.current);
//     }

//     return () => {
//       cancelAnimationFrame(id);
//       window.removeEventListener("resize", onResize);
//       window.removeEventListener("scroll", onScroll);
//       if (ro) ro.disconnect();
//     };
//     // recompute when relevant pieces change
//   }, [computeGuides, trending.videos.length, recommended.videos.length, subscriptions.videos.length]);

//   // Keep recommended capped
//   useEffect(() => {
//     if (!recommended.videos) return;
//     if (recommended.videos.length > RECOMMENDED_LIMIT) {
//       setRecommended((p) => ({ ...p, videos: p.videos.slice(0, RECOMMENDED_LIMIT) }));
//     }
//   }, [recommended.videos]);

//   // handleRetry stable callback
//   const handleRetry = useCallback(() => retry(), [retry]);

//   // --- Early returns after all hooks are declared ---
//   if ((backendLoading && !trending.videos.length) || (videoLoading && !recommended.videos.length)) {
//     return <LoadingSkeleton isDark={isDark} />;
//   }
//   if (!available) return <BackendError onRetry={handleRetry} retrying={retrying} />;

//   // derived
//   const hero = trending.videos?.[0];
//   const topTrending = trending.videos?.slice(1, 5) ?? [];

//   /* guide stroke color */
//   const stroke = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";
//   const strokeDash = "6 6";

//   // ---- Render ----
//   return (
//     <main className="min-h-screen" style={{ backgroundColor: isDark ? "#0B0B0B" : "#F5F5F5" }}>
//       <div
//         ref={containerRef}
//         style={{
//           maxWidth: 1120,
//           marginLeft: "auto",
//           marginRight: "auto",
//           paddingLeft: GUTTER,
//           paddingRight: GUTTER,
//           paddingTop: 32,
//           paddingBottom: 48,
//           position: "relative",
//         }}
//       >
//         {/* SVG overlay */}
//         {guides.bounds && (
//           <svg
//             width={guides.bounds.width}
//             height={guides.bounds.height}
//             style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", zIndex: 20, overflow: "visible" }}
//           >
//             {guides.vertical.map((x, i) => (
//               <line key={`v-${i}`} x1={x} y1={0} x2={x} y2={guides.bounds.height} stroke={stroke} strokeWidth={1} strokeDasharray={strokeDash} opacity={0.9} />
//             ))}
//             {guides.horizontal.map((y, i) => (
//               <line key={`h-${i}`} x1={0} y1={y} x2={guides.bounds.width} y2={y} stroke={stroke} strokeWidth={1} strokeDasharray={strokeDash} opacity={0.9} />
//             ))}
//             {guides.vertical.map((x) => guides.horizontal.map((y) => <circle key={`c-${x}-${y}`} cx={x} cy={y} r={1.1} fill={stroke} opacity={0.85} />))}
//           </svg>
//         )}

//         {/* page content */}
//         <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//           {/* HERO */}
//           {hero && (
//             <article
//               ref={heroRef}
//               onClick={() => navigate(`/watch/${hero._id}`)}
//               role="link"
//               tabIndex={0}
//               aria-label={hero.title}
//               className="lg:col-span-2 relative rounded-xl overflow-hidden"
//               style={{
//                 minHeight: 260,
//                 borderRadius: 12,
//                 boxShadow: isDark ? "0 10px 28px rgba(0,0,0,0.6)" : "0 10px 30px rgba(0,0,0,0.06)",
//                 cursor: "pointer",
//                 transform: "translateZ(0)",
//                 transition: "transform .18s cubic-bezier(.2,.9,.2,1)",
//               }}
//               onMouseEnter={(e) => {
//                 if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
//                 e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
//               }}
//               onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
//             >
//               <img src={hero.thumbnail} alt={hero.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
//               <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0) 70%)" }} />
//               <div className="relative h-full flex flex-col justify-end p-6">
//                 <h2 style={{ fontSize: 28, fontWeight: 700, color: isDark ? "#EFEFEF" : "#0A0A0A", textShadow: "0 8px 22px rgba(0,0,0,0.6)" }}>
//                   {hero.title}
//                 </h2>
//                 <p style={{ marginTop: 8, color: isDark ? "#A6A6A6" : "#DADADA", fontSize: 14 }}>{hero.description || "No description"}</p>
//               </div>
//             </article>
//           )}

//           {/* RIGHT RAIL */}
//           <aside ref={railRef} className="space-y-6">
//             <Card
//               className="rounded-xl"
//               style={{
//                 borderRadius: 12,
//                 backgroundColor: isDark ? "#111111" : "#FFFFFF",
//                 border: `1px solid ${isDark ? "#1E1E1E" : "#E6E6E6"}`,
//                 boxShadow: isDark ? "0 8px 22px rgba(0,0,0,0.6)" : "0 8px 24px rgba(0,0,0,0.06)",
//               }}
//             >
//               <CardHeader>
//                 <CardTitle style={{ color: isDark ? "#EFEFEF" : "#0A0A0A", fontWeight: 600 }} className="flex items-center gap-3">
//                   <Flame className="h-5 w-5" /> Top Trending
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {trending.videos.slice(1, 5).map((v) => (
//                   <div key={v._id} className="flex gap-4 items-center" onClick={() => navigate(`/watch/${v._id}`)} style={{ cursor: "pointer" }}>
//                     <img src={v.thumbnail} alt={v.title} loading="lazy" style={{ width: 112, height: 64, borderRadius: 8, objectFit: "cover" }} />
//                     <div style={{ minWidth: 0 }}>
//                       <div style={{ fontSize: 14, fontWeight: 600, color: isDark ? "#EFEFEF" : "#0A0A0A" }}>{v.title}</div>
//                       <div style={{ fontSize: 12, color: isDark ? "#A6A6A6" : "#6B6B6B" }}>{v.owner?.username}</div>
//                     </div>
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>

//             <Card
//               className="rounded-xl"
//               style={{
//                 borderRadius: 12,
//                 backgroundColor: isDark ? "#111111" : "#FFFFFF",
//                 border: `1px solid ${isDark ? "#1E1E1E" : "#E6E6E6"}`,
//                 boxShadow: isDark ? "0 8px 22px rgba(0,0,0,0.6)" : "0 8px 24px rgba(0,0,0,0.06)",
//               }}
//             >
//               <CardHeader>
//                 <CardTitle style={{ color: isDark ? "#EFEFEF" : "#0A0A0A", fontWeight: 600 }} className="flex items-center gap-3">
//                   <Users className="h-5 w-5" /> Trending Creators
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//                   {Array.from({ length: 3 }).map((_, i) => (
//                     <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                       <div style={{ width: 40, height: 40, borderRadius: 999, backgroundColor: isDark ? "#1E1E1E" : "#E6E6E6" }} />
//                       <div>
//                         <div style={{ fontSize: 14, color: isDark ? "#EFEFEF" : "#0A0A0A" }}>{`Creator ${i + 1}`}</div>
//                         <div style={{ fontSize: 12, color: isDark ? "#A6A6A6" : "#6B6B6B" }}>{`@creator${i + 1}`}</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>

//             <Card
//               className="rounded-xl"
//               style={{
//                 borderRadius: 12,
//                 backgroundColor: isDark ? "#111111" : "#FFFFFF",
//                 border: `1px solid ${isDark ? "#1E1E1E" : "#E6E6E6"}`,
//                 boxShadow: isDark ? "0 8px 22px rgba(0,0,0,0.6)" : "0 8px 24px rgba(0,0,0,0.06)",
//               }}
//             >
//               <CardHeader>
//                 <CardTitle style={{ color: isDark ? "#EFEFEF" : "#0A0A0A", fontWeight: 600 }} className="flex items-center gap-3">
//                   <Twitter className="h-5 w-5" /> Trending Tweets
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div style={{ color: isDark ? "#A6A6A6" : "#6B6B6B", fontSize: 13 }}>Short social previews (coming soon).</div>
//               </CardContent>
//             </Card>
//           </aside>
//         </section>

//         {/* Recommended */}
//         <section style={{ marginTop: 24 }}>
//           <Card
//             ref={recommendedRef}
//             className="rounded-xl"
//             style={{
//               borderRadius: 12,
//               backgroundColor: isDark ? "#111111" : "#FFFFFF",
//               border: `1px solid ${isDark ? "#1E1E1E" : "#E6E6E6"}`,
//               boxShadow: isDark ? "0 8px 22px rgba(0,0,0,0.6)" : "0 8px 24px rgba(0,0,0,0.06)",
//             }}
//           >
//             <CardHeader style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 16, paddingBottom: 16 }}>
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                 <CardTitle style={{ fontSize: 20, fontWeight: 700, color: isDark ? "#EFEFEF" : "#0A0A0A" }}>Recommended For You</CardTitle>
//                 <Button variant="ghost" className="!px-3">
//                   <span style={{ color: isDark ? "#A6A6A6" : "#6B6B6B" }}>View All</span>
//                   <ArrowRight className="ml-2" />
//                 </Button>
//               </div>
//             </CardHeader>

//             <CardContent style={{ paddingLeft: 24, paddingRight: 24, paddingBottom: 20 }}>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
//                 {recommended.videos.slice(0, RECOMMENDED_LIMIT).map((v) => (
//                   <div key={v._id} style={{ transition: "transform .18s cubic-bezier(.2,.9,.2,1)" }}>
//                     <VideoCard video={v} />
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </section>

//         {/* Subscriptions */}
//         <section style={{ marginTop: 24 }}>
//           <Card
//             ref={subsRef}
//             className="rounded-xl"
//             style={{
//               borderRadius: 12,
//               backgroundColor: isDark ? "#111111" : "#FFFFFF",
//               border: `1px solid ${isDark ? "#1E1E1E" : "#E6E6E6"}`,
//               boxShadow: isDark ? "0 8px 22px rgba(0,0,0,0.6)" : "0 8px 24px rgba(0,0,0,0.06)",
//             }}
//           >
//             <CardHeader style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 16, paddingBottom: 16 }}>
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                 <CardTitle style={{ fontSize: 20, fontWeight: 700, color: isDark ? "#EFEFEF" : "#0A0A0A" }}>
//                   <Rss className="h-4 w-4 inline-block" /> From Your Subscriptions
//                 </CardTitle>
//                 <Button variant="ghost" className="!px-3">
//                   <span style={{ color: isDark ? "#A6A6A6" : "#6B6B6B" }}>View All</span>
//                   <ArrowRight className="ml-2" />
//                 </Button>
//               </div>
//             </CardHeader>

//             <CardContent style={{ paddingLeft: 24, paddingRight: 24, paddingBottom: 20 }}>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
//                 {(subscriptions.videos.length ? subscriptions.videos : recommended.videos.slice(0, 4)).map((v) => (
//                   <div key={v._id} style={{ transition: "transform .18s cubic-bezier(.2,.9,.2,1)" }}>
//                     <VideoCard video={v} />
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </section>

//         {/* footer note */}
//         <section style={{ marginTop: 28, color: isDark ? "#A6A6A6" : "#6B6B6B", fontSize: 13 }}>
//           <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
//             <div>More sections (playlists, live, channels) will appear here.</div>
//             <div style={{ fontSize: 12 }}>Designed for desktop (1280px+), responsive to mobile.</div>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }

// /* Loading skeleton */
// function LoadingSkeleton({ isDark = false }) {
//   const bg = isDark ? "#0B0B0B" : "#F5F5F5";
//   return (
//     <main style={{ backgroundColor: bg }}>
//       <div style={{ maxWidth: 1120, margin: "0 auto", paddingLeft: GUTTER, paddingRight: GUTTER, paddingTop: 32, paddingBottom: 48 }}>
//         <div className="space-y-8">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-2">
//               <div style={{ borderRadius: 12, minHeight: 260, backgroundColor: isDark ? "#171717" : "#EDEDED" }} />
//             </div>
//             <div className="space-y-4">
//               <div style={{ height: 32, width: 200, backgroundColor: isDark ? "#171717" : "#EDEDED", borderRadius: 8 }} />
//               {Array.from({ length: 4 }).map((_, i) => (
//                 <div key={i} className="flex gap-4 items-center">
//                   <div style={{ width: 112, height: 64, backgroundColor: isDark ? "#171717" : "#EDEDED", borderRadius: 8 }} />
//                   <div style={{ flex: 1 }}>
//                     <div style={{ height: 12, width: "60%", backgroundColor: isDark ? "#171717" : "#EDEDED", borderRadius: 6, marginBottom: 8 }} />
//                     <div style={{ height: 10, width: "40%", backgroundColor: isDark ? "#171717" : "#EDEDED", borderRadius: 6 }} />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div style={{ borderRadius: 12, backgroundColor: isDark ? "#111111" : "#FFFFFF", padding: 20 }}>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {Array.from({ length: 4 }).map((_, i) => (
//                 <div key={i}>
//                   <div style={{ height: 140, borderRadius: 10, backgroundColor: isDark ? "#171717" : "#EDEDED" }} />
//                   <div style={{ height: 12, width: "60%", marginTop: 8, backgroundColor: isDark ? "#171717" : "#EDEDED", borderRadius: 6 }} />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }


// ----------
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useVideo } from '../contexts/index.js';
import { VideoCard } from '../components/index.js';
import SimpleVideoCard from '../components/video/SimpleVideoCard.jsx';
import { useBackendCheck } from '../hooks/useBackendCheck.js';
import { BackendError } from '../components/BackendError.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, ArrowRight, Flame, Rss, Users, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '../contexts/index.js';
import { toast } from 'sonner';

function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loading: videoLoading, fetchTrendingVideos, fetchRecommendedVideos } = useVideo();
  const { available, loading: backendLoading, retry, retrying } = useBackendCheck();
  const { fetchCurrentUser } = useAuth();

  // Handle OAuth callback
  useEffect(() => {
    const authStatus = searchParams.get('auth');
    const tokensParam = searchParams.get('tokens');
    
    // Prevent duplicate toasts in React StrictMode
    const hasShownToast = sessionStorage.getItem('oauth_toast_shown');
    
    if (authStatus === 'success' && tokensParam && !hasShownToast) {
      sessionStorage.setItem('oauth_toast_shown', 'true');
      try {
        // Parse tokens from URL
        const { accessToken, refreshToken } = JSON.parse(decodeURIComponent(tokensParam));
        
        // Store tokens in localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        // Fetch current user to update auth state
        fetchCurrentUser().then(() => {
          toast.success('Successfully signed in with Google!');
          // Clean up URL and clear flag
          sessionStorage.removeItem('oauth_toast_shown');
          navigate('/', { replace: true });
        }).catch(() => {
          toast.error('Failed to complete sign in. Please try again.');
          sessionStorage.removeItem('oauth_toast_shown');
          navigate('/login', { replace: true });
        });
      } catch (error) {
        console.error('Failed to parse OAuth tokens:', error);
        toast.error('Failed to complete sign in. Please try again.');
        sessionStorage.removeItem('oauth_toast_shown');
        navigate('/', { replace: true });
      }
    } else if (authStatus === 'failed' && !hasShownToast) {
      sessionStorage.setItem('oauth_toast_shown', 'true');
      toast.error('Google sign in failed. Please try again.');
      sessionStorage.removeItem('oauth_toast_shown');
      navigate('/', { replace: true });
    }
  }, [searchParams, fetchCurrentUser, navigate]);

  // Your state and logic are preserved
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

  // Data for the new top cards
  const topTrendingVideos = trendingVideos.videos.slice(0, 5);
  // Placeholder data for new sections - replace with your actual data fetching
  const topCreators = trendingVideos.videos.slice(0, 5).map(v => v.owner);
  const popularTweets = trendingVideos.videos.slice(5, 10);


  const handleRetry = useCallback(() => {
    retry();
  }, [retry]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [trendingData, recommendedData] = await Promise.all([
          fetchTrendingVideos(10),
          fetchRecommendedVideos(1, 8)
        ]);

        if (trendingData?.videos?.length > 0) {
          setTrendingVideos(trendingData);
        }
        if (recommendedData?.videos) {
          setRecommendedVideos(recommendedData);
        }

      } catch (error) {
        console.error("Failed to fetch initial page data:", error);
      }
    };
    if (available) {
      loadData();
    }
  }, [available, fetchTrendingVideos, fetchRecommendedVideos]);


  const isLoading = (backendLoading && !trendingVideos.videos.length) || (videoLoading && !recommendedVideos.videos.length);
  const hasMorePages = recommendedVideos.page < recommendedVideos.pages;

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMorePages) {
      setPage(p => p + 1);
    }
  }, [isLoadingMore, hasMorePages]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.5 }
    );
    const loadMoreTrigger = document.getElementById('load-more-trigger');
    if (loadMoreTrigger) observer.observe(loadMoreTrigger);
    return () => {
      if (loadMoreTrigger) observer.unobserve(loadMoreTrigger);
    };
  }, [loadMore]);

  if (isLoading) return <SkeletonHome />;
  if (!available) return <BackendError onRetry={handleRetry} retrying={retrying} />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

        {/* New Top Trending Section with 3 Separate Cards */}
        {trendingVideos.videos.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Top Trending Videos Card */}
            <Card className="flex flex-col h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Flame className="text-primary h-5 w-5" /> Top Videos</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {topTrendingVideos.map(video => (
                  <div key={video._id} className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate(`/watch/${video._id}`)}>
                    <img src={video.thumbnail?.url || video.thumbnail} alt={video.title} className="w-20 h-12 rounded-md object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">{video.title}</p>
                      <p className="text-xs text-muted-foreground">{video.owner?.username}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Creators Card (Placeholder) */}
            <Card className="flex flex-col h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="text-primary h-5 w-5" /> Top Creators</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {topCreators.map((creator, index) => (
                  <div key={creator?._id || index} className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate(`/user/c/${creator.username}`)}>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={creator.avatar} alt={creator.username} className="object-cover" />
                      <AvatarFallback>{creator.username?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors">{creator.username}</p>
                      <p className="text-xs text-muted-foreground">{index * 1234 + 567} Subscribers</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Popular Tweets Card (Placeholder) */}
            <Card className="flex flex-col h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><MessageCircle className="text-primary h-5 w-5" /> Popular Tweets</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {popularTweets.map(tweet => (
                  <div key={tweet._id} className="text-sm p-3 rounded-lg bg-muted/50 text-muted-foreground">
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={tweet.owner.avatar} alt={tweet.owner.username} className="object-cover" />
                        <AvatarFallback>{tweet.owner.username?.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-xs text-foreground">{tweet.owner.username}</span>
                    </div>
                    <p className="line-clamp-2">{tweet.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
        {/* Content sections with contrasting background */}
        <div className="space-y-12 rounded-lg bg-muted/50 p-4 md:p-6">
          {/* Recommended Videos Section (Limited to 2 rows) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Recommended For You</h2>
              <Button variant="ghost">View All <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {recommendedVideos.videos.map((video) => (
                <VideoCard
                  key={video._id}
                  video={video}
                />
              ))}
            </div>
          </div>

          {/* From Your Subscriptions Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2"><Rss className="text-primary" /> From Your Subscriptions</h2>
              <Button variant="ghost">View All <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {recommendedVideos.videos.slice(0, 4).map((video) => (
                <VideoCard
                  key={video._id}
                  video={{ ...video, title: "New Video from Subscription" }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Infinite Scroll Trigger */}
        {hasMorePages && (
          <div id="load-more-trigger" className="h-10 mt-8 flex justify-center items-center">
            {isLoadingMore && <Loader2 className="h-6 w-6 text-primary animate-spin" />}
          </div>
        )}

      </div>
    </div>
  );
}

// Skeleton loader for Home page, now using shadcn/ui components
function SkeletonHome() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card><CardHeader><Skeleton className="h-8 w-48" /></CardHeader><CardContent className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="flex items-center gap-4"><Skeleton className="w-24 h-14 rounded-md" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-3 w-1/2" /></div></div>)}</CardContent></Card>
          <Card><CardHeader><Skeleton className="h-8 w-48" /></CardHeader><CardContent className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="flex items-center gap-4"><Skeleton className="h-12 w-12 rounded-full" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/2" /></div></div>)}</CardContent></Card>
          <Card><CardHeader><Skeleton className="h-8 w-48" /></CardHeader><CardContent className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="p-3 rounded-lg bg-muted/50 space-y-2"><div className="flex items-center gap-2"><Skeleton className="h-6 w-6 rounded-full" /><Skeleton className="h-4 w-24" /></div><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" /></div>)}</CardContent></Card>
        </div>
        <div className="rounded-lg bg-muted/50 p-6 space-y-12">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-video w-full rounded-lg" />
                  <div className="flex items-start gap-3 pt-2">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
