import React, { useEffect, useState } from 'react'
import useAuth from '../contexts/AuthContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Watch() {

  const { user, loading, setLoading } = useAuth();
  const { videoId } = useParams(); // ✅ Get video ID from URL
  const [video, setVideo] = useState(null);

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
          className="w-full max-w-4xl rounded-md shadow-lg"
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