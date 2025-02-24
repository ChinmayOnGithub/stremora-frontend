import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading/Loading";
import Container from "../components/Container";
import SubscribeButton from "../components/SubscribeButton";
import useSubscriberCount from "../hooks/useSubscriberCount"; // Import the hook
import { useAuth, useUser, useVideo } from '../contexts';

function Channel() {
  const { token, loading, setLoading } = useAuth(); // ✅ Get loading state from context
  const { channelName } = useParams();
  const { subscriptions, isSubscribed, updateSubscriptions } = useUser();
  const [channel, setChannel] = useState(null);
  const [subscriptionChanged, setSubscriptionChanged] = useState(false); // State to trigger effect
  const [activeTab, setActiveTab] = useState("videos");
  const { fetchVideos, videos, channelVideos, timeAgo } = useVideo();

  // Use the custom hook to get subscriber count
  const { subscriberCount, countLoading } = useSubscriberCount(channel?._id, [subscriptionChanged]);

  const navigate = useNavigate();
  // Get Channel info
  useEffect(() => {
    if (!channelName.trim()) return;
    setLoading(true);
    axios.get(
      `https://youtube-backend-clone.onrender.com/api/v1/users/c/${channelName}`,
      {
        headers: {
          Authorization: `Bearer ${token}` // Ensure authToken is correctly set
        }
      }
    )
      .then((res) => {
        console.log("API Response:", res.data);
        setChannel(res.data?.data || null); // Ensure we set the correct object
      })
      .catch((err) => {
        console.error("Something went wrong", err);
        setChannel(null); // Ensure state resets when an error occurs
      })
      .finally(() => {
        setLoading(false);
      });
  }, [channelName, token, setLoading]);

  // Fetch videos for the channel
  useEffect(() => {
    if (!channel?._id) return;
    console.log("Fetching videos for channel ID:", channel._id);
    fetchVideos(1, 10, channel._id).then(() => {
      console.log("Channel Videos:", channelVideos); // Log the channelVideos state
    });
  }, [channel, fetchVideos]);

  const watchVideo = (videoId) => {
    navigate(`/watch/${videoId}`); // Redirect to watch page with video ID
  };

  if (loading || !channel) {
    return <Loading />;
  }

  if (!channel && !loading) {
    return <p>No channel found</p>;
  }

  return (
    <Container>
      <div className="relative card h-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg">
        {channel?.coverImage ? (
          <img src={channel.coverImage} alt="Cover" className="w-full h-32 sm:h-64 object-cover rounded-t-lg" />
        ) : (
          <p className="text-center text-gray-400 dark:text-gray-500">No cover image</p>
        )}

        <div className="flex flex-wrap items-center px-4 py-4 sm:px-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border border-gray-300 dark:border-gray-700">
            {channel?.avatar ? (
              <img src={channel.avatar} alt="User Avatar" className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                No Avatar
              </div>
            )}
          </div>

          <div className="ml-4 flex-1">
            <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-200">@{channel.username}</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{channel.fullname}</p>

            <div className="flex items-center text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
              {countLoading ? (
                <div className="relative flex items-center">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-amber-500 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500"></span>
                </div>
              ) : (
                <p>{subscriberCount}</p>
              )}
              <span className="ml-1">Subscribers</span>
            </div>
          </div>

          <SubscribeButton
            channelId={channel._id}
            channelName={channel.username}
            isSubscribed={isSubscribed(channel._id)}
            onSubscriptionChange={() => {
              const action = isSubscribed(channel._id) ? "unsubscribe" : "subscribe";
              updateSubscriptions(channel._id, action);
              setSubscriptionChanged(prev => !prev); // Toggle subscriptionChanged state
            }}
          />
        </div>

        {/* Tab bar */}
        <div className="border-b border-gray-300 dark:border-gray-700 flex">
          <button
            onClick={() => setActiveTab("videos")}
            className={`flex-1 py-2 text-center ${activeTab === "videos"
              ? "border-b-2 border-blue-500 text-blue-500 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-400"
              }`}
          >
            Videos
          </button>
          <button
            onClick={() => setActiveTab("tweets")}
            className={`flex-1 py-2 text-center ${activeTab === "tweets"
              ? "border-b-2 border-blue-500 text-blue-500 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-400"
              }`}
          >
            Tweets
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === "videos" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {channelVideos?.videos?.length > 0 ? (
                channelVideos.videos.map((video) => (
                  <div
                    key={video._id}
                    className="card bg-gray-100 dark:bg-gray-900 shadow-md dark:shadow-gray-700 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                    onClick={() => watchVideo(video._id)}
                  >
                    {/* ✅ Thumbnail Image */}
                    <figure className="relative h-24 sm:h-40 md:h-46 lg:h-52 w-full overflow-hidden">
                      <img
                        src={`${video.thumbnail}?q_auto=f_auto&w=300&h=200&c_fill&dpr=2`}
                        alt={video.title}
                        loading="lazy" // ✅ Load images faster
                        fetchPriority="high"
                        decoding="async"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <p className="absolute right-0 bottom-0 text-sm m-1 bg-white/70 dark:bg-black/70 text-gray-900 dark:text-white rounded-md px-1 py-0.5">
                        {`${video.duration} seconds`}
                      </p>
                    </figure>

                    {/* ✅ Video Info */}
                    <div className="card-body w-full sm:w-auto h-auto m-0 p-1.5 sm:p-2.5">
                      <h2 className="card-title text-lg sm:text-md font-semibold m-0 p-0 text-gray-900 dark:text-white">
                        {video.title}
                      </h2>
                      <div className="flex gap-0 m-0 justify-start">
                        <p className="m-0 text-sm text-gray-500 dark:text-gray-400 text-left">
                          {video.views} Views | {timeAgo(video.createdAt)}
                        </p>
                      </div>
                      <div className="flex gap-2 m-0 p-0">
                        <img src={video.owner.avatar} alt="Channel avatar" className="w-5 h-5 rounded-full" />
                        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-md m-0 p-0 truncate sm:whitespace-normal">
                          {video.owner.username}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">No videos available.</p> // ✅ Show message if no videos exist
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg">Tweet 1</div>
              <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg">Tweet 2</div>
              <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg">Tweet 3</div>
            </div>
          )}
        </div>

      </div>
    </Container>
  );
}

export default Channel;