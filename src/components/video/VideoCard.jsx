// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useVideo } from '../../contexts';
// import PropTypes from 'prop-types';
// import { BsFillCheckCircleFill } from "react-icons/bs";
// import { abbreviateNumber } from "js-abbreviation-number";

// // This component correctly displays the video duration.
// const VideoLength = ({ time }) => {
//   // The duration from your backend is a string like "5:00". We can display it directly.
//   // If it were in seconds, we would need to format it.
//   const duration = time || '0:00';
//   return (
//     <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded-md font-mono">
//       {duration}
//     </div>
//   );
// };

// function VideoCard({ video, onClick }) {
//   const navigate = useNavigate();
//   const { timeAgo } = useVideo();

//   const handleClick = (e) => {
//     // This prevents the link from navigating when clicking on the owner's avatar/name
//     if (e.target.closest('.channel-link')) {
//       e.preventDefault();
//       navigate(`/user/c/${video.owner?.username}`);
//       return;
//     }
//     if (onClick) {
//       onClick();
//     } else {
//       navigate(`/watch/${video._id}`);
//     }
//   };

//   return (
//     <div onClick={handleClick} className="flex flex-col mb-8 cursor-pointer">
//       <div className="relative h-48 md:h-52 rounded-2xl overflow-hidden">
//         <img
//           src={video?.thumbnail || '/default-thumbnail.jpg'}
//           alt={video?.title || 'Video thumbnail'}
//           className="h-full w-full object-cover"
//           loading="lazy"
//           onError={(e) => { e.target.onerror = null; e.target.src = '/default-thumbnail.jpg'; }}
//         />
//         {video.duration && <VideoLength time={video?.duration} />}
//       </div>
//       <div className="flex text-white mt-3">
//         <div className="flex items-start">
//           <Link to={`/user/c/${video.owner?.username}`} className="flex-shrink-0 channel-link">
//             <div className="flex h-9 w-9 rounded-full overflow-hidden">
//               <img
//                 src={video?.owner?.avatar || '/default-avatar.jpg'}
//                 alt="avatar"
//                 className="w-full h-full object-cover"
//                 onError={(e) => { e.target.onerror = null; e.target.src = '/default-avatar.jpg'; }}
//               />
//             </div>
//           </Link>
//           <div className="flex flex-col ml-3 overflow-hidden">
//             <span className="text-sm font-semibold line-clamp-2 text-black dark:text-white">
//               {video?.title || "Untitled Video"}
//             </span>
//             <Link to={`/user/c/${video.owner?.username}`} className="channel-link">
//               <span className="text-[12px] font-semibold text-black/[0.7] dark:text-white/[0.7] flex items-center">
//                 {video?.owner?.username || "Unknown Channel"}
//                 {/* Placeholder for a verified badge if you add it later */}
//                 {video?.owner?.isVerified && (
//                   <BsFillCheckCircleFill className="text-black/[0.5] dark:text-white/[0.5] text-[12px] ml-1" />
//                 )}
//               </span>
//             </Link>
//             <div className="flex text-[12px] font-semibold text-black/[0.7] dark:text-white/[0.7] truncate overflow-hidden">
//               <span>{`${abbreviateNumber(
//                 video?.views || 0,
//                 2
//               )} views`}</span>
//               <span className="flex text-[24px] leading-none font-bold text-black/[0.7] dark:text-white/[0.7] relative top-[-10px] mx-1">
//                 .
//               </span>
//               <span className="truncate">{timeAgo(video?.createdAt)}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// VideoCard.propTypes = {
//   video: PropTypes.shape({
//     _id: PropTypes.string.isRequired,
//     title: PropTypes.string.isRequired,
//     thumbnail: PropTypes.string,
//     duration: PropTypes.string,
//     views: PropTypes.number,
//     createdAt: PropTypes.string.isRequired,
//     owner: PropTypes.shape({
//       _id: PropTypes.string,
//       username: PropTypes.string,
//       avatar: PropTypes.string,
//       isVerified: PropTypes.bool, // Optional: for the checkmark badge
//     }),
//   }).isRequired,
//   onClick: PropTypes.func,
// };

// export default React.memo(VideoCard);


// src/components/VideoCard.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useVideo } from '../../contexts';
import PropTypes from 'prop-types';
import { BsFillCheckCircleFill } from "react-icons/bs";
import { abbreviateNumber } from "js-abbreviation-number";

const VideoLength = ({ time }) => {
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

  // Debug logging to see what data we're getting
  React.useEffect(() => {
    console.log('🎬 [VideoCard] Received video data:', {
      id: video?._id,
      title: video?.title,
      thumbnail: video?.thumbnail,
      videoFile: video?.videoFile,
      fullVideo: video
    });
  }, [video]);

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

  // PRIORITY-BASED thumbnail URL handler - most reliable methods first
  const getThumbnailUrl = () => {
    console.log('🖼️ [VideoCard] Getting thumbnail for video:', video?.title);

    // PRIORITY 1: Use custom thumbnail if available and valid
    if (video?.thumbnail?.url && video.thumbnail.url.trim()) {
      const cleanUrl = video.thumbnail.url.split('?')[0]; // Remove ?_a=BAMAK+Ju0
      console.log('🖼️ [VideoCard] PRIORITY 1 - Using custom thumbnail:', cleanUrl);
      return cleanUrl;
    }

    // PRIORITY 2: Generate from video public_id (most reliable)
    if (video?.videoFile?.public_id) {
      const publicId = video.videoFile.public_id; // e.g., "stremora/videos/License_xxhsnr"
      const generatedUrl = `https://res.cloudinary.com/dmoyyrmxr/video/upload/c_fill,h_225,w_400/so_2/${publicId}.jpg`;
      console.log('🖼️ [VideoCard] PRIORITY 2 - Generated from public_id:', generatedUrl);
      return generatedUrl;
    }

    // PRIORITY 3: Extract from video URL if public_id not available
    if (video?.videoFile?.url) {
      try {
        // Extract from: https://res.cloudinary.com/dmoyyrmxr/video/upload/v1759159232/stremora/videos/License_xxhsnr.mp4
        const match = video.videoFile.url.match(/\/upload\/(?:v\d+\/)?(.+)\.(mp4|mov|avi|mkv|webm)$/i);
        if (match) {
          const publicId = match[1]; // "stremora/videos/License_xxhsnr"
          const generatedUrl = `https://res.cloudinary.com/dmoyyrmxr/video/upload/c_fill,h_225,w_400/so_2/${publicId}.jpg`;
          console.log('🖼️ [VideoCard] PRIORITY 3 - Generated from video URL:', generatedUrl);
          return generatedUrl;
        }
      } catch (error) {
        console.warn('🖼️ [VideoCard] Failed to extract from video URL:', error);
      }
    }

    // PRIORITY 4: Handle old format (direct string)
    if (typeof video?.thumbnail === 'string' && video.thumbnail.trim()) {
      const cleanUrl = video.thumbnail.split('?')[0];
      console.log('🖼️ [VideoCard] PRIORITY 4 - Cleaned direct thumbnail:', cleanUrl);
      return cleanUrl;
    }

    console.log('🖼️ [VideoCard] All methods failed, using default');
    return '/default-thumbnail.jpg';
  };

  return (
    <div onClick={handleClick} className="flex flex-col mb-8 cursor-pointer">
      <div className="relative h-48 md:h-52 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800">
        <img
          src={getThumbnailUrl()}
          alt={video?.title || 'Video thumbnail'}
          className="h-full w-full object-cover transition-opacity duration-300"
          loading="lazy"
          onLoad={(e) => {
            console.log('✅ [VideoCard] Thumbnail loaded successfully:', e.target.src);
            e.target.style.opacity = '1';
          }}
          onError={(e) => {
            console.error('❌ [VideoCard] Thumbnail failed to load:', e.target.src);
            console.log('🔄 [VideoCard] Trying fallback...');

            // Try different fallback strategies
            if (!e.target.src.includes('default-thumbnail.jpg')) {
              // First fallback: try generating from video public_id
              if (video?.videoFile?.public_id) {
                const fallbackUrl = `https://res.cloudinary.com/dmoyyrmxr/video/upload/c_fill,h_225,w_400/so_2/${video.videoFile.public_id}.jpg`;
                if (e.target.src !== fallbackUrl) {
                  console.log('🔄 [VideoCard] Trying generated thumbnail:', fallbackUrl);
                  e.target.src = fallbackUrl;
                  return;
                }
              }

              // Final fallback: default thumbnail
              console.log('🔄 [VideoCard] Using default thumbnail');
              e.target.onerror = null;
              e.target.src = '/default-thumbnail.jpg';
            }
          }}
          style={{ opacity: 0 }}
        />

        {/* Loading placeholder */}
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800">
          <div className="text-gray-400 dark:text-gray-600">
            <svg className="w-8 h-8 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

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

VideoCard.propTypes = {
  video: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    // FIX: Reverted to a simple string to match the data structure
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