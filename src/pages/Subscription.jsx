import { useState, useEffect } from 'react';
import useAuth from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import Container from '../components/Container';
import SubscribeButton from '../components/SubscribeButton';
import useUser from '../contexts/UserContext';

function Subscription() {
  // Provide default values for destructuring
  const { subscriptions = [], isSubscribed, updateSubscriptions, fetchSubscriptions } = useUser();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recommendedChannels, setRecommendedChannels] = useState([]);
  const [recommendedLoading, setRecommendedLoading] = useState(false);
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(true); // Local loading state for subscriptions

  // Fetch subscriptions when the component mounts or user changes
  useEffect(() => {
    const fetchData = async () => {
      setSubscriptionsLoading(true); // Start loading
      await fetchSubscriptions(); // Fetch subscriptions
      setSubscriptionsLoading(false); // Stop loading
    };

    fetchData();
  }, [user?._id, fetchSubscriptions]);

  // Fetch recommended channels (demo data for now)
  useEffect(() => {
    setRecommendedLoading(true);
    const timer = setTimeout(() => {
      const demoRecommendedChannels = [
        { id: 1, name: "Code Master", avatar: "https://i.pravatar.cc/40?img=1" },
        { id: 2, name: "Gadget Review", avatar: "https://i.pravatar.cc/40?img=2" },
        { id: 3, name: "AI Explorer", avatar: "https://i.pravatar.cc/40?img=3" }
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
    <Container>
      <h2 className="text-left p-4 text-lg text-black dark:text-white">Subscriptions & Recommendations</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Subscribed Channels */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg">
          <h3 className="text-black dark:text-white text-xl mb-4">Your Subscribed Channels</h3>
          {subscriptionsLoading ? (
            <p className="text-gray-600 dark:text-gray-400 text-center p-4">Loading subscriptions...</p>
          ) : subscriptions.length > 0 ? (
            <div className="space-y-3">
              {subscriptions.map((channel) => (
                channel.channelDetails && (
                  <div
                    key={channel._id}
                    className="flex items-center bg-gray-100 dark:bg-gray-800 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <div className='flex items-center'
                      onClick={() => inspectChannel(channel.channelDetails.username)}>
                      <img className="w-10 h-10 object-cover rounded-full" src={channel.channelDetails.avatar} alt="" />
                      <p className="text-black dark:text-white ml-4">{channel.channelDetails.username}</p>
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
                  </div>
                )
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center p-4">No subscriptions yet.</p>
          )}
        </div>

        {/* Recommended Channels */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg">
          <h3 className="text-black dark:text-white text-xl mb-4">Recommended Channels</h3>
          {recommendedLoading ? (
            <p className="text-gray-600 dark:text-gray-400 text-center p-4">Loading recommended channels...</p>
          ) : (
            <div className="space-y-3">
              {recommendedChannels.map((channel) => (
                <div key={channel.id}
                  className="flex items-center bg-gray-100 dark:bg-gray-800 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <img className="w-10 h-10 object-cover rounded-full" src={channel.avatar} alt="" />
                  <p className="text-black dark:text-white ml-4">{channel.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

export default Subscription;