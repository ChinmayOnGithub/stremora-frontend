import { useEffect, useState } from 'react'
import useAuth from '../contexts/AuthContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Watch() {

  const { loading, setLoading } = useAuth();
  const { videoId } = useParams(); // ✅ Get video ID from URL
  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    axios.get(
      `https://youtube-backend-clone.onrender.com/api/v1/video/get-video-by-id/${videoId}`
    ).then((res) => {
      if (res.data.success) {
        setVideo(res.data.message);
        setLoading(false);
      }
    }).catch((err) => {
      console.error("Error fetching Video", err);
    })

    axios.get(
      `http://youtube-backend-clone.onrender.com/api/v1/users/${video.owner}`
    ).then((res) => {
      if (res.data.success) {
        setChannel(res.data.data)
      }
    })
  }, [])


  if (loading) return <div className="text-center text-2xl p-10">Loading...</div>;
  if (!video) return <div className="text-center text-2xl p-10">Video not found</div>;


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
            <img src="#" alt="Channel avatar" className='bg-amber-400 w-10 h-10 my-auto rounded-full' />
            <h2 className='ml-4 my-auto text-2xl'>Channel Name</h2>
          </div>
          <div>
            <p>Subscribers: </p>
          </div>
        </div>

        {/* ✅ Video Description */}
        <p className="text-gray-400 mt-4">{video.description}</p>
      </div>

      <div className='bg-gray-800 h-200'>
        Comments
      </div>
    </div>
  );
}

export default Watch