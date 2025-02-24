// import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import { useAuth, useUser, useVideo } from '../contexts';
import Container from '../components/Container';
import { toast } from "sonner";


function UploadVideo() {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState("");

  const { token } = useAuth();

  const handleUpload = async (e) => {
    e.preventDefault();

    setLoading(true);


    if (videoFile.size > 100 * 1024 * 1024) {
      toast.error("Video size must be less than 100MB.");
      setLoading(false)
      return;
    }

    if (thumbnail.size > 10 * 1024 * 1024) {
      toast.error("Thumbnail size must be less than 10MB.");
      setLoading(false)
      return;
    }

    if (!token) {
      toast.error("User is not authenticated! Please log in.");
      setLoading(false);
      return;
    }

    if (!videoFile || !title || !description) {
      toast.error("Please fill all fields and select files before uploading.");
      setLoading(false);
      return;
    }

    // handled using formData if there are any files
    const formData = new FormData();
    formData.append("videoFile", videoFile);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail); // Append only if a thumbnail is selected
    }
    formData.append("title", title);
    formData.append("description", description);


    try {
      const res = await axios.post(
        // "http://localhost:8000/api/v1/video/publish",
        "https://youtube-backend-clone.onrender.com/api/v1/video/publish",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // ✅ Attach token

          },
        }
      )
      toast.success("Uploaded video successfully");
      console.log(res);

    } catch (error) {
      console.log("something went wrong", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="flex justify-center items-center my-auto">
      <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-all duration-300">

        {/* 🔹 Title */}
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-900 dark:text-white">
          Upload Video
        </h2>

        {/* 🔹 Upload Form */}
        <form onSubmit={handleUpload} className="space-y-4">

          {/* Video Upload */}
          <div>
            <label className="label">
              <span className="label-text text-gray-900 dark:text-gray-200">
                Select Video <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              required
              className="file-input file-input-bordered w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white h-full border-none"
            />
          </div>

          {/* Thumbnail Upload (Optional) */}
          <div>
            <label className="label">
              <span className="label-text text-gray-900 dark:text-gray-200">
                Select Thumbnail (Optional)
              </span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0])}
              className="file-input file-input-bordered w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white h-full"
            />
          </div>

          {/* Title Input */}
          <div>
            <label className="label">
              <span className="label-text text-gray-900 dark:text-gray-200">
                Title <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="text"
              placeholder="Enter video title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="input input-bordered w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="label">
              <span className="label-text text-gray-900 dark:text-gray-200">
                Description <span className="text-red-500">*</span>
              </span>
            </label>
            <textarea
              placeholder="Enter video description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="textarea textarea-bordered w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            ></textarea>
          </div>

          {/* Upload Button */}
          <button
            type="submit"
            className="btn w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300 dark:bg-amber-600 dark:hover:bg-amber-700  border-1"
          >
            {loading ? "Uploading..." : "Upload Video"}
          </button>

        </form>

        {/* 🔹 Loading Indicator */}
        {loading && (
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        )}

      </div>
    </Container>
  );
}

export default UploadVideo