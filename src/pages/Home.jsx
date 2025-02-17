import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [videos, setVideos] = useState([]); // Store videos only
  const navigate = useNavigate(); // ✅ React Router Navigation Hook


  useEffect(() => {
    axios.get("https://youtube-backend-clone.onrender.com/api/v1/video/get-video")
      .then((response) => {
        if (response.data.success) {
          setVideos(response.data.message); // Store only the video array
        }
      })
      .catch((error) => {
        console.error("Error fetching videos:", error);
      });
  }, [videos.length]); // Dependency array ensures it runs only once


  const watchVideo = (videoId) => {
    navigate(`/watch/${videoId}`); // Redirect to watch page with video ID
  };


  return (
    <div className="container mx-auto p-4 sm:p-6 bg-stone-950 w-full sm:w-6/7  h-full rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-white">Total Videos: {videos.length}</h2>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((video) => (
          <div
            key={video._id}
            className="card bg-base-200 shadow-xl hover:shadow-white/10 hover:scale-[1.02] transition-all duration-200 cursor-pointer"
            onClick={() => watchVideo(video._id)} // ✅ Pass the video ID when clicked
          >
            {/* ✅ Thumbnail Image */}
            <figure className="h-20 sm:h-50 overflow-hidden">
              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
            </figure>

            {/* ✅ Video Info */}
            <div className="card-body sm:w-full">
              <h3 className="card-title">{video.title}</h3>
              <p className="text-gray-500">{video.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
