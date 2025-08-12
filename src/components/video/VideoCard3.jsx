import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useVideo } from '../../contexts';
import PropTypes from 'prop-types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye } from 'lucide-react';
import { usePalette } from 'color-thief-react';

// Helper function to format large numbers (e.g., 1200 -> 1.2K)
const formatCompactNumber = (number) => {
  if (number === null || number === undefined) return '0';
  if (number < 1000) return number.toString();
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(number);
};

function VideoCard({ video, onClick }) {
  const navigate = useNavigate();
  const { timeAgo } = useVideo();

  // Use color-thief-react to get the dominant color from the thumbnail
  const { data: dominantColor } = usePalette(video.thumbnail, 1, 'hex', {
    crossOrigin: 'anonymous',
    quality: 10, // Lower quality for faster processing
  });

  const handleCardAction = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/watch/${video._id}`);
    }
  };

  const ownerInitial = video.owner?.username?.charAt(0).toUpperCase() || 'U';

  return (
    <div
      onClick={handleCardAction}
      className="w-full max-w-sm rounded-2xl text-white overflow-hidden shadow-lg font-sans transform transition-transform hover:-translate-y-1.5 duration-300 cursor-pointer"
      style={{ backgroundColor: dominantColor || '#1F1F1F' }} // Fallback color
    >
      {/* Card Thumbnail */}
      <div className="relative h-48 w-full">
        <img
          className="w-full h-full object-cover"
          src={video.thumbnail || '/default-thumbnail.jpg'}
          alt={`${video.title} thumbnail`}
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/222/FFF?text=Image+Not+Found'; }}
        />
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-xs px-3 py-1 rounded-full">
          {video.duration || '0:00'}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 bg-zinc-900/40">
        <h3 className="text-xl font-bold truncate">{video.title}</h3>

        {/* Owner Information */}
        <div className="flex items-center mt-2 text-gray-300">
          <Link
            to={`/user/c/${video.owner?.username || ''}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 group"
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src={video.owner?.avatar} alt={video.owner?.username} />
              <AvatarFallback>{ownerInitial}</AvatarFallback>
            </Avatar>
            <p className="text-sm font-semibold group-hover:text-amber-400 transition-colors">{video.owner?.username || 'Unknown'}</p>
          </Link>
        </div>

        <div className="flex items-end justify-between mt-4">
          {/* Views and Upload Date */}
          <div className="flex items-center">
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <Eye className="h-4 w-4" />
              <span>{formatCompactNumber(video.views)} views</span>
              <span>•</span>
              <span>{timeAgo(video.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  }).isRequired,
  onClick: PropTypes.func
};

export default React.memo(VideoCard);
