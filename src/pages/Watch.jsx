import { useEffect, useState, useRef } from 'react';
import { useAuth, useUser, useVideo } from '../contexts';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading/Loading';
import SubscribeButton from '../components/ui/SubscribeButton/SubscribeButton.jsx';
import CommentSection from '../components/CommentSection/CommentSection.jsx';
import { toast } from 'sonner';
import { useBackendCheck } from '../hooks/useBackendCheck';
import { BackendError } from '../components/BackendError';

function Watch() {
  const backendAvailable = useBackendCheck();
  const { videoId } = useParams();
  const { loading: videoLoading, setLoading, timeAgo } = useVideo();
  const { subscriptions = [] } = useUser();
  const { user, token } = useAuth();

  const [video, setVideo] = useState(null);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [subscriptionChanged, setSubscriptionChanged] = useState(false);

  const titleRef = useRef(null);
  const hasCountedView = useRef(false);

  useEffect(() => {
    const countView = async () => {
      if (!hasCountedView.current && videoId) {
        hasCountedView.current = true;
        await axios.put(`${import.meta.env.VITE_BACKEND_URI}/video/view/${videoId}`);
      }
    };
    countView();
  }, [videoId]);

  // Fetch video by ID
  useEffect(() => {
    setLoading(true);
    axios.get(
      `${import.meta.env.VITE_BACKEND_URI}/video/get-video-by-id/${videoId}`
    ).then((res) => {
      if (res.data.success) {
        setVideo(res.data.message);
      }
    }).catch((err) => {
      console.error("Error fetching Video", err);
      toast.error("Failed to load video. Please try again.");
    }).finally(() => {
      setLoading(false);
    });
  }, [videoId]);

  // Fetch subscriber count
  useEffect(() => {
    if (!video || !video.owner?._id) return;

    axios.get(
      `${import.meta.env.VITE_BACKEND_URI}/subscription/get-subscriber-count/${video.owner._id}`
    ).then((res) => {
      if (res.data.success) {
        setSubscriberCount(res.data.message.subscriberCount);
      }
    }).catch((err) => {
      console.error("Error fetching subscriber count", err);
    }).finally(() => {
      setLoading(false);
    });
  }, [video?.owner?._id, subscriptionChanged]);

  // Check if the text is truncated
  useEffect(() => {
    if (titleRef.current) {
      const isOverflowing = titleRef.current.scrollHeight > titleRef.current.clientHeight;
      setIsTruncated(isOverflowing);
    }
  }, [video?.title]);

  if (videoLoading) return <Loading message="Video is Loading..." />;
  if (!video && !videoLoading) return <div className="text-center text-2xl p-10">Video not found</div>;

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-gray-50 dark:bg-gray-900">


      {/* video player */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4 lg:gap-8 ">
        <div className="flex flex-col ml-0">
          {/* Video Player */}
          <video
            // ref={videoRef}
            src={video?.videoFile}
            className="w-full max-h-[80vh] rounded-none shadow-lg bg-black"
            controls
            autoPlay
            playsInline
            muted
            preload="auto"
          >
            <track src="captions.vtt" kind="subtitles" srcLang="en" label="English Subtitles" default />
            Your browser does not support the video tag.
          </video>

          {/* Video Info */}
          <div className='w-full'>
            <h2
              ref={titleRef}
              className={`text-xl sm:text-2xl font-bold ${isExpanded ? '' : 'line-clamp-2'} text-black dark:text-white mt-4 mb-2`}
            >
              {video?.title}
            </h2>
            {/* Conditionally render the "more/less" toggle */}
            {isTruncated && (
              <span
                onClick={() => setIsExpanded(prev => !prev)}
                className="cursor-pointer text-blue-500/60"
              >
                {isExpanded ? 'less' : 'more'}
              </span>
            )}
          </div>

          {/* Channel Info & Subscribe Button */}
          <div className="bg-gray-200 dark:bg-gray-800 h-auto w-full rounded-md my-2 p-1">
            <div className="flex m-3">
              <Link to={`/user/c/${video?.owner?.username}`} className="flex">
                <img
                  src={video?.owner?.avatar}
                  alt={`${video?.owner?.username}'s avatar`}
                  className="w-10 h-10 my-auto rounded-full object-cover"
                />
                <div className="ml-4 my-auto">
                  <h2 className="text-2xl font-bold text-black dark:text-white">{video?.owner?.username}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{subscriberCount} Subscribers</p>
                </div>
              </Link>
              <div className="ml-auto my-auto">
                <SubscribeButton
                  channelId={video?.owner?._id}
                  channelName={video?.owner?.username}
                  isSubscribed={subscriptions?.some(sub => sub.channelDetails._id === video.owner._id) || false}
                  onSubscriptionChange={() => setSubscriptionChanged(prev => !prev)}
                />
              </div>
            </div>
          </div>



          {/* Video Description */}
          {/* max-w-[90vw] md:max-w-[70vw] lg:max-w-[60vw] xl:max-w-[800px] */}
          <section className="bg-gray-100/80 dark:bg-gray-800/90 rounded-lg p-4 sm:p-6 w-full
          transition-colors duration-300">
            {/* Metadata Row */}
            <div className="flex items-center gap-3 mb-4 px-2 py-1.5 bg-gray-200/50 dark:bg-gray-900/60 rounded-full w-fit transition-colors duration-300">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {video.views} Views
                </span>
                <span className="text-gray-400 dark:text-gray-500 text-xs">•</span>
                <time className="text-sm text-gray-600 dark:text-gray-400">
                  {timeAgo(video?.createdAt)}
                </time>
              </div>
            </div>

            {/* Description Section */}
            <article className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Description
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base pl-2 border-l-4 border-gray-300/50 dark:border-gray-600/50">
                {video?.description || "No description available"}
              </p>
            </article>
          </section>
        </div>

        {/* Comments Section */}
        
          <CommentSection
            entityId={videoId}
            apiEndpoints={{
              getComments: `${import.meta.env.VITE_BACKEND_URI}/comment/get-video-comments`,
              addComment: `${import.meta.env.VITE_BACKEND_URI}/comment/add-comment`,
              updateComment: `${import.meta.env.VITE_BACKEND_URI}/comment/update-comment`,
              deleteComment: `${import.meta.env.VITE_BACKEND_URI}/comment/delete-comment`
            }}
            parentType={"Video"}
            user={user}
            token={token}
          />
      </div>
    </div>
  );
}

export default Watch;