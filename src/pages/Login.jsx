// import React from 'react'
import axios from 'axios'
import useAuth from '../contexts/AuthContext.js'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { useEffect } from 'react';
import Container from '../components/Container';

import { toast } from "sonner";

function Login() {
  // const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [username, setUsername] = useState("");
  // save user to the context 
  const { user, login, logout, fetchCurrentUser } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Loading state


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
        "https://youtube-backend-clone.onrender.com/api/v1/users/login",
        { identifier, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          }
        } // 🔥 Important!
      );

      const { accessToken, refreshToken } = res.data.data;
      login(accessToken); // Save access token
      // Optionally, you can store the refresh token as well
      localStorage.setItem('refreshToken', refreshToken);

      await fetchCurrentUser(); // ✅ Always fetch user after login

      // alert("Login successful!");
      // once the login is successfull redirect to home page
      toast.success("User logged in successfully!", {
        description: "Welcome back!",
        duration: 3000,
      });

      setTimeout(() => navigate("/"), 0); // Wait 3s before redirecting


    } catch (error) {
      if (error.response) {
        // 🌟 Axios error for status 400, 401, 404, etc.
        toast.error("Login Failed ❌", {
          description: error.response?.data?.message || "Something went wrong.",
        });
      } else if (error.request) {
        // 🌟 Request sent but no response received (server down, network issue)
        toast.error("No response from server. Check your network.");
      } else {
        // 🌟 Axios internal error
        toast.error("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="flex justify-center items-center">
      <div className="card w-96 shadow-xl p-6 bg-gray-100 dark:bg-gray-800 transition-all duration-300">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Login</h2>

        <form onSubmit={handleLogin} className="flex flex-col justify-center items-center gap-4 mt-4">

          <input
            type="text"
            placeholder="Username or Email"
            required="true"
            value={identifier} // Use a single state variable
            onChange={(e) => setIdentifier(e.target.value)}
            className="input input-bordered w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />

          <input
            type="password"
            placeholder="Password"
            required="true"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />
          <button type="submit"
            className="btn w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300 dark:bg-orange-600 dark:hover:bg-orange-700"
          >
            Login
          </button>
        </form>

        <div className='mt-2 '>
          <h1
            className='text-center text-lg text-gray-500 dark:text-gray-400'
          >Do not have an Account?
            <Link to="/register"
              className="font-semibold dark:text-orange-100 hover:text-amber-500"
            > Register </Link>
          </h1>
        </div>

        {/* ✅ Improved loading UI */}
        {loading && (
          <div className="flex justify-center items-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        )}


        {/* For Testing */}
        {/* <div className="text-center text-gray-500 dark:text-gray-400 mt-2">
          {user ? (
            <div className="m-4">
              <p className="text-xl font-bold p-2 text-white bg-black/20 rounded-md">{user.username}</p>
              <button onClick={logout} className="btn text-xl bg-amber-700 w-full rounded-md mt-1">
                LOGOUT
              </button>
            </div>
          ) : "Not logged in"}
        </div> */}
      </div>
    </Container >
  );
}

export default Login