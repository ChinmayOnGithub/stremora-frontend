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
      {/* Full-width Banner */}
      <div className="relative w-full h-40 sm:h-56 bg-gradient-to-br from-amber-100/60 to-amber-300/40 dark:from-gray-800 dark:to-gray-900 overflow-hidden mb-20">
        <img
          src={user.coverImage || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"}
          alt="Cover"
          className="w-full h-full object-cover object-center"
        />
        {/* Avatar - Overlapping bottom edge, fully visible */}
        <img
          src={user.avatar}
          alt="User Avatar"
          className="absolute left-1/2 -bottom-14 transform -translate-x-1/2 h-28 w-28 sm:h-32 sm:w-32 rounded-full border-4 border-white dark:border-gray-900 object-cover shadow-lg bg-white z-20"
        />
        {/* View as public button */}
        <ReusableTooltip content="View your profile as others see it" side="left" align="center">
          <div
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-black/40 text-white rounded-lg shadow-lg cursor-pointer hover:bg-black/60 transition-colors border border-white/30 backdrop-blur-md z-30"
            onClick={() => navigate(`/user/c/${user.username}`)}
          >
            👀
          </div>
        </ReusableTooltip>
      </div>

      {/* Main content container */}
      <div className="w-full max-w-5xl mx-auto px-2 sm:px-6 lg:px-8">
        {/* User info and actions row */}
        <div className="flex flex-col sm:flex-row items-center justify-between -mt-12 mb-8 gap-4">
          <div className="flex flex-col items-center sm:items-start">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">@{user.username}</h2>
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
                className="flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 transition rounded-lg text-white shadow-md text-base font-semibold"
              >
                <FaPencil className="mr-2" /> Edit Profile
              </Button>
            </ReusableTooltip>
            <ReusableTooltip content="Logout" side="bottom" align="center">
              <Button
                variant={"secondary"}
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition rounded-lg text-gray-800 dark:text-white shadow-md text-base font-semibold"
              >
                <MdLogout className="mr-2" /> Logout
              </Button>
            </ReusableTooltip>
          </div>
        </div>

        {/* My Videos Section */}
        <section className="bg-white/95 dark:bg-gray-900/95 text-gray-900 dark:text-white p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 mb-8">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 tracking-tight">My Videos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {userVideos?.videos?.length > 0 ? (
              userVideos.videos.map((video) => (
                <VideoCard
                  key={video._id}
                  video={video}
                  onClick={() => navigate(`/watch/${video._id}`)}
                />
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic col-span-full text-center text-base">
                No videos available.
              </p>
            )}
          </div>
        </section>

        {/* My Playlists Section */}
        <section className="bg-white/95 dark:bg-gray-900/95 text-gray-900 dark:text-white p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 mb-8">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 tracking-tight">My Playlists</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {user.playlists?.length > 0 ? (
              user.playlists.map((playlist, index) => (
                <div
                  key={index}
                  className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700"
                >
                  <h4 className="text-base font-semibold mb-1">{playlist.name}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {playlist.description}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic col-span-full text-center text-base">
                No playlists available.
              </p>
            )}
          </div>
        </section>

        {/* Liked Videos Section */}
        <section className="bg-white/95 dark:bg-gray-900/95 text-gray-900 dark:text-white p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 tracking-tight">Liked Videos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {user.likedVideos?.length > 0 ? (
              user.likedVideos.map((video, index) => (
                <div
                  key={index}
                  className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700"
                >
                  <h4 className="text-base font-semibold mb-1">{video.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {video.description}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic col-span-full text-center text-base">
                No liked videos available.
              </p>
            )}
          </div>
        </section>

        {/* Show Logout Modal if triggered */}
        {showLogoutModal && <Logout onClose={() => setShowLogoutModal(false)} />}
      </div>
    </>
  );
}

export default User;