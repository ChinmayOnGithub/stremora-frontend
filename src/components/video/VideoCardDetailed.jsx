import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaUserCircle, FaEye, FaClock, FaHeart, FaCalendarAlt } from 'react-icons/fa';

function VideoCardDetailed({ video }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/watch/${video._id}`);
  };

  return (
    <div className="flex bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer min-h-[112px] h-[112px]" onClick={handleClick}>
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-40 h-full">
        <img
          src={video.thumbnail || '/default-thumbnail.jpg'}
          alt={video.title}
          className="w-full h-full object-cover rounded-l-lg"
        />
      </div>
      {/* Details */}
      <div className="flex flex-col flex-1 py-2 px-4 min-w-0 justify-between">
        {/* Title at the top */}
        <div className="min-w-0">
          <div className="font-bold text-base text-gray-900 dark:text-white truncate mb-1">{video.title}</div>
          {/* Channel row */}
          <div className="flex items-center gap-2 mb-1">
            {video.owner?.avatar ? (
              <img
                src={video.owner.avatar}
                alt={video.owner.username}
                className="w-6 h-6 rounded-full object-cover border border-gray-300 dark:border-gray-600"
              />
            ) : (
              <FaUserCircle className="w-6 h-6 text-gray-400 dark:text-gray-600" />
            )}
            <span className="font-medium text-xs text-gray-800 dark:text-gray-200 truncate">{video.owner?.username || 'Unknown Channel'}</span>
          </div>
          {/* Description */}
          {video.description && (
            <div className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-1">
              {video.description}
            </div>
          )}
        </div>
        {/* Meta row at the bottom */}
        <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 mt-1">
          <span className="flex items-center gap-1 min-w-0"><FaEye /> {video.views || 0}</span>
          <span className="flex items-center gap-1 min-w-0"><FaCalendarAlt /> {new Date(video.createdAt).toLocaleDateString()}</span>
          <span className="flex items-center gap-1 min-w-0"><FaClock /> {video.duration || '0:00'}</span>
          <span className="flex items-center gap-1 min-w-0"><FaHeart /> {video.likesCount || 0}</span>
        </div>
      </div>
    </div>
  );
}

VideoCardDetailed.propTypes = {
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