import { useState, useEffect } from 'react';
import { useAuth, useUser } from '../contexts';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaPlay, FaClock } from 'react-icons/fa';
import { Button, SubscriptionItem } from '../components';
import Layout from '../components/layout/Layout';

function Subscription() {
  const { subscriptions = [], isSubscribed, updateSubscriptions, fetchSubscriptions } = useUser();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

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

  // Categories for filtering
  const categories = ['All', 'Technology', 'Gaming', 'Education', 'Music', 'Art'];

  return (
    <div>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Header Section */}
        <div className="relative bg-white/80 dark:bg-gray-800/50 border-b border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-amber-500/10 to-amber-500/5"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="relative">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  My Subscriptions
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Stay updated with your favorite creators
                </p>
              </div>

              <Button
                onClick={() => navigate('/discover')}
                className="bg-amber-500 hover:bg-amber-600 text-black shadow-sm hover:shadow transition-all duration-200"
                size="sm"
              >
                Discover Creators
              </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <FaUsers className="text-amber-600 dark:text-amber-500 w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Subscriptions</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{subscriptions.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <FaPlay className="text-amber-600 dark:text-amber-500 w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">New Videos</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">-</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <FaClock className="text-amber-600 dark:text-amber-500 w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Watch Time</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">-</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Category Filter */}
          <div className="mb-6 overflow-x-auto hide-scrollbar">
            <div className="flex gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeCategory === category
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'bg-white dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-gray-200/50 dark:border-gray-700/50'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Subscriptions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subscriptionsLoading ? (
              Array(4).fill().map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-3/4 mb-2" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-1/2" />
                    </div>
                  </div>
                </div>
              ))
            ) : subscriptions.length > 0 ? (
              subscriptions.map((subscription) =>
                subscription.channelDetails && (
                  <div key={subscription._id} className="bg-white dark:bg-gray-800/50 rounded-xl overflow-hidden">
                    <SubscriptionItem
                      channelDetails={subscription.channelDetails}
                      isSubscribed={isSubscribed}
                      onSubscriptionChange={updateSubscriptions}
                      className="border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 backdrop-blur-sm"
                    />
                  </div>
                )
              )
            ) : (
              <div className="col-span-full bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4">
                  <FaUsers className="w-8 h-8 text-amber-500/50" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No subscriptions yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Subscribe to your favorite creators to stay updated with their latest content
                </p>
                <Button
                  onClick={() => navigate('/discover')}
                  className="bg-amber-500 hover:bg-amber-600 text-black shadow-sm hover:shadow transition-all duration-200"
                >
                  Discover Creators
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Subscription;

