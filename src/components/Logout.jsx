import useAuth from "../contexts/AuthContext";

function Logout({ onClose }) {
  const { logout } = useAuth();

  const handleConfirmLogout = () => {
    logout(); // Log the user out
    onClose(); // Close the modal after logout
  };

  return (
    <div className="z-101 fixed inset-0 flex items-center justify-center bg-black/40 bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg text-black shadow-lg w-80 text-center">
        <h2 className="text-xl font-bold">Confirm Logout</h2>
        <p className="mt-2 text-gray-600">Are you sure you want to log out?</p>
        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmLogout}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Logout;
