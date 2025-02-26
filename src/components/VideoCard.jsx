import React from "react";
import { useVideo } from "../contexts";
import { useNavigate } from "react-router-dom";

const VideoCard = ({ video, onClick }) => {
  const { timeAgo } = useVideo();

  const navigate = useNavigate();

  const inspectChannel = (channelName) => {
    navigate(`/user/c/${channelName}`);
  };

  // hover: scale - [1.015]
  return (
    <div
      className="card bg-gray-100 dark:bg-gray-900/90 shadow-sm dark:shadow-gray-800 hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      {/* Thumbnail Image */}
      <figure className="relative h-32 sm:h-40 md:h-46 lg:h-48 w-full overflow-hidden">
        <img
          src={`${video.thumbnail}?q_auto=f_auto&w=300&h=200&c_fill&dpr=2`}
          alt={video.title}
          loading="lazy" // Load images faster
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover rounded-lg"
        />
        <p className="absolute right-0 bottom-0 text-xs m-1.5 bg-white/70 dark:bg-black/70 text-gray-900 dark:text-white rounded-sm px-1 py-0.5">
          {`${video.duration}`}
        </p>
      </figure>

      {/* Video Info */}
      <div className="card-body w-full sm:w-auto h-auto m-0 p-1.5 pt-0 sm:p-2.5 flex flex-row items-start">
        <img
          src={video.owner.avatar}
          alt="Channel avatar"
          className="w-8 h-8 rounded-full mt-2 hover:bg-white object-cover"
        />

        <div>
          <h2 className="card-title text-lg sm:text-md font-semibold m-0 p-0 text-gray-900 dark:text-white">
            {video.title}
          </h2>
          <div className="flex gap-0 m-0 justify-start">
            <p className="m-0 text-md text-gray-500 dark:text-gray-400 text-left">
              {video.views} Views | {timeAgo(video.createdAt)}
            </p>
          </div>
          <div className="flex gap-2 m-0 p-0">
            <p className="text-gray-500 dark:text-gray-400 text-md sm:text-md m-0 p-0 truncate sm:whitespace-normal hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                inspectChannel(video.owner.username)
              }}>
              {video.owner.username}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;