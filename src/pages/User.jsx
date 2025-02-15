import { useState } from "react";
import useAuth from "../contexts/AuthContext"

function User() {
  const { user, loading, logout } = useAuth(); // ✅ Get loading state from context


  const [showModal, setShowModal] = useState(false);

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
    <div className="bg-stone-950 h-full shadow-xl w-full sm:w-3/4 mx-auto rounded-md">
      <div className="relative card h-auto">
        {user.coverImage ? (
          <img src={user.coverImage} alt="Cover" className="w-full h-32 sm:h-64 object-cover rounded-t-md" />
        ) : (
          <p className="text-center text-gray-400">No cover image</p>
        )}

        <div className="absolute bottom-0 left-20 transform -translate-x-1/2 translate-y-1/2 w-20 h-20 flex items-center">
          <img src={user.avatar} alt="User Avatar" className="h-32 w-32 rounded-md border-2 border-primary object-cover" />
          <div className="ml-4">
            <p className="text-lg font-bold">@{user.username}</p>
            <p className="text-gray-500">{user.fullname}</p>
          </div>
        </div>
        <button onClick={handleLogout} className='absolute right-0 m-4 btn btn-circle border-2 text-xl bg-amber-700 rounded-md'><img src="src/assets/logout.svg" alt="Logout" className="h-5 w-5" /></button>
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
