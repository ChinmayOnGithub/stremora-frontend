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
            <figure className="relative h-20 sm:h-40 md:h-52 lg:h-60 w-full overflow-hidden">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover rounded-lg"
              />
              <p className='absolute right-0 bottom-0 text-sm m-1 bg-gray-800/70 rounded-md px-1 py-0.5'>{video.duration} seconds</p>
            </figure>


            {/* ✅ Video Info */}
            <div className="card-body w-full sm:w-auto h-auto m-0 p-2 sm:p-4">
              <h3 className="card-title text-base sm:text-lg font-semibold m-0 p-0">
                {video.title}
              </h3>
              <p>Views: {video.views}</p>
              <div className='flex gap-2'>
                <img src={video.owner.avatar} alt="Channel avatar" className='w-5 h-5 rounded-full' />
                <p className="text-gray-500 text-sm sm:text-md m-0 p-0 truncate sm:whitespace-normal">
                  {video.owner.username}
                </p>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
