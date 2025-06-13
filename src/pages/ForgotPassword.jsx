import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components";
import { FaEnvelope } from "react-icons/fa";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
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
    <div className="min-h-full flex-1 flex items-center justify-center bg-gray-100 dark:bg-black transition-all px-4 py-2 relative overflow-hidden">
      {/* Background Elements - Only visible on mobile */}
      <div className="absolute inset-0 md:hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-amber-600/20 via-amber-500/20 to-amber-400/20"
          style={{
            backgroundSize: '200% 200%',
            animation: 'gradientMove 15s ease infinite'
          }}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(251,191,36,0.1),rgba(251,191,36,0))]"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl"></div>
      </div>

      <style>
        {`
          @keyframes gradientMove {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}
      </style>

      <div className="w-full max-w-2xl overflow-hidden rounded-lg shadow-lg transition-all duration-300 dark:shadow-gray-800/20 sm:grid md:grid-cols-[0.8fr_1.4fr] relative z-10">
        {/* Left Section - Welcome Back */}
        <div className="relative hidden overflow-hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-700 to-amber-600 dark:from-amber-800 dark:to-amber-700">
          </div>

          <div className="relative flex h-full flex-col justify-between p-8">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-white mb-4">
                Forgot your
                <br />
                <span className="text-amber-100">password?</span>
              </h1>
            </div>

            <div className="relative rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <div className="flex flex-col items-center justify-center space-y-4 py-2">
                <img 
                  src="/face-id-sad.svg" 
                  alt="Sad face" 
                  className="h-16 w-16"
                />
                <p className="text-md font-medium text-white/80 text-center">
                  Enter your email and we'll send you a reset link
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Forgot Password Form */}
        <div className="relative bg-background/80 backdrop-blur-sm md:bg-background md:backdrop-blur-none p-8 dark:bg-gray-900/80 md:dark:bg-gray-900">
          {/* Mobile Welcome Text */}
          <div className="md:hidden mb-6 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-amber-500">
                <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground dark:text-white">
              Forgot your <span className="text-amber-500">password?</span>
            </h2>
          </div>

          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-500/80 dark:text-gray-400/80 mb-2"
              >
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400 group-focus-within:text-amber-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300/50 dark:border-gray-700/50 bg-white/5 dark:bg-gray-800/5 backdrop-blur-sm pl-10 pr-4 py-3.5 text-gray-900 dark:text-gray-100 placeholder-gray-500/70 focus:border-white/30 focus:ring-2 focus:ring-white/10 focus:outline-none transition-all duration-300 text-base"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              variant="amber"
              className="w-full font-medium py-3 transition-all text-base"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>

            {message && (
              <div
                className={`text-center text-sm ${
                  message.includes("Failed")
                    ? "text-red-500 dark:text-red-400"
                    : "text-green-500 dark:text-green-400"
                }`}
              >
                {message}
              </div>
            )}
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm sm:text-base text-muted-foreground dark:text-gray-400">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-medium text-amber-500 underline-offset-4 hover:underline dark:text-amber-400"
              >
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;