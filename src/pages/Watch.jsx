import { useEffect, useState } from 'react'
import useAuth from '../contexts/AuthContext';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading/Loading';
import SubscribeButton from '../components/SubscribeButton';
import useVideo from '../contexts/VideoContext';
import CommentSection from '../components/CommentSection/CommentSection.jsx';
import Container from '../components/Container.jsx';
import useUser from '../contexts/UserContext.jsx';

function Watch() {

  // const { loading: authLoading, setLoading: setAuthLoading } = useAuth();
  const { loading: videoLoading, setLoading, timeAgo } = useVideo();
  const { videoId } = useParams(); // ✅ Get video ID from URL
  const [video, setVideo] = useState(null);
  const [subscriberCount, setSubscriberCount] = useState();
  const [subscriptionChanged, setSubscriptionChanged] = useState(false); // State to trigger effect
  const { subscriptions } = useUser();
  const { user, token } = useAuth();

  // get video by id
  useEffect(() => {
    setLoading(true);
    axios.get(
      `https://youtube-backend-clone.onrender.com/api/v1/video/get-video-by-id/${videoId}`
    ).then((res) => {
      if (res.data.success) {
        setVideo(res.data.message);
      }
    }).catch((err) => {
      console.error("Error fetching Video", err);
    }).finally(() => {
      setLoading(false) // a callback is needed inside the finally block too
    });
  }, [])

  useEffect(() => {
    if (!video || !video.owner?._id) {
      return
    }; // Prevent making request if video is not yet set

    axios.get(
      `https://youtube-backend-clone.onrender.com/api/v1/subscription/get-subscriber-count/${video.owner._id}`
    ).then((res) => {
      if (res.data.success) {
        setSubscriberCount(res.data.message.subscriberCount)
      }
    }).catch((err) => {
      console.error("Error fetching subscriber count", err);
    }).finally(() => {
      setLoading(false);
    });
  }, [video?.owner?._id, subscriptionChanged])



  if (videoLoading) return <Loading message="Video is Loading..." />;
  if (!video && !videoLoading) return <div className="text-center text-2xl p-10">Video not found</div>;


  return (
    <Container>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[auto_500px] gap-6">
        <div className="flex flex-col ml-0">
          {/* ✅ Video Player */}
          <video
            src={video.videoFile}
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
            <h2 className="text-3xl font-bold text-black dark:text-white mt-4">{video.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{timeAgo(video.createdAt)}</p>
          </div>

          {/* ✅ Channel Info & Subscribe Button */}
          <div className="bg-gray-100 dark:bg-gray-800 h-auto w-full sm:max-w-5xl max-w-[90vw] md:max-w-[70vw] lg:max-w-[60vw] rounded-md my-2 p-1">
            <div className="flex m-3">
              <Link to={`/user/c/${video.owner.username}`} className="flex">
                <img src={video.owner.avatar} alt="Channel avatar" className="w-10 h-10 my-auto rounded-full object-cover" />
                <div className="ml-4 my-auto">
                  <h2 className="text-2xl font-bold text-black dark:text-white">{video.owner.username}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{subscriberCount} Subscribers</p>
                </div>
              </Link>
              <div className="ml-auto my-auto">
                <SubscribeButton
                  channelId={video.owner._id}
                  channelName={video.owner.username}
                  isSubscribed={subscriptions.some(sub => sub.channelDetails._id === video.owner._id)} // ✅ Corrected
                  onSubscriptionChange={() => setSubscriptionChanged(prev => !prev)} // ✅ Corrected
                />
              </div>
            </div>
          </div>

          {/* ✅ Video Description */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-4 w-full sm:max-w-5xl max-w-[90vw] md:max-w-[70vw] lg:max-w-[60vw]">
            <h1 className="text-md text-black dark:text-white">Description</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 ml-4">{video.description}</p>
          </div>
        </div>

        {/* ✅ Comments Section */}
        <div>
          <CommentSection
            entityId={videoId}
            apiEndpoints={{
              getComments: "https://youtube-backend-clone.onrender.com/api/v1/comment/get-video-comments",
              addComment: "https://youtube-backend-clone.onrender.com/api/v1/comment/add-comment",
              updateComment: "https://youtube-backend-clone.onrender.com/api/v1/comment/update-comment",
              deleteComment: "https://youtube-backend-clone.onrender.com/api/v1/comment/delete-comment"
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

export default Watch