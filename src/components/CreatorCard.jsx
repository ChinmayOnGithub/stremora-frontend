import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function CreatorCard({ creator }) {
  // Format subscriber count
  const formatSubscribers = (count) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count;
  };

  return (
    <div className="flex flex-col p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200">
      <Link to={`/creator/${creator._id}`} className="flex flex-col gap-3">
        {/* Avatar and Growth Badge */}
        <div className="relative">
          <img
            src={creator.avatar || '/default-avatar.png'}
            alt={creator.username}
            className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-amber-100 dark:border-gray-700"
          />
          {creator.growth && (
            <div className={`absolute bottom-0 right-4 flex items-center px-2 py-1 rounded-full text-xs ${creator.growth >= 0
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              }`}>
              {creator.growth >= 0 ? '↑' : '↓'} {Math.abs(creator.growth)}%
            </div>
          )}
        </div>

        {/* Creator Info */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {creator.username}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {formatSubscribers(creator.subscriberCount)} subscribers
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mt-3 text-center">
          <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
              {creator.videoCount}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Videos</p>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
              {creator.viewCount ? formatSubscribers(creator.viewCount) : '0'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Views</p>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
              {creator.avgRating?.toFixed(1) || 'N/A'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Rating</p>
          </div>
        </div>

        {/* Subscribe Button */}
        <button className="mt-4 w-full py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-colors duration-200">
          Subscribe
        </button>
      </Link>
    </div>
  );
}

CreatorCard.propTypes = {
  creator: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    username: PropTypes.string.isRequired,
    growth: PropTypes.number,
    subscriberCount: PropTypes.number.isRequired,
    videoCount: PropTypes.number.isRequired,
    viewCount: PropTypes.number,
    avgRating: PropTypes.number
  }).isRequired
};

export default CreatorCard;