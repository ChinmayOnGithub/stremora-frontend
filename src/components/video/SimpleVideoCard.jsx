// Simple test component to debug thumbnail display
import React from 'react';
import { useNavigate } from 'react-router-dom';

function SimpleVideoCard({ video }) {
  const navigate = useNavigate();

  // Log everything
  console.log('[SimpleVideoCard] Full video object:', video);
  console.log('[SimpleVideoCard] Thumbnail:', video?.thumbnail);
  console.log('[SimpleVideoCard] Thumbnail type:', typeof video?.thumbnail);
  console.log('[SimpleVideoCard] Thumbnail.url:', video?.thumbnail?.url);

  // Get thumbnail URL
  const getThumbnailUrl = () => {
    // Check if thumbnail is an object with url property
    if (video?.thumbnail && typeof video.thumbnail === 'object' && video.thumbnail.url) {
      console.log('[SimpleVideoCard] Using thumbnail.url:', video.thumbnail.url);
      return video.thumbnail.url;
    }
    
    // Check if thumbnail is a direct string
    if (typeof video?.thumbnail === 'string' && video.thumbnail) {
      console.log('[SimpleVideoCard] Using direct thumbnail string:', video.thumbnail);
      return video.thumbnail;
    }

    console.log('[SimpleVideoCard] No thumbnail found, using placeholder');
    return 'https://via.placeholder.com/400x225?text=No+Thumbnail';
  };

  const thumbnailUrl = getThumbnailUrl();

  return (
    <div 
      onClick={() => navigate(`/watch/${video._id}`)}
      className="cursor-pointer border-2 border-blue-500 p-4 mb-4"
      style={{ maxWidth: '400px' }}
    >
      <div className="bg-gray-200 mb-2" style={{ height: '225px' }}>
        <img
          src={thumbnailUrl}
          alt={video?.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onLoad={() => console.log('[SimpleVideoCard] Image loaded:', thumbnailUrl)}
          onError={(e) => {
            console.error('[SimpleVideoCard] Image failed to load:', thumbnailUrl);
            e.target.src = 'https://via.placeholder.com/400x225?text=Load+Failed';
          }}
        />
      </div>
      <div>
        <h3 className="font-bold">{video?.title}</h3>
        <p className="text-sm text-gray-600">
          Thumbnail Type: {typeof video?.thumbnail}
        </p>
        <p className="text-sm text-gray-600">
          Has URL: {video?.thumbnail?.url ? 'YES' : 'NO'}
        </p>
        <p className="text-xs text-gray-500 break-all">
          URL: {thumbnailUrl}
        </p>
      </div>
    </div>
  );
}

export default SimpleVideoCard;
