import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth, useUser } from '../contexts';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaStar, FaClock, FaTags } from 'react-icons/fa';
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
    <div className="min-h-full space-y-8 pb-8">
      {/* Stats Cards */}
      <Container className="max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{subscriptions.length}</p>
            <p className="text-sm text-blue-700 dark:text-blue-200">Subscriptions</p>
          </div>
          <div className="p-4 bg-amber-50/50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/30">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">23h</p>
            <p className="text-sm text-amber-700 dark:text-amber-200">Watched</p>
          </div>
          <div className="p-4 bg-purple-50/50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800/30">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">15</p>
            <p className="text-sm text-purple-700 dark:text-purple-200">New Videos</p>
          </div>
          <div className="p-4 bg-green-50/50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800/30">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">7d</p>
            <p className="text-sm text-green-700 dark:text-green-200">Streak</p>
          </div>
        </div>
      </Container>

      <Container className="max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Subscriptions Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                <FaUsers className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Subscriptions</h2>
              </div>

              {subscriptionsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse p-4 rounded-lg bg-gray-100/50 dark:bg-gray-800/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32" />
                          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-24" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : subscriptions.length > 0 ? (
                <div className="space-y-3">
                  {subscriptions.map((channel) =>
                    channel.channelDetails && (
                      <SubscriptionItem
                        key={channel._id}
                        channelDetails={channel.channelDetails}
                        isSubscribed={isSubscribed}
                        onSubscriptionChange={updateSubscriptions}
                        className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-gray-100 dark:border-gray-700"
                      />
                    )
                  )}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No subscriptions found
                </div>
              )}
            </section>

            {/* Recently Added */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                <FaClock className="w-5 h-5 text-purple-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recently Added</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {subscriptions.slice(0, 4).map((channel) => (
                  <div
                    key={channel._id}
                    className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={channel.channelDetails.avatar}
                        className="w-8 h-8 rounded-full object-cover"
                        alt={channel.channelDetails.username}
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {channel.channelDetails.username}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Recommended Channels */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                <FaStar className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recommended</h2>
              </div>

              {recommendedLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse p-4 rounded-lg bg-gray-100/50 dark:bg-gray-800/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32" />
                          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-24" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {recommendedChannels.map((channel) => (
                    <div
                      key={channel.id}
                      className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={channel.avatar}
                          className="w-10 h-10 rounded-full object-cover"
                          alt={channel.name}
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{channel.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {channel.subscribers.toLocaleString()} subscribers
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => navigate(`/user/c/${channel.name}`)}
                        variant="outline"
                        size="sm"
                        className="text-gray-600 dark:text-gray-300"
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Categories */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                <FaTags className="w-5 h-5 text-green-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Categories</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Tech', 'Gaming', 'Education', 'Music'].map((category) => (
                  <button
                    key={category}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    #{category}
                  </button>
                ))}
              </div>
            </section>
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





// {
//   subscriptionsLoading ? (
//     <div className="space-y-3">
//       {[1, 2, 3].map((i) => (
//         <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700" />
//             <div className="flex-1 space-y-2">
//               <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32" />
//               <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-24" />
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   ) : subscriptions.length > 0 ? (
//     <div className="space-y-3">
//       {subscriptions.map((channel) =>
//         channel.channelDetails && (
//           <SubscriptionItem
//             key={channel._id}
//             channelDetails={channel.channelDetails}
//             isSubscribed={isSubscribed}
//             onSubscriptionChange={updateSubscriptions}
//             className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
//           />
//         )
//       )}
//     </div>
//   ) : (
//     <div className="p-4 text-center text-gray-500 dark:text-gray-400">
//       No subscriptions found
//     </div>
//   )
// }