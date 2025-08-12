import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Helper function to format large numbers (e.g., 125,908 -> 125.9K)
const formatCompactNumber = (number) => {
  if (number === null || number === undefined) return '0';
  if (number < 1000) return number.toString();
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1
  }).format(number);
};

function VideoCardDetailed({ video, index }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/watch/${video._id}`);
  };

  const timeAgo = video.createdAt ? formatDistanceToNow(new Date(video.createdAt), { addSuffix: true }) : 'N/A';
  const ownerInitial = video.owner?.username?.charAt(0).toUpperCase() || 'U';

  return (
    <div
      className="group flex items-center gap-4 sm:gap-6 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-muted"
      onClick={handleClick}
    >
      {/* Index Number */}
      {typeof index === 'number' && (
        <div className="text-2xl font-bold text-muted-foreground group-hover:text-amber-500 transition-colors">
          {index.toString().padStart(2, '0')}
        </div>
      )}

      {/* Thumbnail */}
      <div className="relative flex-shrink-0 w-32 sm:w-40 h-20 sm:h-24 rounded-lg overflow-hidden">
        <img
          src={video.thumbnail || '/default-thumbnail.jpg'}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full font-mono">
          {video.duration || '0:00'}
        </div>
      </div>

      {/* Details Section */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-base sm:text-lg text-foreground truncate" title={video.title}>
          {video.title || "Untitled Video"}
        </h3>

        {/* Meta Stats */}
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
          <span className="flex items-center gap-1.5" title={`${video.views || 0} views`}>
            <Eye size={14} /> {formatCompactNumber(video.views || 0)} views
          </span>
          <span className="flex items-center gap-1.5" title={`${video.likesCount || 0} likes`}>
            <Heart size={14} /> {formatCompactNumber(video.likesCount || 0)} likes
          </span>
        </div>

        {/* Channel Info */}
        <div className="flex items-center gap-2 mt-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={video.owner?.avatar} alt={video.owner?.username} />
            <AvatarFallback>{ownerInitial}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-xs text-muted-foreground truncate group-hover:text-primary transition-colors">
            {video.owner?.username || 'Unknown Channel'}
          </span>
          <span className="text-muted-foreground/50">•</span>
          <span className="text-xs text-muted-foreground/80">{timeAgo}</span>
        </div>
      </div>

      {/* Like Button on the right */}
      <div className="ml-auto pl-4">
        <button
          className="p-2 rounded-full hover:bg-muted-foreground/10 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            alert('Like button clicked!');
          }}
        >
          <Heart className="h-5 w-5 text-red-500" fill="currentColor" />
        </button>
      </div>
    </div>
  );
}

VideoCardDetailed.propTypes = {
  // Index is now optional to prevent crashes
  index: PropTypes.number,
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
    likesCount: PropTypes.number,
    description: PropTypes.string
  }).isRequired
};

export default VideoCardDetailed;
