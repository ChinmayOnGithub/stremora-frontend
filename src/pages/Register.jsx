

// import React from 'react'
import axios from 'axios'
import useAuth from '../contexts/AuthContext'
import { useState } from 'react';
// import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {

  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  // save user to the context 
  const { user } = useAuth();

  const navigate = useNavigate();


  const handleRegister = async (e) => {
    e.preventDefault();

    if (!fullname || !username || !email || !password || !avatar || !coverImage) {
      alert("Please fill all fields and select files before uploading.");
      return;
    }

    if (avatar.size > 5 * 1024 * 1024) { // 5MB limit
      alert("Avatar file is too large! Please upload a smaller file.");
      return;
    }

    // handled using formData if there are any files
    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);
    formData.append("coverImage", coverImage);

    try {
      const res = await axios.post(
        "https://youtube-backend-clone.onrender.com/api/v1/users/register",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data"

          }
        }, // 🔥 Important!
      );

      alert("Response: " + JSON.stringify(res.data));  // 🔥 Show full response

      if (res.data.success) {
        alert("User registered successfully!");
        navigate("/login")
      }
    } catch (error) {
      let message = "Something went wrong.";

      if (error.response) {
        message = "Server Error: " + JSON.stringify(error.response.data);
      } else if (error.request) {
        message = "No response from server. Possible network issue.";
      } else {
        message = "Axios Error: " + error.message;
      }

      alert(message);  // 🔥 Show detailed error
    }
  };

  return (
    <div className="flex justify-center items-center bg-stone-950 h-full shadow-xl w-full sm:w-3/4 mx-auto rounded-md ">
      <div className="card w-96 shadow-xl p-6 bg-base-300">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <form onSubmit={handleRegister}
          className="flex flex-col justify-center items-center gap-4 mt-4">
          <input type="text"
            placeholder='fullname'
            value={fullname}
            onChange={(e) => { setFullname(e.target.value) }}
            className="input input-bordered input-primary"

          />
          <input type="text"
            placeholder='username'
            value={username}
            onChange={(e) => { setUsername(e.target.value) }}
            className="input input-bordered input-primary"

          />
          <input type="email"
            placeholder='email'
            value={email}
            onChange={(e) => { setEmail(e.target.value) }}
            className="input input-bordered input-primary"

          />
          <input type="password"
            placeholder='password'
            value={password}
            onChange={(e) => { setPassword(e.target.value) }}
            className="input input-bordered input-primary"

          />
          <div>
            <label className="label">
              <span className="label-text">Select Avatar</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
              className="file-input file-input-bordered w-full"
            />

          </div>
          <div>
            <label className="label">
              <span className="label-text">Select coverImage</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
              className="file-input file-input-bordered w-full"
            />

          </div>
          <button type="submit" className='btn btn-primary w-full'>Register</button>
        </form>

        <p className='text-center m-4 text-white/50'>current User: {user ? user.username : "Not logged in"}</p> {/* ✅ Show user or "Not logged in" */}
      </div>
    </div>
  )
}

export default Register