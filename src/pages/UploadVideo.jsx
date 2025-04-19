import axios from 'axios';
import { useState, useRef } from 'react';
import { useAuth } from '../contexts';
import Container from '../components/layout/Container';
import { toast } from "sonner";
import { useBackendCheck } from '../hooks/useBackendCheck';
import { BackendError } from '../components/BackendError';

function UploadVideo() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState("");
  const startTimeRef = useRef(null);
  const abortControllerRef = useRef(null); // For canceling uploads
  const videoInputRef = useRef(null); // Ref for video file input
  const thumbnailInputRef = useRef(null); // Ref for thumbnail file input

  const { token } = useAuth();
  const backendAvailable = useBackendCheck();

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProcessing(false);
    setUploadProgress(0);
    setTimeRemaining("");
    startTimeRef.current = Date.now();

    // Validate video file type
    const validTypes = ["video/mp4", "video/quicktime", "video/x-msvideo"];
    if (!validTypes.includes(videoFile.type)) {
      toast.error("Invalid file type. Please upload a video (MP4, MOV, AVI).");
      setLoading(false);
      return;
    }

    // Validate video file size
    if (videoFile.size > 100 * 1024 * 1024) {
      toast.error("Video size must be less than 100MB.");
      setLoading(false);
      return;
    }

    // Validate thumbnail file size
    if (thumbnail && thumbnail.size > 10 * 1024 * 1024) {
      toast.error("Thumbnail size must be less than 10MB.");
      setLoading(false);
      return;
    }

    // Validate authentication
    if (!token) {
      toast.error("User is not authenticated! Please log in.");
      setLoading(false);
      return;
    }

    // Validate required fields
    if (!videoFile || !title || !description) {
      toast.error("Please fill all fields and select files before uploading.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("videoFile", videoFile);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }
    formData.append("title", title);
    formData.append("description", description);

    abortControllerRef.current = new AbortController();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/video/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);

            // Calculate time remaining
            if (startTimeRef.current) {
              const elapsedTime = Date.now() - startTimeRef.current;
              const estimatedTotalTime = (elapsedTime * 100) / progress;
              const remainingTime = estimatedTotalTime - elapsedTime;
              setTimeRemaining(
                `${Math.round(remainingTime / 1000)} seconds remaining`
              );
            }
          },
          signal: abortControllerRef.current.signal,
          timeout: 300000, // 5 minutes timeout
        }
      );

      if (response.data.success) {
        setProcessing(true);
        toast.success("Video uploaded successfully!");
        // Clear form
        setVideoFile(null);
        setVideoPreviewUrl(null);
        setThumbnail(null);
        setThumbnailPreviewUrl(null);
        setTitle("");
        setDescription("");
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        toast.info("Upload canceled.");
      } else if (error.code === "ECONNABORTED") {
        toast.error("Request timed out. Please try again.");
      } else if (error.response?.status === 413) {
        toast.error("File size too large. Please try a smaller file.");
      } else if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
      setProcessing(false);
      setTimeRemaining("");
      abortControllerRef.current = null;
    }
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreviewUrl(URL.createObjectURL(file));
    }
  };

  const cancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // Abort the upload
    }
  };

  const clearVideoSelection = () => {
    setVideoFile(null);
    setVideoPreviewUrl(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = ""; // Clear the file input value
    }
  };

  const clearThumbnailSelection = () => {
    setThumbnail(null);
    setThumbnailPreviewUrl(null);
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = ""; // Clear the file input value
    }
  };

  return (
    <Container className="flex justify-center items-center my-auto">
      {!backendAvailable ? (
        <BackendError />
      ) : (
        <div className="min-w-[200px] w-fit sm:w-96 mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-all duration-300">
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
              {videoPreviewUrl && (
                <div className="relative mb-4 flex rounded-full">
                  <video
                    src={videoPreviewUrl}
                    autoPlay
                    muted
                    loop
                    className="max-h-[200px] sm:max-h-[50px] mt-2 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={clearVideoSelection}
                    className="absolute w-6 h-6 text-xs top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoFileChange}
                required
                className="file-input file-input-bordered w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white h-full border-none"
                disabled={loading}
                ref={videoInputRef} // Attach ref to video input
              />
            </div>

            {/* Thumbnail Upload (Optional) */}
            <div>
              <label className="label">
                <span className="label-text text-gray-900 dark:text-gray-200">
                  Select Thumbnail (Optional)
                </span>
              </label>
              {thumbnailPreviewUrl && (
                <div className="relative mb-4">
                  <img
                    src={thumbnailPreviewUrl}
                    alt="Thumbnail Preview"
                    className="max-h-[200px] sm:max-h-[50px] mt-2 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={clearThumbnailSelection}
                    className="absolute w-6 h-6 text-xs top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="file-input file-input-bordered w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white h-full"
                disabled={loading}
                ref={thumbnailInputRef} // Attach ref to thumbnail input
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
                disabled={loading}
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
                disabled={loading}
              ></textarea>
            </div>

            {/* Upload Button with Progress */}
            <div className="space-y-2">
              <button
                type="submit"
                className="btn w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300 dark:bg-amber-600 dark:hover:bg-amber-700 border-1"
                disabled={loading}
              >
                {loading
                  ? processing
                    ? "Processing..."
                    : `Uploading...`
                  : "Upload Video"}
              </button>

              {/* Progress Bar */}
              {loading && (
                <div className="flex flex-row justify-center items-center">
                  <div className="w-full h-fit bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div
                      className="bg-amber-500 text-xs font-medium text-white text-center p-0.5 leading-none rounded-full"
                      style={{ width: `${uploadProgress}%`, minWidth: "2rem" }}
                    ></div>
                  </div>
                  <p className="text-xs ml-2">{uploadProgress}%</p>
                </div>
              )}

              {/* Time Remaining */}
              {loading && (
                <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  {timeRemaining}
                </div>
              )}

              {/* Cancel Upload Button */}
              {loading && (
                <button
                  type="button"
                  onClick={cancelUpload}
                  className="btn w-full border-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300"
                >
                  Cancel Upload
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </Container>
  );
}

export default UploadVideo;