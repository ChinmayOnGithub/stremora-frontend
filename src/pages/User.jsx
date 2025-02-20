import { useState } from "react";
import useAuth from "../contexts/AuthContext"
import { MdLogout } from "react-icons/md";
import { FaPencil } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";


function User() {
  const { user, loading, logout } = useAuth(); // ✅ Get loading state from context

  // For the confirmation of Logout.
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    setShowModal(true); // Show confirmation modal
  };
  const confirmLogout = () => {
    logout(); // Call the logout function
    setShowModal(false); // Close the modal
  };
  const cancelLogout = () => {
    setShowModal(false); // Just close the modal
  };

  const handleEdit = () => {
    navigate('/user/update-account')
  }


  if (loading) {
    return (
      <div className="flex flex-col items-center p-6">
        <div className="skeleton w-40 h-40 rounded-full"></div>
        <div className="skeleton w-32 h-4 mt-4"></div>
        <div className="skeleton w-24 h-4 mt-2"></div>
      </div>
    ); // ✅ Show loading skeleton
  }

  if (!user) {
    console.log("No user found");
    return <p>No user found. Please log in.</p>; // ✅ Handle case when user is null
  }

  return (
    <div className="container mx-auto bg-stone-950 w-full sm:w-6/7  h-full rounded-md">
      {/* Cover Image */}
      <div className="relative card h-auto">
        {user.coverImage ? (
          <img
            src={user.coverImage}
            alt="Cover"
            className="w-full h-32 sm:h-64 object-cover rounded-t-md" />
        ) : (
          <p
            className="text-center text-gray-400">
            No cover image
          </p>
        )}

        {/* Avatar */}
        <div className="absolute bottom-0 left-20 transform -translate-x-1/2 translate-y-1/2 w-20 h-20 flex items-center">
          {/* Avatar Image */}
          <img
            src={user.avatar}
            alt="User Avatar"
            className="h-25 w-25 rounded-md border-2 border-primary object-cover object-center" />
          {/* Username */}
          <div className="ml-4">
            <p className="text-lg font-bold">@{user.username}</p>
            <p className="text-gray-500">{user.fullname}</p>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className='absolute right-0 m-4 btn btn-circle drop-shadow-2xl border-0 text-xl bg-amber-700 rounded-md'>
          <MdLogout size={28} color="white" />
        </button>

        {/* Edit info button */}
        <button
          onClick={handleEdit}
          className='absolute right-0 bottom-0 m-4 btn btn-circle drop-shadow-2xl border-0 text-xl bg-amber-700 rounded-md'>
          <FaPencil
            size={28} color="white"
          />

        </button>

        {/* Confirmation for LOGOUT */}
        {showModal && (

          <div className="relative flex justify-center">
            <div className="absolute z-11 mx-auto bg-white p-6 rounded-lg text-black shadow-lg">
              <h2 className="text-xl font-bold">Confirm Logout</h2>
              <p className="mt-2">Are you sure you want to logout?</p>
              <div className="mt-4 flex justify-end space-x-4">
                <button onClick={cancelLogout} className="btn btn-outline">Cancel</button>
                <button onClick={confirmLogout} className="btn btn-primary bg-red-600">Logout</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default User;
