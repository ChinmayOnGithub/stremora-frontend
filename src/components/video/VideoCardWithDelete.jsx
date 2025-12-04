import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useVideo } from '../../contexts';
import PropTypes from 'prop-types';
import { BsFillCheckCircleFill } from "react-icons/bs";
import { abbreviateNumber } from "js-abbreviation-number";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";

const VideoLength = ({ time }) => {
  const duration = time || '0:00';
  return (
    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded-md font-mono z-20">
      {duration}
    </div>
  );
};

function VideoCardWithDelete({ video, onDelete, isDeleting }) {
  const navigate = useNavigate();
  const { timeAgo } = useVideo();

  const handleClick = (e) => {
    if (e.target.closest('.channel-link') || e.target.closest('.delete-button')) {
      return;
    }
    navigate(`/watch/${video._id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(video._id);
    }
  };

  // PRIORITY-BASED thumbnail URL handler - most reliable methods first
  const getThumbnailUrl = () => {
    // PRIORITY 1: Use custom thumbnail if available and valid
    if (video?.thumbnail?.url && video.thumbnail.url.trim()) {
      const url = video.thumbnail.url;
      
      // Skip localhost URLs (MinIO local testing)
      if (url.includes('localhost')) {
        console.warn(`Skipping localhost thumbnail for "${video.title}"`);
        // Fall through to generate from video
      } else {
        // Clean URL by removing query parameters
        return url.split('?')[0];
      }
    }

    // PRIORITY 2: Generate from video public_id (for Cloudinary videos)
    if (video?.videoFile?.public_id && video?.videoFile?.storage_provider === 'cloudinary') {
      const publicId = video.videoFile.public_id.split('?')[0];
      return `https://res.cloudinary.com/dmoyyrmxr/video/upload/c_fill,h_225,w_400/so_2/${publicId}.jpg`;
    }

    // PRIORITY 3: Extract from Cloudinary video URL if public_id not available
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

    // PRIORITY 4: Handle old format (direct string)
    if (typeof video?.thumbnail === 'string' && video.thumbnail.trim()) {
      const url = video.thumbnail;
      if (!url.includes('localhost')) {
        return url.split('?')[0];
      }
    }

    return '/default-thumbnail.jpg';
  };

  return (
    <div onClick={handleClick} className="flex flex-col mb-8 cursor-pointer group relative">
      {/* Delete button - positioned absolutely on top right */}
      <div className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity delete-button">
        <Button
          variant="destructive"
          size="icon"
          className="h-8 w-8 bg-red-600 hover:bg-red-700 shadow-lg"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </Button>
      </div>

      <div className="relative h-48 md:h-52 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800">
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
          className="relative z-10 h-full w-full object-cover"
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

VideoCardWithDelete.propTypes = {
  video: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        url: PropTypes.string,
        public_id: PropTypes.string,
      })
    ]),
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
  onDelete: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool,
};

export default React.memo(VideoCardWithDelete);
