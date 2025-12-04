// SubscriptionItem.jsx
// import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { SubscribeButton } from '..';
import useSubscriberCount from '../../hooks/useSubscriberCount';

function SubscriptionItem({ channelDetails, isSubscribed = () => true, onSubscriptionChange = () => {} }) {
  const navigate = useNavigate();

  // Fetch the current subscriber count for this channel.
  const { subscriberCount, countLoading } = useSubscriberCount(channelDetails._id, [channelDetails._id]);

  // Navigates to the channel's detail page.
  const inspectChannel = (channelName) => {
    navigate(`/user/c/${channelName}`);
  };

  // Check if isSubscribed is a function
  const checkSubscribed = typeof isSubscribed === 'function' ? isSubscribed(channelDetails._id) : true;

  return (
    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg hover:shadow-md transition-all duration-300">
      {/* Channel Info Section */}
      <div className="flex items-center cursor-pointer flex-1" onClick={() => inspectChannel(channelDetails.username)}>
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
            {countLoading ? (
              <div className="relative inline-flex items-center">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-amber-500 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500"></span>
              </div>
            ) : (
              `${subscriberCount} subscribers`
            )}
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 max-w-[120px]">
        {/* Subscribe/Unsubscribe Button */}
        <SubscribeButton
          channelId={channelDetails._id}
          channelName={channelDetails.username}
          isSubscribed={checkSubscribed}
          onSubscriptionChange={() => {
            const action = checkSubscribed ? 'unsubscribe' : 'subscribe';
            onSubscriptionChange(channelDetails._id, action);
          }}
        />
      </div>
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
  isSubscribed: PropTypes.func,
  onSubscriptionChange: PropTypes.func,
};

export default SubscriptionItem;
