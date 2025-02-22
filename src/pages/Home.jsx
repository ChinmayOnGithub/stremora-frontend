import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading/Loading';
import useVideo from '../contexts/VideoContext';
import Pagination from '../components/Pagination';
import { useEffect, useState } from 'react';
import "../index.css"
import Container from '../components/Container.jsx';


function Home() {
  // const [videos, setVideos] = useState([]); // Store videos only
  const navigate = useNavigate(); // ✅ React Router Navigation Hook
  const { videos, loading: videoLoading, error, timeAgo, fetchVideos } = useVideo();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);


  useEffect(() => {
    fetchVideos(page, limit);  // ✅ Pass the page number when calling the function
  }, [page]);


  const watchVideo = (videoId) => {
    navigate(`/watch/${videoId}`); // Redirect to watch page with video ID
  };


  if (videoLoading) {
    return <Loading message="videos are Loading..." />
  }


  return (
    <div>
      {/* ✅ Container with light/dark mode support */}
      <Container>
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Total Videos: {videos.totalVideosCount}
          <span className='font-normal text-gray-500 dark:text-gray-400 italic text-sm'>(Only showing displayed videos)</span>
        </h2>

        {/* ✅ Grid layout for videos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.videos.map((video) => (
            <div
              key={video._id}
              className="card bg-gray-100 dark:bg-gray-900 shadow-md dark:shadow-gray-700 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer"
              onClick={() => watchVideo(video._id)}
            >
              {/* ✅ Thumbnail Image */}
              <figure className="relative h-24 sm:h-40 md:h-46 lg:h-52 w-full overflow-hidden">
                <img
                  src={`${video.thumbnail}?q_auto=f_auto&w=300&h=200&c_fill&dpr=2`}
                  alt={video.title}
                  loading='lazy' // ✅ Load images faster
                  fetchPriority='high'
                  decoding='async'
                  className="w-full h-full object-cover rounded-lg"
                />
                <p className='absolute right-0 bottom-0 text-sm m-1 bg-white/70 dark:bg-black/70 text-gray-900 dark:text-white rounded-md px-1 py-0.5'>
                  {`${video.duration} seconds`}
                </p>
              </figure>

              {/* ✅ Video Info */}
              <div className="card-body w-full sm:w-auto h-auto m-0 p-1.5 sm:p-2.5">
                <h2 className="card-title text-lg sm:text-md font-semibold m-0 p-0 text-gray-900 dark:text-white">
                  {video.title}
                </h2>
                <div className='flex gap-0 m-0 justify-start'>
                  <p className='m-0 text-sm text-gray-500 dark:text-gray-400 text-left'>
                    {video.views} Views | {timeAgo(video.createdAt)}
                  </p>
                </div>
                <div className='flex gap-2 m-0 p-0'>
                  <img src={video.owner.avatar} alt="Channel avatar" className='w-5 h-5 rounded-full' />
                  <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-md m-0 p-0 truncate sm:whitespace-normal">
                    {video.owner.username}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container >


      {/* ✅ Pagination Component */}
      < div className='w-auto mx-4' >
        <Pagination currentPage={page} totalPages={100} setPage={setPage} />
      </ div>
    </div>
  );
}

export default Home;
