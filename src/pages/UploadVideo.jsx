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
    <>
      <form onSubmit={handleUpload}>
        <input type="file"
          accept='video/*'
          onChange={(e) => { setVideoFile(e.target.files[0]) }}
        />
        <input type="file"
          accept='image/*'
          onChange={(e) => { setThumbnail(e.target.files[0]) }}
        />
        <input type="text"
          placeholder='Title'
          value={title}
          onChange={(e) => { setTitle(e.target.value) }}
        />
        <input type="text"
          placeholder='Description'
          value={description}
          onChange={(e) => { setDescription(e.target.value) }}
        />
        <button type="submit" className='btn'>Upload</button>
      </form>
    </>
  )
}

export default UploadVideo