// SubscriptionItem.jsx
// import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { SubscribeButton } from '..';
import useSubscriberCount from '../../hooks/useSubscriberCount';

function SubscriptionItem({ channelDetails, isSubscribed, onSubscriptionChange }) {
  const navigate = useNavigate();

  // Fetch the current subscriber count for this channel.
  // We pass the channel id as a dependency so the hook re-fetches if it ever changes.
  const { subscriberCount, countLoading } = useSubscriberCount(channelDetails._id, [channelDetails._id]);

  // Navigates to the channel's detail page.
  const inspectChannel = (channelName) => {
    navigate(`/user/c/${channelName}`);
  };

  return (
    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg hover:shadow-md transition-all duration-300">
      {/* Channel Info Section */}
      <div className="flex items-center cursor-pointer" onClick={() => inspectChannel(channelDetails.username)}>
        <img
          className="w-12 h-12 object-cover rounded-full"
          src={channelDetails.avatar}
          alt={channelDetails.username}
        />
        <div className="ml-4">
          <p className="text-gray-900 dark:text-white font-semibold">
            {channelDetails.username}
          </p>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {countLoading ?
              (
                <div className="relative inline-flex items-center">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-amber-500 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500"></span>
                </div>
              ) : subscriberCount} subscribers
          </div>
        </div>
      </div>

      {/* Subscribe/Unsubscribe Button */}
      <SubscribeButton
        channelId={channelDetails._id}
        channelName={channelDetails.username}
        isSubscribed={isSubscribed(channelDetails._id)}
        onSubscriptionChange={() => {
          const action = isSubscribed(channelDetails._id) ? 'unsubscribe' : 'subscribe';
          onSubscriptionChange(channelDetails._id, action);
        }}
      />
    </div>
  );
}

// props validation
SubscriptionItem.propTypes = {
  channelDetails: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
  }).isRequired,
  isSubscribed: PropTypes.func.isRequired,
  onSubscriptionChange: PropTypes.func.isRequired,
};

export default SubscriptionItem;
