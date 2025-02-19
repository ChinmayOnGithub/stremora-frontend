import { useEffect, useState } from 'react'
import useAuth from '../contexts/AuthContext';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading/Loading';

function Watch() {

  const { loading, setLoading } = useAuth();
  const { videoId } = useParams(); // ✅ Get video ID from URL
  const [video, setVideo] = useState(null);
  const [subscribed, setSubscribed] = useState(false);

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


  if (loading) return <Loading />;
  if (!video && !loading) return <div className="text-center text-2xl p-10">Video not found</div>;



  const handleSubscribeToggle = () => {
    setSubscribed(!subscribed);
  }


  return (
    <div className="container mx-auto p-6 bg-stone-950 min-h-screen rounded-md">
      <h2 className="text-3xl font-bold text-white mb-4">{video.title}</h2>
      <div className="flex flex-col ml-0 ">
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

        {/* Channel Info & subscribe button */}
        <div className='bg-gray-800 h-auto w-full sm:max-w-4xl rounded-md my-4 p-2'>
          <div className='flex m-3'>
            <Link to={`/user/c/${video.owner.username}`}>
              <img src={video.owner.avatar} alt="Channel avatar" className='w-10 h-10 my-auto rounded-full object-cover' />
              <div className='ml-4 my-auto '>
                <h2 className='text-2xl font-bold'>{video.owner.username}</h2>
                <p className='text-sm text-white/70'>{video.owner.subscribers} Subscribers</p>
              </div>
            </Link>
            <button
              onClick={handleSubscribeToggle}
              className="btn bg-gray-900 text-white font-medium rounded-full px-5 py-2 shadow-md hover:bg-gray-700 hover:shadow-lg transition-all duration-300 ml-auto my-auto">
              {subscribed ?
                "Unsubscribe" : "Subscribe"
              }
            </button>


          </div>

        </div>

        {/* ✅ Video Description */}
        <p className="text-gray-400 mt-4">{video.description}</p>
      </div>

      <div className='bg-gray-800 h-200'>
        Comments
      </div>
    </div >
  );
}

export default Watch