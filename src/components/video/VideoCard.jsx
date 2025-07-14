// import React from 'react';
// import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideo } from '../../contexts';
import { LikeButton } from '../index.js';
import PropTypes from 'prop-types';

function VideoCard({ video, onClick }) {
  const navigate = useNavigate();
  const { timeAgo } = useVideo();

  // Debug logging to see what like data we're getting
  console.log('VideoCard received video:', {
    id: video._id,
    title: video.title,
    isLiked: video.isLiked,
    likeCount: video.likeCount,
    owner: video.owner?.username
  });

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/watch/${video._id}`);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Thumbnail */}
      <div className="relative group cursor-pointer" onClick={handleClick}>
          <img
          src={video.thumbnail || '/default-thumbnail.jpg'}
            alt={video.title}
          className="w-full h-32 sm:h-40 object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
        />
        
        {/* Duration overlay */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
          {video.duration || '0:00'}
        </div>

        {/* Play button overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white/90 rounded-full p-2">
            <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="p-3">
        <div className="flex items-start gap-3">
          {/* Channel Avatar */}
          <div className="flex-shrink-0">
            <img
              src={video.owner?.avatar || '/default-avatar.jpg'}
              alt={`${video.owner?.username || 'Unknown'}'s avatar`}
              className="w-8 h-8 rounded-full object-cover"
              loading="lazy"
            />
              </div>

          {/* Video Details */}
          <div className="flex-1 min-w-0">
            <h3 
              className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1 cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              onClick={handleClick}
            >
              {video.title}
            </h3>
            
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
              <p className="cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors" onClick={() => navigate(`/user/c/${video.owner?.username}`)}>
                {video.owner?.username || 'Unknown Channel'}
              </p>
              <p>{video.views || 0} views • {timeAgo(video.createdAt)}</p>
            </div>
          </div>

          {/* Like Button */}
        </div>
      </div>
    </div>
  );
}

VideoCard.propTypes = {
  video: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string,
    duration: PropTypes.string,
    views: PropTypes.number,
    createdAt: PropTypes.string.isRequired,
    owner: PropTypes.shape({
      _id: PropTypes.string,
      username: PropTypes.string,
      avatar: PropTypes.string
    }),
    isLiked: PropTypes.bool,
    likeCount: PropTypes.number
  }).isRequired,
  onClick: PropTypes.func
};

export default VideoCard;
