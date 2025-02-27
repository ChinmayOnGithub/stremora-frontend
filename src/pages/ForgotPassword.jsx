import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Container.jsx";

function ForgotPassword() {
  const [email, setEmail] = useState(""); // State for email/username
  const [loading, setLoading] = useState(false); // Loading state
  const [message, setMessage] = useState(""); // Success/error message
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Simulate an API call to send a password reset link
      console.log("Sending password reset link to:", email);

      // Simulate a delay for the API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // On success
      setMessage("Password reset link sent to your email!");
      setEmail(""); // Clear the input
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to send password reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="flex justify-center items-center min-h-screen">
      <div className="card min-w-[200px] w-fit sm:w-96 shadow-xl p-6 bg-gray-100 dark:bg-gray-800 transition-all duration-300">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Forgot Password
        </h2>

        <form onSubmit={handleForgotPassword} className="flex flex-col justify-center items-center gap-4 mt-4">
          <input
            type="text"
            placeholder="Email or Username"
            required={true}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />

          <button
            type="submit"
            className="btn border-1 w-full bg-amber-500 hover:bg-amber-400 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300 dark:bg-amber-600 dark:hover:bg-amber-700"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Success/Error Message */}
        {message && (
          <p className={`mt-4 text-center ${message.includes("Failed") ? "text-red-500" : "text-green-500"}`}>
            {message}
          </p>
        )}

        <div className="mt-4 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-semibold dark:text-amber-100 hover:text-amber-500"
            >
              Login
            </Link>
          </p>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        )}
      </div>
    </Container>
  );
}

export default ForgotPassword;