import React, { useEffect, version } from "react";
import { useVideo } from "../contexts";
import { useNavigate } from "react-router-dom";

const VideoCard = ({ video, onClick }) => {
  const { timeAgo } = useVideo();
  const navigate = useNavigate();

  // Ensure thumbnail and coverImage are null if they are empty strings
  const thumbnailSrc = video.thumbnail || null;
  const avatarSrc = video.owner.avatar || null;
  let initials = video.owner.username.charAt(0).toUpperCase();

  const inspectChannel = (channelName) => {
    navigate(`/user/c/${channelName}`);
  };

  return (
    <div
      className="card bg-gray-100 dark:bg-gray-900/90 shadow-sm dark:shadow-gray-800 hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      {/* Thumbnail Image */}
      <figure className="relative h-32 sm:h-40 md:h-46 lg:h-48 w-full overflow-hidden">
        {thumbnailSrc ? (
          <img
            src={`${thumbnailSrc}?q_auto=f_auto&w=300&h=200&c_fill&dpr=2`}
            alt={video.title}
            loading="lazy"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400">No Thumbnail</span>
          </div>
        )}
        <p className="absolute right-0 bottom-0 text-xs m-1.5 bg-white/70 dark:bg-black/70 text-gray-900 dark:text-white rounded-sm px-1 py-0.5">
          {`${video.duration}`}
        </p>
      </figure>

      {/* Video Info */}
      <div className="card-body w-full sm:w-auto h-auto m-0 p-1.5 pt-0 sm:p-2.5 flex flex-row items-start">
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt="Channel avatar"
            className="w-8 h-8 rounded-full mt-2 hover:bg-white object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full mt-2 bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              {initials}
            </span>
          </div>
        )}

        <div>
          <h2 className="card-title text-lg sm:text-md font-semibold m-0 p-0 text-gray-900 dark:text-white">
            {video.title}
          </h2>
          <div className="flex gap-0 m-0 justify-start">
            <p className="m-0 text-md text-gray-500 dark:text-gray-400 text-left">
              {video.views} Views ~ {timeAgo(video.createdAt)}
            </p>
          </div>
          <div className="flex w-fit gap-2 m-0 p-0">
            <p
              className="text-gray-500 font-semibold w-fit dark:text-gray-400 text-md sm:text-md m-0 p-0 truncate sm:whitespace-normal hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                inspectChannel(video.owner.username);
              }}
            >
              {video.owner.username}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;