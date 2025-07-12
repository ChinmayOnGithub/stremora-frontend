import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../contexts';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import PropTypes from 'prop-types';

function LikeButton({
  entityId,
  entityType = 'video',
  className = '',
  compact = false,
}) {
  const { user, token, isLoaded: authLoaded } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Function to fetch like status from backend
  const fetchLikeStatus = useCallback(async () => {
    if (!user || !token || !entityId) return;
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/like/check-like`,
        {
          params: { 
            entityType,
            entityId 
          },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        setIsLiked(response.data.data.isLiked);
        setLikeCount(response.data.data.likeCount);
      }
    } catch (error) {
      console.error("Failed to fetch like status:", error);
    } finally {
      setInitialized(true);
    }
  }, [entityId, entityType, user, token]);

  // Fetch like status on mount and when dependencies change
  useEffect(() => {
    if (authLoaded && user && token) {
      fetchLikeStatus();
    } else if (authLoaded && !user) {
      // User not logged in, show default state
      setInitialized(true);
    }
  }, [authLoaded, user, token, fetchLikeStatus]);

  const handleLikeToggle = async () => {
    if (!user) {
      alert("Please log in to like this content!");
      return;
    }

    if (loading || !initialized) return;

    setLoading(true);
    const newLikedState = !isLiked;
    const newLikeCount = newLikedState ? likeCount + 1 : likeCount - 1;

    // Optimistic UI update
    setIsLiked(newLikedState);
    setLikeCount(newLikeCount);

    try {
      let endpoint = '';
      switch (entityType) {
        case 'video':
          endpoint = `/like/toggle-video-like/${entityId}`;
          break;
        case 'comment':
          endpoint = `/like/toggle-comment-like/${entityId}`;
          break;
        case 'tweet':
          endpoint = `/like/toggle-tweet-like/${entityId}`;
          break;
        default:
          throw new Error('Invalid entity type');
      }

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}${endpoint}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Verify after toggle to ensure sync
      await fetchLikeStatus();
    } catch (err) {
      console.error('Like toggle error:', err);
      // Revert on error
      setIsLiked(!newLikedState);
      setLikeCount(likeCount);
    } finally {
      setLoading(false);
    }
  };

  // Don't render until auth is loaded and component is initialized
  if (!authLoaded || !initialized) {
    return (
      <div className={`flex items-center justify-center ${compact ? 'w-8 h-8' : 'px-3 py-1.5'}`}>
        <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Don't show button for non-logged in users
  if (!user) return null;

  const baseClasses = `
    flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200
    ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}
    ${isLiked 
      ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
      : 'text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
    }
    ${className}
  `;

  const compactClasses = `
    flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200
    ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}
    ${isLiked 
      ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
      : 'text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
    }
    ${className}
  `;

  if (compact) {
    return (
      <button
        onClick={handleLikeToggle}
        disabled={loading}
        className={compactClasses}
        title={isLiked ? 'Unlike' : 'Like'}
        aria-live="polite"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          isLiked ? <FaHeart size={16} /> : <FaRegHeart size={16} />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleLikeToggle}
      disabled={loading}
      className={baseClasses}
      aria-live="polite"
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        isLiked ? <FaHeart size={16} /> : <FaRegHeart size={16} />
      )}
      <span className="text-sm font-medium">{likeCount}</span>
    </button>
  );
}

LikeButton.propTypes = {
  entityId: PropTypes.string.isRequired,
  entityType: PropTypes.oneOf(['video', 'comment', 'tweet']),
  className: PropTypes.string,
  compact: PropTypes.bool,
};

export default LikeButton; 