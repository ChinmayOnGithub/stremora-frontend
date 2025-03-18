

// import React from 'react'
import axios from 'axios'
// import { useAuth, useUser, useVideo }  from '../contexts'
import { useState } from 'react';
// import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from '../components/layout/Container';
import { toast } from "sonner";
import { Button } from '../components';
import { useAuth } from '../contexts';


function Register() {

  const { login } = useAuth();

  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  // save user to the context 
  // const { user } = useAuth();

  const navigate = useNavigate();
  const [loading, setLoading] = useState();
  const [error, setError] = useState("");  // 🔥 Store error message



  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors


    if (!fullname || !username || !email || !password || !avatar) {
      toast.error("Please fill all fields and select files before uploading.", {
        className: "text-sm sm:text-base bg-gray-800 text-white", // Responsive & dark mode
      });
      setLoading(false);
      return;
    }

    if (avatar.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("Avatar file is too large! Please upload a smaller file.", {
        className: "text-sm sm:text-base bg-gray-800 text-white",
      }); setLoading(false);
      return;
    }

    // handled using formData if there are any files
    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);
    if (coverImage) {
      formData.append("coverImage", coverImage);
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/users/register`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data"

          }
        }, // 🔥 Important!
      );

      // console.log("Response: " + JSON.stringify(res.data));

      if (res.data.success) {


        // Immediately log in with received tokens
        const { accessToken, refreshToken } = res.data.data;
        await login(accessToken, refreshToken);

        setTimeout(() => navigate("/"), 0);

        // Show combined success message
        toast.success("Welcome to Streamora!", {
          description: "Account created & logged in successfully 🎉",
          duration: 3000,
          className: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100",
        });
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message || "Server error occurred.";
        setError(errorMessage);
      } else if (error.request) {
        setError("No response from server. Possible network issue.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="flex justify-center items-center">
      {/* Register Card */}
      <div className="card min-w-[200px] w-fit sm:w-96 shadow-xl p-6 bg-gray-100 dark:bg-gray-800 transition-all duration-300">

        {/* 🔹 Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Register</h2>

        {/* 🔹 Registration Form */}
        <form onSubmit={handleRegister} className="flex flex-col justify-center items-center gap-4 mt-4">

          {/* Fullname */}
          <div className="w-full">
            <label className="label text-gray-800 dark:text-white">
              Fullname <span className="text-red-500">*</span>
            </label>
            <input type="text"
              placeholder="Enter Fullname"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
              className="input input-bordered w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
          </div>

          {/* Username */}
          <div className="w-full">
            <label className="label text-gray-800 dark:text-white">
              Username <span className="text-red-500">*</span>
            </label>
            <input type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="input input-bordered w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
          </div>

          {/* Email */}
          <div className="w-full">
            <label className="label text-gray-800 dark:text-white">
              Email <span className="text-red-500">*</span>
            </label>
            <input type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input input-bordered w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
          </div>

          {/* Password */}
          <div className="w-full">
            <label className="label text-gray-800 dark:text-white">
              Password <span className="text-red-500">*</span>
            </label>
            <input type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input input-bordered w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
          </div>

          {/* Avatar Upload */}
          <div className="w-full">
            <label className="label text-gray-800 dark:text-white">
              Avatar <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
              required
              className="file-input border-0 w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white h-full "
            />
          </div>

          {/* Cover Image Upload (Optional) */}
          <div className="w-full">
            <label className="label text-gray-800 dark:text-white">
              Cover Image <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
              className="file-input file-input-bordered w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white h-full"
            />
          </div>

          {/* Submit Button */}
          <Button type="submit"
            variant="primary"
            className="w-full font-semibold"
          >
            {loading ? "Registering..." : "Register"}
          </Button>

        </form>
        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}



        {/* Already Registered? */}
        <div className="mt-2">
          <h1 className="text-center text-lg text-gray-500 dark:text-gray-400">
            Already have an Account?
            <Link to="/login" className="font-semibold dark:text-amber-100 hover:text-amber-500"> Login </Link>
          </h1>
        </div>



        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        )}

      </div>
    </Container>
  )
}

export default Register