import { useEffect, useState } from "react";
import { useAuth, useVideo } from "../contexts";
import { MdLogout } from "react-icons/md";
import { FaPencil } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import {
  Logout,
  Container,
  VideoCard,
  ReusableTooltip,
  Button
} from "../components/index.js";
import useSubscriberCount from "../hooks/useSubscriberCount";

function User() {
  const { user, loading } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const { subscriberCount, countLoading } = useSubscriberCount(user?._id);
  const { userVideos, fetchVideos } = useVideo();

  const handleEdit = () => {
    navigate("/user/update-account");
  };

  useEffect(() => {
    if (!user?._id) return; // Guard clause if user is not available
    fetchVideos(1, 10, user._id); // Fetch videos for the user's channel
  }, [user?._id, fetchVideos]);

  const watchVideo = (videoId) => {
    navigate(`/watch/${videoId}`); // Redirect to watch page with video ID
  };

  const inspectChannel = (channelName) => {
    navigate(`/user/c/${channelName}`);
  };


  // Show skeleton loading effect while fetching user data
  if (loading) {
    return (
      <div className="flex flex-col items-center p-6">
        <div className="skeleton w-40 h-40 rounded-full"></div>
        <div className="skeleton w-32 h-4 mt-4"></div>
        <div className="skeleton w-24 h-4 mt-2"></div>
      </div>
    );
  }

  // If no user is found
  if (!user) {
    return <p className="text-center text-gray-500">No user found. Please log in.</p>;
  }

  return (
    <Container>
      <div className="max-w-8xl mx-0 mt-0 p-0">
        {/* User Card */}
        <div className="relative bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg shadow-lg overflow-hidden">
          {/* Cover Image */}
          <div className="relative h-36 sm:h-64">
            <img
              src={
                user.coverImage ||
                "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
              }
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </div>

          {/* User Info */}
          <div className="relative p-4 flex flex-col items-center -mt-12">
            {/* Avatar */}
            <img
              src={user.avatar}
              alt="User Avatar"
              className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white dark:border-gray-900 object-cover"
            />

            {/* User Details */}
            <h2 className="text-xl font-semibold mt-2">@{user.username}</h2>
            <p className="text-gray-600 dark:text-gray-400">{user.fullname}</p>
            <div className="flex items-center text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
              {countLoading ? (
                <div className="relative flex items-center">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-amber-500 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500"></span>
                </div>
              ) : (
                <p>{subscriberCount}</p>
              )}
              <span className="ml-1">Subscribers</span>
            </div>

            {/* Action Buttons */}
            <div className="sm:absolute sm:m-4 bottom-0 right-0 space-x-4 mt-4">
              {/* Edit Button */}
              <ReusableTooltip content="Edit your profile" side="bottom" align="center">
                <Button
                  variant={"secondary"}
                  onClick={handleEdit}
                  className="flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 transition rounded-md text-white shadow"
                >
                  <FaPencil className="mr-2" /> Edit Profile
                </Button>

              </ReusableTooltip>
            </div>
          </div>

          <ReusableTooltip content="View your profile as others see it" side="left" align="center">
            <div
              className="absolute w-12 h-12 top-0 right-0 text-center m-4 p-3 bg-black/40 text-white rounded-full shadow-lg cursor-pointer hover:bg-black/60 transition-colors"
              onClick={() => inspectChannel(user.username)}
            >
              👀
            </div>
          </ReusableTooltip>
        </div>

        {/* Playlist, Videos, and Liked Videos Sections */}
        <div className="mt-8 space-y-6">
          {/* My Videos Section */}
          <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 rounded-xl shadow-md">
            <h3 className="text-2xl font-semibold mb-4">My Videos</h3>
            {/* Display User Videos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {userVideos?.videos?.length > 0 ? (
                userVideos.videos.map((video) => (
                  <VideoCard
                    key={video._id}
                    video={video}
                    onClick={() => watchVideo(video._id)}
                  />
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic col-span-full text-center">
                  No videos available.
                </p>
              )}
            </div>
          </div>

          {/* My Playlists Section */}
          <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 rounded-xl shadow-md">
            <h3 className="text-2xl font-semibold mb-4">My Playlists</h3>
            {/* Display User Playlists */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {user.playlists?.length > 0 ? (
                user.playlists.map((playlist, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg"
                  >
                    <h4 className="text-lg font-semibold">{playlist.name}</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {playlist.description}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic col-span-full text-center">
                  No playlists available.
                </p>
              )}
            </div>
          </div>

          {/* Liked Videos Section */}
          <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 rounded-xl shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Liked Videos</h3>
            {/* Display User Liked Videos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {user.likedVideos?.length > 0 ? (
                user.likedVideos.map((video, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg"
                  >
                    <h4 className="text-lg font-semibold">{video.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {video.description}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic col-span-full text-center">
                  No liked videos available.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Show Logout Modal if triggered */}
        {showLogoutModal && <Logout onClose={() => setShowLogoutModal(false)} />}
      </div>
    </Container>
  );
}

export default User;