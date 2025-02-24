import { useState } from "react";
import useAuth from "../contexts/AuthContext.jsx";
import { MdLogout } from "react-icons/md";
import { FaPencil } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Logout from "../components/Logout";
import Container from "../components/Container.jsx";  // Assuming you have this component
import useSubscriberCount from "../hooks/useSubscriberCount";

function User() {
  const { user, loading } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const { subscriberCount, countLoading } = useSubscriberCount(user?._id);


  const handleEdit = () => {
    navigate("/user/update-account");
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
      <div className="max-w-7xl mx-auto mt-0 p-4">
        {/* User Card */}
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl shadow-lg overflow-hidden relative">
          {/* Cover Image */}
          <div className="relative h-36 sm:h-60">
            <img
              src={user.coverImage || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </div>

          {/* User Info */}
          <div className="p-4 flex flex-col items-center relative -mt-12">
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
            <div className="flex space-x-4 mt-4">
              {/* Edit Button */}
              <button
                onClick={handleEdit}
                className="flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 transition rounded-md text-white shadow"
              >
                <FaPencil className="mr-2" /> Edit Profile
              </button>

              {/* Logout Button */}
              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 transition rounded-md text-white shadow"
              >
                <MdLogout className="mr-2" /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Playlist, Videos, and Liked Videos Sections */}
        <div className="mt-8 space-y-6">
          <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 rounded-xl shadow-md">
            <h3 className="text-2xl font-semibold mb-4">My Playlists</h3>
            {/* Display User Playlists */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Example Playlist Items */}
              {user.playlists?.map((playlist, index) => (
                <div key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold">{playlist.name}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{playlist.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 rounded-xl shadow-md">
            <h3 className="text-2xl font-semibold mb-4">My Videos</h3>
            {/* Display User Videos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Demo Video Items */}
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold">Demo Video {index + 1}</h4>
                  <p className="text-gray-600 dark:text-gray-400">Description for demo video {index + 1}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 rounded-xl shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Liked Videos</h3>
            {/* Display User Liked Videos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Demo Liked Video Items */}
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold">Liked Video {index + 1}</h4>
                  <p className="text-gray-600 dark:text-gray-400">Description for liked video {index + 1}</p>
                </div>
              ))}
            </div>
          </div>

          {/* History Section */}
          <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 rounded-xl shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Watch History</h3>
            {/* Display User History */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Demo History Items */}
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold">History Item {index + 1}</h4>
                  <p className="text-gray-600 dark:text-gray-400">Description for history item {index + 1}</p>
                </div>
              ))}
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
