import React from 'react';
import EnhancedVideoCard from '../video/EnhancedVideoCard';
import { Skeleton } from '@/components/ui/skeleton';

// Loading skeleton for video cards
const VideoCardSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-48 md:h-52 w-full rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex items-center space-x-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  </div>
);

// Enhanced video grid with better responsive layout
function VideoGrid({ videos, loading = false, error = null }) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Something went wrong
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          We couldn't load the videos right now. Please try refreshing the page.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <VideoCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">📹</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          No videos found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          There are no videos to display right now. Check back later for new content!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {videos.map((video) => (
        <EnhancedVideoCard key={video._id} video={video} />
      ))}
    </div>
  );
}

export default VideoGrid;