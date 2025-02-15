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

  // ✅ Restore login state on page refresh
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      login(storedToken); // Update auth context
      fetchCurrentUser(storedToken); // Fetch user info
    }
  }, []);


  return (
    <>
      <form onSubmit={handleLogin}>
        <input type="text"
          placeholder='username'
          value={username}
          onChange={(e) => { setUsername(e.target.value) }}
        />
        <input type="email"
          placeholder='email'
          value={email}
          onChange={(e) => { setEmail(e.target.value) }}
        />
        <input type="password"
          placeholder='password'
          value={password}
          onChange={(e) => { setPassword(e.target.value) }}
        />
        <button type="submit">Login</button>
      </form>

      <p>User: {user ? user.username : "Not logged in"}</p> {/* ✅ Show user or "Not logged in" */}

    </>
  )
}

export default Login