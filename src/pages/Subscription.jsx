import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth, useUser } from '../contexts';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaStar } from 'react-icons/fa';
import {
  Banner,
  SubscriptionItem,
  Container
} from '../components';

function Subscription() {
  const { subscriptions = [], isSubscribed, updateSubscriptions, fetchSubscriptions } = useUser();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recommendedChannels, setRecommendedChannels] = useState([]);
  const [recommendedLoading, setRecommendedLoading] = useState(false);
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(true);

  // Fetch subscriptions when user data is available.
  useEffect(() => {
    const fetchData = async () => {
      setSubscriptionsLoading(true);
      await fetchSubscriptions();
      setSubscriptionsLoading(false);
    };

    if (user?._id) {
      fetchData();
    }
  }, [user?._id, fetchSubscriptions]);

  // Fetch recommended channels (demo data).
  useEffect(() => {
    setRecommendedLoading(true);
    const timer = setTimeout(() => {
      const demoRecommendedChannels = [
        { id: 1, name: "Code Master", avatar: "https://i.pravatar.cc/40?img=1", subscribers: 1200 },
        { id: 2, name: "Gadget Review", avatar: "https://i.pravatar.cc/40?img=2", subscribers: 850 },
        { id: 3, name: "AI Explorer", avatar: "https://i.pravatar.cc/40?img=3", subscribers: 2300 }
      ];
      setRecommendedChannels(demoRecommendedChannels);
      setRecommendedLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const inspectChannel = (channelName) => {
    navigate(`/user/c/${channelName}`);
  };

  return (
    <div className="min-h-full">
      {/* Banner Section */}
      <Banner className="p-4">
        <div className="m-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Your Subscriptions
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Explore your favorite channels and discover new creators to follow. Stay updated with the latest content!
          </p>
        </div>
      </Banner>

      <Container className="rounded-md">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* Subscribed Channels */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
            <h3 className="text-gray-900 dark:text-white text-2xl font-bold mb-6 flex items-center">
              <FaUsers className="mr-2 text-amber-500" /> Your Subscribed Channels
            </h3>
            {subscriptionsLoading ? (
              <p className="text-gray-600 dark:text-gray-400 text-center p-4">Loading subscriptions...</p>
            ) : subscriptions.length > 0 ? (
              <div className="space-y-4">
                {subscriptions.map((channel) =>
                  channel.channelDetails && (
                    <SubscriptionItem
                      key={channel._id}
                      channelDetails={channel.channelDetails}
                      isSubscribed={isSubscribed}
                      onSubscriptionChange={updateSubscriptions}
                    />
                  )
                )}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center p-4">No subscriptions yet.</p>
            )}
          </div>

          {/* Recommended Channels */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
            <h3 className="text-gray-900 dark:text-white text-2xl font-bold mb-6 flex items-center">
              <FaStar className="mr-2 text-amber-500" /> Recommended Channels
            </h3>
            {recommendedLoading ? (
              <p className="text-gray-600 dark:text-gray-400 text-center p-4">Loading recommendations...</p>
            ) : (
              <div className="space-y-4">
                {recommendedChannels.map((channel) => (
                  <div
                    key={channel.id}
                    className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-lg hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center">
                      <img
                        className="w-12 h-12 object-cover rounded-full"
                        src={channel.avatar}
                        alt={channel.name}
                      />
                      <div className="ml-4">
                        <p className="text-gray-900 dark:text-white font-semibold">{channel.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {channel.subscribers} subscribers
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/user/c/${channel.name}`)}
                      className="bg-amber-500 text-white text-sm sm:text-md py-2 px-4 rounded-full hover:bg-amber-600 transition-all duration-300 min-w-fit"
                    >
                      View Channel
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

Subscription.propTypes = {};

export default Subscription;



{/* <div
                      key={channel._id}
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg hover:shadow-md transition-all duration-300"
                    >
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => inspectChannel(channel.channelDetails.username)}
                      >
                        <img
                          className="w-12 h-12 object-cover rounded-full"
                          src={channel.channelDetails.avatar}
                          alt={channel.channelDetails.username}
                        />
                        <div className="ml-4">
                          <p className="text-gray-900 dark:text-white font-semibold">{channel.channelDetails.username}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {channel.channelDetails.subscribers} subscribers
                          </p>
                        </div>
                      </div>
                      <SubscribeButton
                        channelId={channel.channelDetails._id}
                        channelName={channel.channelDetails.username}
                        isSubscribed={isSubscribed(channel.channelDetails._id)}
                        onSubscriptionChange={() => {
                          const action = isSubscribed(channel.channelDetails._id) ? "unsubscribe" : "subscribe";
                          updateSubscriptions(channel.channelDetails._id, action);
                        }}
                      />
                    </div> */}