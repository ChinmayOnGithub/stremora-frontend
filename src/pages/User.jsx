import { useState } from "react";
import useAuth from "../contexts/AuthContext";
import { MdLogout } from "react-icons/md";
import { FaPencil } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container";
import Logout from "../components/Logout"; // Import the Logout component

function User() {
  const { user, loading } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate("/user/update-account");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center p-6">
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
    <Container>
      {/* Cover Image */}
      <div className="relative card h-auto">
        <img
          src={user.coverImage || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"}
          alt="Cover"
          className="w-full h-32 sm:h-64 object-cover rounded-t-md"
        />

        {/* Avatar */}
        <div className="absolute bottom-0 left-20 transform -translate-x-1/2 translate-y-1/2 object-cover w-20 h-20 flex items-center">
          <img
            src={user.avatar}
            alt="User Avatar"
            className="h-20 w-20 rounded-md border-2 border-primary object-cover object-center"
          />
          <div className="ml-4">
            <p className="text-lg font-bold">@{user.username}</p>
            <p className="text-gray-500">{user.fullname}</p>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="absolute right-0 m-4 btn btn-circle drop-shadow-2xl border-0 text-xl bg-amber-600 rounded-md"
        >
          <MdLogout size={28} color="white" />
        </button>

        {/* Edit Info button */}
        <button
          onClick={handleEdit}
          className="absolute right-0 bottom-0 m-4 btn btn-circle drop-shadow-2xl border-0 text-xl bg-amber-600 rounded-md"
        >
          <FaPencil size={28} color="white" />
        </button>
      </div>

      {/* Show Logout Modal if triggered */}
      {showLogoutModal && <Logout onClose={() => setShowLogoutModal(false)} />}
    </Container>
  );
}

export default User;
