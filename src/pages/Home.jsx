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
  }, []); // Dependency array ensures it runs only once


  const watchVideo = (videoId) => {
    navigate(`/watch/${videoId}`); // Redirect to watch page with video ID
  };


  return (
    <div className="container mx-auto p-6 bg-stone-950 w-full sm:w-3/4  h-full rounded-md">
      <h2 className="text-2xl font-bold mb-4">Total Videos: {videos.length}</h2>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div
            key={video._id}
            className="card bg-base-200 shadow-xl"
            onClick={() => watchVideo(video._id)} // ✅ Pass the video ID when clicked
          >
            {/* ✅ Thumbnail Image */}
            <figure className="h-40 overflow-hidden">
              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
            </figure>

            {/* ✅ Video Info */}
            <div className="card-body">
              <h3 className="card-title">{video.title}</h3>
              <p className="text-gray-500">{video.description}</p>

              {/* ✅ Video Player */}
              {/* <div className="mt-2">
                <video src={video.videoFile} controls className="w-full rounded-md" ></video>
              </div> */}

              {/* ✅ Action Buttons */}
              {/* <div className="card-actions justify-end mt-4"> */}
              {/* <button className="btn btn-primary">Watch</button>
                <button className="btn btn-outline">Save</button> */}
              {/* </div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
