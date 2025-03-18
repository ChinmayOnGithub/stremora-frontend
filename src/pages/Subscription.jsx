import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth, useUser } from '../contexts';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaStar } from 'react-icons/fa';
import {
  Banner,
  SubscriptionItem,
  Container,
  Button
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
    <div className="min-h-full space-y-6">
      {/* Enhanced Banner */}
      <Banner className="mx-2 sm:mx-4 mt-4">
        <section className="relative rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6 shadow-lg transition-colors duration-300">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-300">
              Your Subscriptions Hub
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              Stay connected with your favorite creators and discover new content
            </p>
          </div>
        </section>
      </Banner>

      <Container className="rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Subscribed Channels Section */}
          <section className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow-sm transition-colors duration-300">
            <header className="flex items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <FaUsers className="w-6 h-6 mr-3 text-amber-500" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Your Channels
              </h2>
            </header>

            {subscriptionsLoading ? (
              <p className="text-center p-4 text-gray-500 dark:text-gray-400">
                Loading your subscriptions...
              </p>
            ) : subscriptions.length > 0 ? (
              <div className="space-y-3">
                {subscriptions.map((channel) =>
                  channel.channelDetails && (
                    <SubscriptionItem
                      key={channel._id}
                      channelDetails={channel.channelDetails}
                      isSubscribed={isSubscribed}
                      onSubscriptionChange={updateSubscriptions}
                      className="hover:shadow-md transition-all duration-300"
                    />
                  )
                )}
              </div>
            ) : (
              <div className="text-center p-6 text-gray-500 dark:text-gray-400">
                No subscriptions yet. Explore our recommendations!
              </div>
            )}
          </section>

          {/* Recommended Channels Section */}
          <section className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow-sm transition-colors duration-300">
            <header className="flex items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <FaStar className="w-6 h-6 mr-3 text-amber-500" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Recommended for You
              </h2>
            </header>

            {recommendedLoading ? (
              <p className="text-center p-4 text-gray-500 dark:text-gray-400">
                Finding great channels...
              </p>
            ) : (
              <div className="space-y-3">
                {recommendedChannels.map((channel) => (
                  <article
                    key={channel.id}
                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center flex-1">
                      <img
                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full"
                        src={channel.avatar}
                        alt={channel.name}
                      />
                      <div className="ml-3 sm:ml-4">
                        <h3 className="font-medium text-gray-800 dark:text-gray-200">
                          {channel.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {channel.subscribers.toLocaleString()} subscribers
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => navigate(`/user/c/${channel.name}`)}
                      variant="secondary"
                      size="sm"
                      className="shrink-0 ml-4"
                    >
                      View
                    </Button>
                  </article>
                ))}
              </div>
            )}
          </section>
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