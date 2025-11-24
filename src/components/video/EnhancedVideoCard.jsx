import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useVideo } from '../../contexts';
import PropTypes from 'prop-types';
import { BsFillCheckCircleFill } from "react-icons/bs";
import { abbreviateNumber } from "js-abbreviation-number";
import { Play, Eye, Clock, User, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Enhanced video duration component
const VideoLength = ({ time }) => {
  const duration = time || '0:00';
  return (
    <Badge 
      variant="secondary" 
      className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md font-mono backdrop-blur-sm"
    >
      <Clock className="w-3 h-3 mr-1" />
      {duration}
    </Badge>
  );
};

// Enhanced video card with hover effects and better layout
function EnhancedVideoCard({ video, onClick }) {
  const navigate = useNavigate();
  const { timeAgo } = useVideo();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e) => {
    if (e.target.closest('.channel-link')) {
      e.preventDefault();
      navigate(`/user/c/${video.owner?.username}`);
      return;
    }
    if (onClick) {
      onClick();
    } else {
      navigate(`/watch/${video._id}`);
    }
  };

  const handleChannelClick = (e) => {
    e.stopPropagation();
    navigate(`/user/c/${video.owner?.username}`);
  };

  return (
    <div 
      onClick={handleClick} 
      className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail Container with Hover Effects */}
      <div className="relative h-48 md:h-52 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
        <img
          src={video?.thumbnail || '/default-thumbnail.jpg'}
          alt={video?.title || 'Video thumbnail'}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => { 
            e.target.onerror = null; 
            e.target.src = '/default-thumbnail.jpg'; 
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
        </div>
        
        {/* Duration Badge */}
        {video.duration && <VideoLength time={video?.duration} />}
        
        {/* Views Badge */}
        <Badge 
          variant="secondary" 
          className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm"
        >
          <Eye className="w-3 h-3 mr-1" />
          {abbreviateNumber(video?.views || 0)}
        </Badge>

        {/* Like Count (if available) */}
        {video.likeCount > 0 && (
          <Badge 
            variant="secondary" 
            className="absolute top-2 right-2 bg-red-500/80 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm"
          >
            <Heart className="w-3 h-3 mr-1" />
            {abbreviateNumber(video.likeCount)}
          </Badge>
        )}
      </div>

      {/* Video Info */}
      <div className="mt-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-sm md:text-base line-clamp-2 text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors duration-200">
          {video?.title || 'Untitled Video'}
        </h3>

        {/* Channel Info */}
        <div className="flex items-center space-x-3">
          <Avatar 
            className="w-8 h-8 cursor-pointer channel-link hover:ring-2 hover:ring-primary transition-all duration-200" 
            onClick={handleChannelClick}
          >
            <AvatarImage 
              src={video.owner?.avatar} 
              alt={video.owner?.username || 'Channel'} 
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1">
              <span 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary cursor-pointer channel-link transition-colors duration-200 truncate"
                onClick={handleChannelClick}
              >
                {video.owner?.username || 'Unknown Channel'}
              </span>
              {video.owner?.isVerified && (
                <BsFillCheckCircleFill className="text-blue-500 text-xs flex-shrink-0" />
              )}
            </div>
            
            {/* Video Stats */}
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-500 mt-1">
              <span>{abbreviateNumber(video?.views || 0)} views</span>
              <span>•</span>
              <span>{timeAgo(video?.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Description Preview */}
        {video.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {video.description}
          </p>
        )}
      </div>
    </div>
  );
}

EnhancedVideoCard.propTypes = {
  video: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    thumbnail: PropTypes.string,
    duration: PropTypes.string,
    views: PropTypes.number,
    likeCount: PropTypes.number,
    description: PropTypes.string,
    createdAt: PropTypes.string,
    owner: PropTypes.shape({
      username: PropTypes.string,
      avatar: PropTypes.string,
      isVerified: PropTypes.bool,
    }),
  }).isRequired,
  onClick: PropTypes.func,
};

export default EnhancedVideoCard;