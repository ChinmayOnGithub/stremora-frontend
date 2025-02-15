// import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import useAuth from '../contexts/AuthContext';

function UploadVideo() {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { token } = useAuth();

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("User is not authenticated! Please log in.");
      return;
    }


    if (!videoFile || !thumbnail || !title || !description) {
      alert("Please fill all fields and select files before uploading.");
      return;
    }

    // handled using formData if there are any files
    const formData = new FormData();
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnail);
    formData.append("title", title);
    formData.append("description", description);


    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/video/publish",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // ✅ Attach token

          },
        }
      )
      alert("Uploaded video successfully");
      console.log(res);

    } catch (error) {
      console.log("something went wrong", error);
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-base-200 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-center mb-4">Upload Video</h2>

      <form onSubmit={handleUpload} className="space-y-4">
        {/* ✅ Video Upload */}
        <div>
          <label className="label">
            <span className="label-text">Select Video</span>
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            className="file-input file-input-bordered w-full"
          />
        </div>

        {/* ✅ Thumbnail Upload */}
        <div>
          <label className="label">
            <span className="label-text">Select Thumbnail</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            className="file-input file-input-bordered w-full"
          />
        </div>

        {/* ✅ Title Input */}
        <div>
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            placeholder="Enter video title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        {/* ✅ Description Input */}
        <div>
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            placeholder="Enter video description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full"
          ></textarea>
        </div>

        {/* ✅ Upload Button */}
        <button type="submit" className="btn btn-primary w-full">
          Upload Video
        </button>
      </form>
    </div>
  );
}

export default UploadVideo