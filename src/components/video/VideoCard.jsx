import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useVideo } from '../../contexts';
import PropTypes from 'prop-types';
import { BsFillCheckCircleFill } from "react-icons/bs";
import { abbreviateNumber } from "js-abbreviation-number";

const VideoLength = ({ time }) => {
  const duration = time || '0:00';
  return (
    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded-md font-mono z-20">
      {duration}
    </div>
  );
};

function VideoCard({ video, onClick }) {
  const navigate = useNavigate();
  const { timeAgo } = useVideo();

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

  // Get thumbnail URL with fallback logic
  const getThumbnailUrl = () => {
    // Priority 1: Custom thumbnail
    if (video?.thumbnail?.url && video.thumbnail.url.trim() && !video.thumbnail.url.includes('localhost')) {
      return video.thumbnail.url.split('?')[0];
    }

    // Priority 2: Generate from video public_id (Cloudinary)
    if (video?.videoFile?.public_id && video?.videoFile?.storage_provider === 'cloudinary') {
      const publicId = video.videoFile.public_id.split('?')[0];
      return `https://res.cloudinary.com/dmoyyrmxr/video/upload/c_fill,h_225,w_400/so_2/${publicId}.jpg`;
    }

    // Priority 3: Extract from Cloudinary video URL
    if (video?.videoFile?.url && video?.videoFile?.url.includes('cloudinary')) {
      try {
        const match = video.videoFile.url.match(/\/upload\/(?:v\d+\/)?(.+)\.(mp4|mov|avi|mkv|webm)$/i);
        if (match) {
          const publicId = match[1];
          return `https://res.cloudinary.com/dmoyyrmxr/video/upload/c_fill,h_225,w_400/so_2/${publicId}.jpg`;
        }
      } catch (error) {
        console.warn('Failed to extract from video URL:', error);
      }
    }

    // Priority 4: Old format (direct string)
    if (typeof video?.thumbnail === 'string' && video.thumbnail.trim() && !video.thumbnail.includes('localhost')) {
      return video.thumbnail.split('?')[0];
    }

    return '/default-thumbnail.jpg';
  };

  return (
    <div onClick={handleClick} className="flex flex-col mb-8 cursor-pointer group">
      {/* Fixed aspect ratio container - 16:9 */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800">
        {/* Loading placeholder */}
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 z-0">
          <div className="text-gray-400 dark:text-gray-600">
            <svg className="w-8 h-8 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <img
          src={getThumbnailUrl()}
          alt={video?.title || 'Video thumbnail'}
          className="relative z-10 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            if (!e.target.src.includes('default-thumbnail.jpg')) {
              console.error(`❌ Thumbnail failed for "${video?.title}":`, e.target.src);
              e.target.onerror = null;
              e.target.src = '/default-thumbnail.jpg';
            }
          }}
        />

        {video.duration && <VideoLength time={video?.duration} />}
      </div>

      <div className="flex text-white mt-3">
        <div className="flex items-start">
          <Link to={`/user/c/${video.owner?.username}`} className="shrink-0 channel-link">
            <div className="flex h-9 w-9 rounded-full overflow-hidden">
              <img
                src={video?.owner?.avatar || '/default-avatar.jpg'}
                alt="avatar"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = '/default-avatar.jpg'; }}
              />
            </div>
          </Link>
          <div className="flex flex-col ml-3 overflow-hidden">
            <span className="text-sm font-semibold line-clamp-2 text-black dark:text-white">
              {video?.title || "Untitled Video"}
            </span>
            <Link to={`/user/c/${video.owner?.username}`} className="channel-link">
              <span className="text-[12px] font-semibold text-black/70 dark:text-white/70 flex items-center">
                {video?.owner?.username || "Unknown Channel"}
                {video?.owner?.isVerified && (
                  <BsFillCheckCircleFill className="text-black/50 dark:text-white/50 text-[12px] ml-1" />
                )}
              </span>
            </Link>
            <div className="flex text-[12px] font-semibold text-black/70 dark:text-white/70 truncate overflow-hidden">
              <span>{`${abbreviateNumber(video?.views || 0, 2)} views`}</span>
              <span className="flex text-[24px] leading-none font-bold text-black/70 dark:text-white/70 relative top-[-10px] mx-1">
                .
              </span>
              <span className="truncate">{timeAgo(video?.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

VideoCard.propTypes = {
  video: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.shape({
      url: PropTypes.string,
      public_id: PropTypes.string,
    }),
    duration: PropTypes.string,
    views: PropTypes.number,
    createdAt: PropTypes.string.isRequired,
    owner: PropTypes.shape({
      _id: PropTypes.string,
      username: PropTypes.string,
      avatar: PropTypes.string,
      isVerified: PropTypes.bool,
    }),
  }).isRequired,
  onClick: PropTypes.func,
};

export default React.memo(VideoCard);
