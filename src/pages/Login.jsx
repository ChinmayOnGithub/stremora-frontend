// import React from 'react'
import axios from 'axios'
import useAuth from '../contexts/AuthContext'
import { useState } from 'react';
import { useEffect } from 'react';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  // save user to the context 
  const { user, login, fetchCurrentUser } = useAuth();


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        { username, email, password },
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
      alert("Login successful!");

      fetchCurrentUser();


    } catch (error) {
      if (error.response) {
        // 🌟 Axios error for status 400, 401, 404, etc.
        alert(error.response.data.message || "Login failed!");
      } else if (error.request) {
        // 🌟 Request sent but no response received (server down, network issue)
        alert("No response from server. Check your network.");
      } else {
        // 🌟 Axios internal error
        alert("Something went wrong. Try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl p-6">
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <form onSubmit={handleLogin} className="flex flex-col justify-center items-center gap-4 mt-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input input-bordered input-primary"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered input-primary"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered input-primary"
          />
          <button type="submit" className="btn btn-primary w-full">
            Login
          </button>
        </form>

        <p className="text-center text-gray-500 mt-4">
          User: {user ? user.username : "Not logged in"}
        </p>
      </div>
    </div>
  );
}

export default Login