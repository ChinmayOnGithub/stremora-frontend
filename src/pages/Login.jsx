// import React from 'react'
import axios from 'axios'
import useAuth from '../contexts/AuthContext'
import { useState } from 'react';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { login } = useAuth();

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

      login(res.data.token); // Save token
      alert("Login successful!");


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
        <button type="submit">Login</button></form>
    </>
  )
}

export default Login