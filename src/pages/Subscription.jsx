import { useState, useEffect } from 'react';
import { useAuth, useUser } from '../contexts';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaPlay, FaClock, FaTags, FaRegBell, FaCompass, FaChevronRight } from 'react-icons/fa';
import {
  Container,
  Button,
  SubscriptionItem
} from '../components';

function Subscription() {
  const { subscriptions = [], isSubscribed, updateSubscriptions, fetchSubscriptions } = useUser();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recommendedChannels, setRecommendedChannels] = useState([]);
  const [recommendedLoading, setRecommendedLoading] = useState(false);
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  // Fixed useEffect dependencies and loading states
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setSubscriptionsLoading(true);
        await fetchSubscriptions();
      } finally {
        if (isMounted) setSubscriptionsLoading(false);
      }
    };

    if (user?._id) fetchData();
    return () => { isMounted = false };
  }, [user?._id, fetchSubscriptions]);

  // Fixed recommended channels fetch with cleanup
  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(() => {
      if (isMounted) {
        setRecommendedChannels([
          { id: 1, name: "Code Master", avatar: "https://i.pravatar.cc/40?img=1", subscribers: 1200 },
          { id: 2, name: "Gadget Review", avatar: "https://i.pravatar.cc/40?img=2", subscribers: 850 },
          { id: 3, name: "AI Explorer", avatar: "https://i.pravatar.cc/40?img=3", subscribers: 2300 }
        ]);
        setRecommendedLoading(false);
      }
    }, 1000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  // Categories for filtering
  const categories = ['All', 'Technology', 'Gaming', 'Education', 'Music', 'Art'];

  return (
    <div className="min-h-full w-screen bg-gray-50 dark:bg-gray-900 pb-8">
      {/* Refined header with subtle gradients */}
      <div className="relative bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 dark:from-amber-900/70 dark:via-amber-800/70 dark:to-amber-900/70 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSIxMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMHYyMGM4MCAwIDkwIDYwIDE4MCA2MHM5MC02MCAxODAtNjAgOTAgNjAgMTgwIDYwIDkwLTYwIDE4MC02MCA5MCA2MCAxODAgNjAgOTAtNjAgMTgwLTYwIDkwIDYwIDE4MCA2MCA5MC02MCAxODAtNjB2LTIweiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')]"></div>

        {/* Refined decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

        <Container className="max-w-6xl py-12 relative">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="relative">
              <span className="absolute -left-3 -top-3 w-12 h-12 bg-amber-500/10 dark:bg-amber-500/10 rounded-full blur-xl"></span>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 relative">My Subscriptions</h1>
              <p className="text-gray-700 dark:text-gray-300 max-w-lg text-sm md:text-base">
                Stay updated with your favorite creators and discover new content tailored to your interests.
              </p>
            </div>

            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-full px-4 py-2 text-gray-700 dark:text-gray-200 border border-amber-200/30 dark:border-gray-700/50 shadow-sm">
                <span className="font-medium">{subscriptions.length}</span> Subscriptions
              </div>

              <Button
                onClick={() => navigate('/discover')}
                className="bg-white hover:bg-gray-50 text-amber-700 dark:text-amber-500 shadow-sm border border-amber-200/30 dark:border-gray-700/50 transition-all duration-300 hover:shadow"
                size="sm"
              >
                <FaCompass className="mr-2" />
                Discover Creators
              </Button>
            </div>
          </div>

          {/* Refined stats cards with subtle gradients */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg p-4 border border-blue-200/30 dark:border-blue-700/30 shadow-sm backdrop-blur-sm transform transition-all duration-300 hover:shadow hover:-translate-y-0.5">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
                  <FaUsers className="text-blue-600 dark:text-blue-400 w-5 h-5" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Subscriptions</p>
                  <p className="text-gray-900 dark:text-white text-2xl font-bold">{subscriptions.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg p-4 border border-purple-200/30 dark:border-purple-700/30 shadow-sm backdrop-blur-sm transform transition-all duration-300 hover:shadow hover:-translate-y-0.5">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
                  <FaPlay className="text-purple-600 dark:text-purple-400 w-5 h-5" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">New Videos</p>
                  <p className="text-gray-900 dark:text-white text-2xl font-bold">15</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-lg p-4 border border-green-200/30 dark:border-green-700/30 shadow-sm backdrop-blur-sm transform transition-all duration-300 hover:shadow hover:-translate-y-0.5">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center">
                  <FaClock className="text-green-600 dark:text-green-400 w-5 h-5" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Watch Time</p>
                  <p className="text-gray-900 dark:text-white text-2xl font-bold">23h</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="max-w-6xl -mt-6 relative z-10">
        {/* Refined category filter */}
        <div className="mb-8 overflow-x-auto hide-scrollbar bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex p-1.5">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 mx-1 ${activeCategory === category
                  ? 'bg-gradient-to-r from-amber-400/90 to-amber-500/90 text-white shadow-sm transform scale-102'
                  : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600/50 border border-gray-100 dark:border-gray-700'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main content - Subscriptions */}
          <div className="lg:col-span-8">
            {subscriptionsLoading ? (
              // Refined loading skeletons
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array(4).fill().map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm p-4 animate-pulse">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700" />
                      <div className="ml-3 flex-1">
                        <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full w-3/4 mb-2" />
                        <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : subscriptions.length > 0 ? (
              // Refined subscription grid
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subscriptions.map((subscription) =>
                  subscription.channelDetails && (
                    <SubscriptionItem
                      key={subscription._id}
                      channelDetails={subscription.channelDetails}
                      isSubscribed={isSubscribed}
                      onSubscriptionChange={updateSubscriptions}
                      className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow transition-all duration-300 hover:-translate-y-0.5"
                    />
                  )
                )}
              </div>
            ) : (
              // Refined empty state
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-50/30 to-white/0 dark:from-amber-900/5 dark:to-gray-800/0 pointer-events-none"></div>
                <div className="relative">
                  <div className="mx-auto w-24 h-24 bg-amber-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mb-4 shadow-inner">
                    <FaUsers className="w-12 h-12 text-amber-300 dark:text-gray-500" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-2">No subscriptions yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    Subscribe to your favorite creators to stay updated with their latest content
                  </p>
                  <Button
                    onClick={() => navigate('/')}
                    className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white shadow-sm hover:shadow transition-all duration-300"
                  >
                    Discover Channels
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar with proper text colors */}
          <div className="lg:col-span-4 space-y-6">
            {/* Refined recommended channels */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-amber-50/50 to-white dark:from-amber-900/10 dark:to-gray-800 p-4 border-b border-gray-100 dark:border-gray-700">
                <h2 className="font-medium text-gray-800 dark:text-white flex items-center">
                  <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mr-2 border border-amber-200 dark:border-amber-700/50">
                    <span className="text-amber-600 dark:text-amber-400 text-xs">✦</span>
                  </div>
                  Recommended For You
                </h2>
              </div>

              {recommendedLoading ? (
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 animate-pulse">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700" />
                        <div className="ml-3 flex-1">
                          <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full w-2/3 mb-2" />
                          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full w-1/2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  {recommendedChannels.map((channel) => (
                    <div key={channel.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-300 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <div className="flex items-center">
                        <div className="relative">
                          <img
                            src={channel.avatar}
                            alt={channel.name}
                            className="w-10 h-10 rounded-full border-2 border-amber-100/50 dark:border-amber-900/20 object-cover"
                          />
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
                        </div>
                        <div className="ml-3 flex-1">
                          <h3 className="font-medium text-gray-800 dark:text-white">
                            {channel.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <span>{channel.subscribers.toLocaleString()} subscribers</span>
                          </p>
                        </div>
                        <Button
                          size="xs"
                          className="bg-white hover:bg-gray-50 text-amber-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-amber-400 rounded-full px-3 shadow-sm hover:shadow border border-amber-200/50 dark:border-gray-600 transition-all duration-300"
                        >
                          Follow
                        </Button>
                      </div>
                    </div>
                  ))}

                  <div className="p-3 bg-gray-50 dark:bg-gray-700/30 text-center">
                    <button className="text-amber-600 dark:text-amber-400 text-sm font-medium hover:underline flex items-center justify-center w-full transition-all duration-300 hover:text-amber-700 dark:hover:text-amber-300">
                      View More
                      <FaChevronRight className="ml-1 w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Refined categories */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-amber-50/50 to-white dark:from-amber-900/10 dark:to-gray-800 p-4 border-b border-gray-100 dark:border-gray-700">
                <h2 className="font-medium text-gray-800 dark:text-white flex items-center">
                  <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mr-2 border border-amber-200 dark:border-amber-700/50">
                    <span className="text-amber-600 dark:text-amber-400 text-xs">✦</span>
                  </div>
                  Popular Categories
                </h2>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-2 gap-2">
                  {['Technology', 'Gaming', 'Education', 'Music', 'Travel', 'Cooking', 'Art', 'Science'].map((category) => (
                    <button
                      key={category}
                      onClick={() => navigate(`/category/${category.toLowerCase()}`)}
                      className="text-left px-3 py-2 bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-amber-50/50 dark:hover:bg-amber-900/10 hover:text-amber-700 dark:hover:text-amber-400 transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-amber-200/50 dark:hover:border-amber-800/30 flex items-center shadow-sm"
                    >
                      <FaTags className="w-3 h-3 mr-2 text-amber-500/70 dark:text-amber-500/50" />
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Subscription;

