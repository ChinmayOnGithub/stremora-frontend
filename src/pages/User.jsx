import { useEffect, useState } from "react";
import { useAuth, useVideo } from "../contexts";
import { MdLogout } from "react-icons/md";
import { FaPencil } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import {
  Logout,
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

  useEffect(() => {
    if (!user?._id) return;
    fetchVideos(1, 10, user._id);
  }, [user?._id, fetchVideos]);

  if (loading) {
    return (
      <div className="flex flex-col items-center p-8 gap-6">
        <div className="skeleton w-40 h-40 rounded-full"></div>
        <div className="skeleton w-32 h-4 mt-4"></div>
        <div className="skeleton w-24 h-4 mt-2"></div>
      </div>
    );
  }

  if (!user) {
    return <p className="text-center text-gray-500">No user found. Please log in.</p>;
  }

  return (
    <>
      {/* Profile Banner & Avatar */}
      <div className="relative w-full h-40 sm:h-56 bg-gradient-to-br from-amber-100/60 to-amber-300/40 dark:from-gray-800 dark:to-gray-900 flex items-end mb-0">
        <img
          src={user.coverImage || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"}
          alt="Cover"
          className="w-full h-full object-cover object-center absolute inset-0"
        />
        <div className="absolute left-1/2 z-20" style={{ bottom: '-3.5rem', transform: 'translateX(-50%)' }}>
          <img
            src={user.avatar}
            alt="User Avatar"
            className="h-32 w-32 sm:h-36 sm:w-36 rounded-full border-4 border-white dark:border-gray-900 object-cover shadow-xl bg-white"
          />
          <ReusableTooltip content="View your profile as others see it" side="left" align="center">
            <div
              className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center bg-black/40 text-white rounded-full shadow cursor-pointer hover:bg-black/60 transition-colors border border-white/30 backdrop-blur-md z-30"
              onClick={() => navigate(`/user/c/${user.username}`)}
              style={{ right: '-1.5rem', top: '0.5rem' }}
            >
              👀
            </div>
          </ReusableTooltip>
        </div>
      </div>

      {/* Main content container */}
      <div className="w-full max-w-5xl mx-auto px-2 sm:px-6 lg:px-8 mt-24">
        {/* User info and actions row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex flex-col items-center sm:items-start">
            <h2 className="text-2xl font-bold tracking-tight">@{user.username}</h2>
            <p className="text-gray-600 dark:text-gray-400 text-base">{user.fullname}</p>
            <div className="flex items-center text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
              {countLoading ? (
                <div className="relative flex items-center">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-amber-500 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500"></span>
                </div>
              ) : (
                <span className="font-semibold">{subscriberCount}</span>
              )}
              <span className="ml-2">Subscribers</span>
            </div>
          </div>
          <div className="flex flex-row gap-3">
            <ReusableTooltip content="Edit your profile" side="bottom" align="center">
              <Button
                variant={"secondary"}
                onClick={() => navigate("/user/update-account")}
                className="flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 transition rounded-md text-white shadow text-base font-semibold"
              >
                <FaPencil className="mr-2" /> Edit Profile
              </Button>
            </ReusableTooltip>
            <ReusableTooltip content="Logout" side="bottom" align="center">
              <Button
                variant={"secondary"}
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition rounded-md text-gray-800 dark:text-white shadow text-base font-semibold"
              >
                <MdLogout className="mr-2" /> Logout
              </Button>
            </ReusableTooltip>
          </div>
        </div>

        {/* My Videos Section */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold mb-4 tracking-tight">My Videos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {userVideos?.length > 0 ? (
              userVideos.map((video) => (
                <VideoCard
                  key={video._id}
                  video={video}
                  onClick={() => navigate(`/watch/${video._id}`)}
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
        <div className="mb-10">
          <h3 className="text-2xl font-bold mb-4 tracking-tight">My Playlists</h3>
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
        <div className="mb-10">
          <h3 className="text-2xl font-bold mb-4 tracking-tight">Liked Videos</h3>
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

        {/* Show Logout Modal if triggered */}
        {showLogoutModal && <Logout onClose={() => setShowLogoutModal(false)} />}
      </div>
    </>
  );
}

export default User;