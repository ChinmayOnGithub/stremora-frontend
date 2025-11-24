import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, 
  Share2, 
  Download, 
  Flag, 
  Eye, 
  Calendar,
  User,
  ThumbsUp,
  ThumbsDown,
  Bell,
  MoreHorizontal
} from 'lucide-react';
import { abbreviateNumber } from "js-abbreviation-number";
import { BsFillCheckCircleFill } from "react-icons/bs";

function VideoPlayerEnhanced({ video, onLike, onSubscribe, isLiked, isSubscribed }) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [likes, setLikes] = useState(video?.likeCount || 0);
  const [views, setViews] = useState(video?.views || 0);

  // Simulate view increment on component mount
  useEffect(() => {
    if (video?._id) {
      // In a real app, you'd call an API to increment views
      setViews(prev => prev + 1);
    }
  }, [video?._id]);

  const handleLike = () => {
    if (onLike) {
      onLike();
      setLikes(prev => isLiked ? prev - 1 : prev + 1);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateDescription = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (!video) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="bg-gray-200 dark:bg-gray-800 rounded-lg aspect-video animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      {/* Video Player */}
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
        <video
          src={video.videoFile?.url || video.videoFile}
          controls
          className="w-full h-full"
          poster={video.thumbnail?.url || video.thumbnail}
        >
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Video Title */}
      <div className="space-y-2">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
          {video.title}
        </h1>
        
        {/* Video Stats */}
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{abbreviateNumber(views)} views</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(video.createdAt)}</span>
          </div>
          {video.duration && (
            <Badge variant="outline" className="text-xs">
              {video.duration}
            </Badge>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant={isLiked ? "default" : "outline"}
            size="sm"
            onClick={handleLike}
            className="flex items-center space-x-2"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{abbreviateNumber(likes)}</span>
          </Button>
          
          <Button variant="outline" size="sm">
            <ThumbsDown className="w-4 h-4" />
          </Button>
          
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">Share</span>
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">Download</span>
          </Button>
        </div>

        <Button variant="outline" size="sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      <Separator />

      {/* Channel Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarImage 
                  src={video.owner?.avatar} 
                  alt={video.owner?.username || 'Channel'} 
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  <User className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {video.owner?.username || 'Unknown Channel'}
                  </h3>
                  {video.owner?.isVerified && (
                    <BsFillCheckCircleFill className="text-blue-500 text-sm" />
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {abbreviateNumber(video.owner?.subscribersCount || 0)} subscribers
                </p>
              </div>
            </div>

            <Button
              variant={isSubscribed ? "outline" : "default"}
              onClick={onSubscribe}
              className="flex items-center space-x-2"
            >
              <Bell className="w-4 h-4" />
              <span>{isSubscribed ? 'Subscribed' : 'Subscribe'}</span>
            </Button>
          </div>

          {/* Description */}
          {video.description && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {showFullDescription 
                    ? video.description 
                    : truncateDescription(video.description)
                  }
                </p>
                {video.description.length > 150 && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="p-0 h-auto text-blue-600 dark:text-blue-400"
                  >
                    {showFullDescription ? 'Show less' : 'Show more'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default VideoPlayerEnhanced;