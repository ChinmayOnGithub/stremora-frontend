// SubscribeButton.jsx
import axios from '@/lib/axios.js';
import { useEffect, useState } from 'react';
import { useAuth, useUser } from '../../../contexts';
import { HiPlus, HiMinus } from 'react-icons/hi'; // Icon imports
import PropTypes from 'prop-types';

function SubscribeButton({
  channelId,
  channelName,
  className = '',
  compact = false,    // New prop: render compact icon-only button when true
}) {
  const { user, token } = useAuth();
  const { isSubscribed, updateSubscriptions, fetchSubscriptions } = useUser();

  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync local state with global subscriptions state
  useEffect(() => {
    setSubscribed(isSubscribed(channelId));
  }, [channelId, isSubscribed]);

  const handleSubscribeToggle = async () => {
    if (!user) return alert("Please log in to subscribe!");
    if (loading) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/subscription/toggle-subscription/${channelId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const newState = !subscribed;
        setSubscribed(newState); // Optimistic update
        updateSubscriptions(channelId, newState ? 'subscribe' : 'unsubscribe');
        fetchSubscriptions(); // Ensure backend sync
      }
    } catch (err) {
      console.error('Subscription error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Prevent showing button for the user's own channel
  if (!user || user.username === channelName) return null;

  // Determine button content and style
  const baseClasses = loading
    ? 'opacity-50 cursor-not-allowed'
    : 'hover:bg-gray-300 dark:hover:bg-gray-700 hover:shadow-lg';

  if (compact) {
    // Icon-only button for tight spaces
    return (
      <button
        onClick={(e) => { e.stopPropagation(); handleSubscribeToggle(); }}
        title={subscribed ? 'Unsubscribe' : 'Subscribe'}
        className={`flex-shrink-0 p-2 rounded-full bg-blue-600 text-white transition-all duration-200 ${baseClasses} ${className}`}>
        {loading
          ? <span className="animate-pulse">...</span>
          : (subscribed ? <HiMinus size={16} /> : <HiPlus size={16} />)
        }
      </button>
    );
  }

  // Default full button
  return (
    <button
      onClick={(e) => { e.stopPropagation(); handleSubscribeToggle(); }}
      className={`flex-shrink-0 w-fit max-w-[120px] truncate whitespace-nowrap px-4 py-2 text-sm font-medium rounded-full
        bg-gray-200 dark:bg-gray-900 text-black dark:text-white border border-black/70 dark:border-white/70
        shadow-sm transition-all duration-200 ${baseClasses} ${className}`}
    >
      {loading ? 'Processing...' : subscribed ? 'Unsubscribe' : 'Subscribe'}
    </button>
  );
}

SubscribeButton.propTypes = {
  channelId: PropTypes.string.isRequired,
  channelName: PropTypes.string.isRequired,
  className: PropTypes.string,
  compact: PropTypes.bool
};

export default SubscribeButton;
