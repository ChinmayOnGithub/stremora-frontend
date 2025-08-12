import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useVideo } from '../../contexts';
import PropTypes from 'prop-types';
import { BsFillCheckCircleFill } from "react-icons/bs";
import { abbreviateNumber } from "js-abbreviation-number";

// This component correctly displays the video duration.
const VideoLength = ({ time }) => {
  // The duration from your backend is a string like "5:00". We can display it directly.
  // If it were in seconds, we would need to format it.
  const duration = time || '0:00';
  return (
    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded-md font-mono">
      {duration}
    </div>
  );
};

function VideoCard({ video, onClick }) {
  const navigate = useNavigate();
  const { timeAgo } = useVideo();

  const handleClick = (e) => {
    // This prevents the link from navigating when clicking on the owner's avatar/name
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

  return (
    <div onClick={handleClick} className="flex flex-col mb-8 cursor-pointer">
      <div className="relative h-48 md:h-52 rounded-2xl overflow-hidden">
        <img
          src={video?.thumbnail || '/default-thumbnail.jpg'}
          alt={video?.title || 'Video thumbnail'}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={(e) => { e.target.onerror = null; e.target.src = '/default-thumbnail.jpg'; }}
        />
        {video.duration && <VideoLength time={video?.duration} />}
      </div>
      <div className="flex text-white mt-3">
        <div className="flex items-start">
          <Link to={`/user/c/${video.owner?.username}`} className="flex-shrink-0 channel-link">
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
              <span className="text-[12px] font-semibold text-black/[0.7] dark:text-white/[0.7] flex items-center">
                {video?.owner?.username || "Unknown Channel"}
                {/* Placeholder for a verified badge if you add it later */}
                {video?.owner?.isVerified && (
                  <BsFillCheckCircleFill className="text-black/[0.5] dark:text-white/[0.5] text-[12px] ml-1" />
                )}
              </span>
            </Link>
            <div className="flex text-[12px] font-semibold text-black/[0.7] dark:text-white/[0.7] truncate overflow-hidden">
              <span>{`${abbreviateNumber(
                video?.views || 0,
                2
              )} views`}</span>
              <span className="flex text-[24px] leading-none font-bold text-black/[0.7] dark:text-white/[0.7] relative top-[-10px] mx-1">
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
    thumbnail: PropTypes.string,
    duration: PropTypes.string,
    views: PropTypes.number,
    createdAt: PropTypes.string.isRequired,
    owner: PropTypes.shape({
      _id: PropTypes.string,
      username: PropTypes.string,
      avatar: PropTypes.string,
      isVerified: PropTypes.bool, // Optional: for the checkmark badge
    }),
  }).isRequired,
  onClick: PropTypes.func,
};

export default React.memo(VideoCard);
