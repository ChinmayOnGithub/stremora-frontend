import axios from 'axios';
import { useState, useEffect } from 'react';

function Home() {
  const [videos, setVideos] = useState([]); // Store videos only

  useEffect(() => {
    axios.get("http://localhost:8000/api/v1/video/get-video")
      .then((response) => {
        if (response.data.success) {
          setVideos(response.data.message); // Store only the video array
        }
      })
      .catch((error) => {
        console.error("Error fetching videos:", error);
      });
  }, []); // Dependency array ensures it runs only once

  return (
    <div>
      <h2>Total Videos: {videos.length}</h2>
      <div className="grid grid-cols-3 gap-4">
        {videos.map((video) => (
          <div key={video._id} className="border p-2">
            <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover" />
            <h3 className="text-lg font-semibold">{video.title}</h3>
            <p>{video.description}</p>
            <video src={video.videoFile} controls className="w-full"></video>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
