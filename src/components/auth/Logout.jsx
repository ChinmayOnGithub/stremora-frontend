import { useAuth, useUser, useVideo } from "../../contexts";

function Logout({ onClose }) {
  const { logout } = useAuth();

  const handleConfirmLogout = () => {
    logout(); // Log the user out
    onClose(); // Close the modal after logout
  };

  return (
    <div className="z-101 fixed inset-0 flex items-center justify-center bg-black/40 bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-black dark:text-white shadow-lg w-80 text-center">
        <h2 className="text-xl font-bold">Confirm Logout</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Are you sure you want to log out?</p>
        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmLogout}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Logout;
