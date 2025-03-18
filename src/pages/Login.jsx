// import React from 'react'
// import { useEffect } from 'react';
import axios from 'axios'
import { useAuth } from '../contexts'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import {
  Button,
  Container
} from '../components';

function Login() {
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [identifier, setIdentifier] = useState(""); // either username or email
  const [loading, setLoading] = useState(false); // Local loading state

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!password) {
      setLoading(false);
      return
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/users/login`,
        { identifier, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          }
        } // Important
      );

      const { accessToken, refreshToken } = res.data.data;
      login(accessToken, refreshToken); // Save accessToken & refreshToken

      // once the login is successful redirect to home page
      toast.success("User logged in successfully!", {
        description: "Welcome back!",
        duration: 3000,
      });

      setTimeout(() => navigate("/"), 0); // Wait 3s before redirecting


    } catch (error) {
      if (error.response) {
        // Axios error for status 400, 401, 404, etc.
        toast.error("Login Failed ❌", {
          description: error.response?.data?.message || "Something went wrong.",
        });
      } else if (error.request) {
        // Request sent but no response received (server down, network issue)
        toast.error("No response from server. Check your network.");
      } else {
        // Axios internal error
        toast.error("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="flex justify-center items-center">
      <div className="card min-w-[200px] w-fit sm:w-96 shadow-xl p-6 bg-gray-100 dark:bg-gray-800 transition-all duration-300">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Login</h2>

        <form onSubmit={handleLogin} className="flex flex-col justify-center items-center gap-4 mt-4">

          <input
            type="text"
            placeholder="Username or Email"
            required={true}
            value={identifier} // Use a single state variable
            onChange={(e) => setIdentifier(e.target.value)}
            className="input input-bordered w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />

          <input
            type="password"
            placeholder="Password"
            required={true}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />
          <Button type="submit" variant="primary" className="w-full font-semibold">
            Login
          </Button>
        </form>

        <div className='mt-2 '>
          <h1
            className='text-center text-lg text-gray-500 dark:text-gray-400'
          >Do not have an Account?
            <Link to="/register"
              className="font-semibold dark:text-amber-100 hover:text-amber-500"
            > Register </Link>
          </h1>
        </div>

        {/* ✅ Improved loading UI */}
        {loading && (
          <div className="flex justify-center items-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        )}
      </div>
    </Container >
  );
}

export default Login