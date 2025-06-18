// import React from 'react';
// import { useState } from 'react';
import PropTypes from 'prop-types';
import { useVideo } from "../../contexts";
import { useNavigate } from "react-router-dom";
import { twMerge } from 'tailwind-merge';

const VideoCard = ({ video, onClick, className }) => {
  const { timeAgo } = useVideo();
  const navigate = useNavigate();

  // Ensure thumbnail and avatar are null if empty strings
  const thumbnailSrc = video.thumbnail || null;
  const avatarSrc = video.owner.avatar || null;
  const initials = video.owner.username.charAt(0).toUpperCase();

  const inspectChannel = (e, channelName) => {
    e.stopPropagation();
    navigate(`/user/c/${channelName}`);
  };

  return (
    <div
      className={twMerge(
        "group cursor-pointer rounded-xl overflow-hidden bg-white dark:bg-gray-800/40 shadow-md hover:shadow-xl dark:shadow-gray-900/30 transition-all duration-300 hover:transition-transform",
        "hover:bg-gray-50 dark:hover:bg-gray-700/50",
        "max-w-[450px]",
        className
      )}
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-100 dark:bg-gray-800/80 overflow-hidden">
        {thumbnailSrc ? (
          <img
            src={thumbnailSrc}
            alt={video.title}
            loading="lazy"
            className="w-full h-full object-cover transform transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 dark:text-gray-500 text-sm">No Thumbnail</span>
          </div>
        )}

        {/* Duration Badge */}
        <div className="absolute z-50 bottom-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[12px] font-medium rounded-[5px]">
          {video.duration}
        </div>

        {/* Premium Badge - only shown if video has more than 10k views */}
        {parseInt(video.views) > 10 && (
          <div className="absolute top-2.5 left-2.5 px-1 py-0.5 bg-amber-500/90 backdrop-blur-sm text-white text-[10px] font-medium rounded-md">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-3.5">
        <div className="flex gap-3">
          {/* Channel Avatar */}
          <button
            className="flex-shrink-0 mt-0.5"
            onClick={(e) => inspectChannel(e, video.owner.username)}
          >
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={`${video.owner.username}'s channel`}
                className="w-9 h-9 rounded-full ring-2 ring-amber-500/20 shadow-md object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center ring-2 ring-amber-500/20 shadow-md">
                <span className="text-white text-[12px] font-semibold">{initials}</span>
              </div>
            )}
          </button>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-gray-900 dark:text-white text-sm font-semibold leading-snug line-clamp-2 mb-1 group-hover:text-amber-500 transition-colors">
              {video.title}
            </h3>
            <div className="flex flex-col text-[14px] font-roboto">
              <button
                onClick={(e) => inspectChannel(e, video.owner.username)}
                className="w-fit text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors line-clamp-1"
              >
                {video.owner.username}
              </button>
              <div className="flex items-center gap-1.5 mt-1 text-gray-500 dark:text-gray-400">
                <span className="font-medium">{video.views} views</span>
                <span className="text-gray-400 dark:text-gray-500">•</span>
                <span>{timeAgo(video.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

VideoCard.propTypes = {
  video: PropTypes.shape({
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string,
    duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    views: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    createdAt: PropTypes.string.isRequired,
    owner: PropTypes.shape({
      avatar: PropTypes.string,
      username: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default VideoCard;
