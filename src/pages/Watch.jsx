import { useEffect, useState } from 'react'
import useAuth from '../contexts/AuthContext';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading/Loading';
import SubscribeButton from '../components/SubscribeButton';
import useVideo from '../contexts/VideoContext';
import CommentSection from '../components/CommentSection';

function Watch() {

  // const { loading: authLoading, setLoading: setAuthLoading } = useAuth();
  const { loading: videoLoading, setLoading, timeAgo } = useVideo();
  const { videoId } = useParams(); // ✅ Get video ID from URL
  const [video, setVideo] = useState(null);

  const { user, token } = useAuth();




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



  if (videoLoading) return <Loading message="Video is Loading..." />;
  if (!video && !videoLoading) return <div className="text-center text-2xl p-10">Video not found</div>;


  return (
    <div className="container mx-auto p-6 bg-stone-950 h-full rounded-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[auto_500px] gap-6">
        <div className="flex flex-col ml-0 items">
          {/* ✅ Feature-Rich Video Player */}
          <video
            src={video.videoFile}
            className="w-full sm:max-w-4xl max-h-[60vh] rounded-md shadow-lg"
            controls
            autoPlay
            playsInline
            muted={true}  // Change to `true` if you want autoplay without user interaction
            preload="auto"
          >
            {/* ✅ Captions (If available) */}
            <track
              src="captions.vtt"
              kind="subtitles"
              srcLang="en"
              label="English Subtitles"
              default
            />

            Your browser does not support the video tag.
          </video>

          <h2 className="text-3xl font-bold text-white mt-4">{video.title}</h2>
          <p className='font-thin text-sm'>{timeAgo(video.createdAt)}</p>

          {/* Channel Info & subscribe button */}
          <div className='bg-gray-800/80 h-auto w-full sm:max-w-4xl rounded-md my-2 p-1'>
            <div className='flex m-3'>
              <Link to={`/user/c/${video.owner.username}`} className='flex'>
                <img src={video.owner.avatar} alt="Channel avatar" className='w-10 h-10 my-auto rounded-full object-cover' />
                <div className='ml-4 my-auto '>
                  <h2 className='text-2xl font-bold'>{video.owner.username}</h2>
                  <p className='text-sm text-white/70'>{video.owner.subscribers} Subscribers</p>
                </div>
              </Link>
              <div className='ml-auto my-auto'>
                <SubscribeButton channelId={video.owner._id} channelName={video.owner.username} />
              </div>
            </div>
          </div>

          {/* ✅ Video Description */}
          <div className='bg-gray-800/60 rounded-md p-4 max-w-4xl'>
            <h1 className='text-md'>Description</h1>

            <p className="text-gray-400 mt-2 ml-4">{video.description}</p></div>
        </div>

        {/* Comment display */}
        <div className=''>
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
    </div >
  );
}

export default Watch