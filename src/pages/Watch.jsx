import { useEffect, useState, useRef } from 'react';
import { useAuth, useUser, useVideo } from '../contexts';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading/Loading';
import SubscribeButton from '../components/ui/SubscribeButton/SubscribeButton.jsx';
import CommentSection from '../components/CommentSection/CommentSection.jsx';
import Container from '../components/layout/Container.jsx';
import { toast } from 'sonner';

function Watch() {
  const [video, setVideo] = useState(null);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false); // State to track if text is truncated
  const titleRef = useRef(null); // Ref for the title element

  const { loading: videoLoading, setLoading, timeAgo } = useVideo();
  const { videoId } = useParams();
  const [subscriptionChanged, setSubscriptionChanged] = useState(false);
  const { subscriptions = [] } = useUser();
  const { user, token } = useAuth();

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
    <Container className=''>


      {/* video player */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[minmax(800px,1fr)_400px] gap-4 lg:gap-8 ">
        <div className="flex flex-col ml-0">
          {/* Video Player */}
          <video
            src={video?.videoFile}
            className="w-full sm:max-w-5xl max-w-[90vw] md:max-w-[70vw] lg:max-w-[60vw] max-h-[80vh] rounded-none shadow-lg"
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
          <div className='sm:max-w-5xl max-w-[90vw] md:max-w-[70vw] lg:max-w-[60vw]'>
            <h2
              ref={titleRef}
              className={`text-xl sm:text-2xl font-bold ${isExpanded ? '' : 'line-clamp-2'} text-black dark:text-white mt-4 transition-all duration-300`}
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
            <p className="text-gray-600 dark:text-gray-400 text-sm">{timeAgo(video?.createdAt)}</p>
          </div>

          {/* Channel Info & Subscribe Button */}
          <div className="bg-gray-100 dark:bg-gray-800 h-auto w-full sm:max-w-5xl max-w-[90vw] md:max-w-[70vw] lg:max-w-[60vw] rounded-md my-2 p-1">
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
          <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-4 w-full sm:max-w-5xl max-w-[90vw] md:max-w-[70vw] lg:max-w-[60vw]">
            <h1 className="text-md text-black dark:text-white">Description</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 ml-4">{video?.description}</p>
          </div>
        </div>

        {/* Comments Section */}
        <div className=''>
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
    </Container>
  );
}

export default Watch;