import axios from 'axios';
import { useState, useRef } from 'react';
import { useAuth } from '../contexts';
import { toast } from "sonner";
import { useBackendCheck } from '../hooks/useBackendCheck';
import { BackendError } from '../components/BackendError';
import { MdDelete, MdCloudUpload, MdCheckCircle } from 'react-icons/md';
import { FaVideo, FaImage, FaSpinner } from 'react-icons/fa';

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
        `${import.meta.env.VITE_BACKEND_URI}/video/publish`,
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

      if (response.status === 200) {
        setProcessing(true);
        toast.success("Video uploaded successfully!");
        // Clear form
        setVideoFile(null);
        setVideoPreviewUrl(null);
        setThumbnail(null);
        setThumbnailPreviewUrl(null);
        setTitle("");
        setDescription("");
        if (videoInputRef.current) videoInputRef.current.value = "";
        if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
      } else {
        console.error("Upload failed with status code:", response.status, "Response data:", response.data);
        toast.error(response.data?.message || `Upload failed with status ${response.status}`);
        setLoading(false);
        setProcessing(false);
        setTimeRemaining("");
      }
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      if (axios.isCancel(error)) {
        toast.info("Upload canceled.");
      } else if (error.code === "ECONNABORTED") {
        toast.error("Request timed out. Please try again.");
      } else if (error.response?.status === 413) {
        toast.error("File size too large. Please try a smaller file.");
      } else if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
      } else if (error.response) {
        toast.error(error.response.data?.message || `Request failed with status ${error.response.status}`);
      } else {
        toast.error(error.message || "Something went wrong. Please try again.");
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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!backendAvailable ? (
          <BackendError />
        ) : (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-amber-200/20 dark:border-amber-500/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Upload Your Video
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Share your content with the world
              </p>
            </div>

            <form onSubmit={handleUpload} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Video Upload */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Video File <span className="text-amber-500">*</span>
                    </label>
                    
                    <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-amber-300/50 dark:border-amber-500/50 border-dashed rounded-xl hover:border-amber-500 dark:hover:border-amber-400 transition-all duration-300 bg-amber-50/50 dark:bg-amber-900/20">
                      <div className="space-y-2 text-center w-full">
                        {videoPreviewUrl ? (
                          <div className="relative group">
                            <video
                              src={videoPreviewUrl}
                              className="w-full max-h-[300px] rounded-lg shadow-lg transform transition-transform duration-300 group-hover:scale-[1.02]"
                              controls
                              onClick={(e) => e.stopPropagation()}
                            />
                            <button
                              type="button"
                              onClick={clearVideoSelection}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-200 z-10"
                            >
                              <MdDelete className="w-6 h-6" />
                            </button>
                          </div>
                        ) : (
                          <label
                            htmlFor="video-upload"
                            className="cursor-pointer block"
                          >
                            <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center">
                              <FaVideo className="h-8 w-8 text-amber-500" />
                            </div>
                            <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center mt-2">
                              <span className="font-medium text-amber-600 dark:text-amber-400 hover:text-amber-500">
                                Upload a video
                              </span>
                              <span className="pl-1">or drag and drop</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              MP4, MOV, or AVI up to 100MB
                            </p>
                            <input
                              id="video-upload"
                              name="video-upload"
                              type="file"
                              accept="video/*"
                              className="sr-only"
                              onChange={handleVideoFileChange}
                              ref={videoInputRef}
                              disabled={loading}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Video Information - Collapsible on mobile */}
                  {videoFile && (
                    <div className="lg:hidden">
                      <details className="bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <summary className="p-4 cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
                          Video Details
                        </summary>
                        <div className="p-4 pt-0 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">File Name:</p>
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {videoFile?.name}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">File Size:</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {(videoFile?.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Type:</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {videoFile?.type.split('/')[1].toUpperCase()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Last Modified:</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {new Date(videoFile?.lastModified).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </details>
                    </div>
                  )}
                </div>

                {/* Right Column - Form Fields */}
                <div className="space-y-6">
                  {/* Video Information - Always visible on desktop */}
                  {videoFile && (
                    <div className="hidden lg:block bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Video Details
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">File Name:</p>
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {videoFile?.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">File Size:</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {(videoFile?.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Type:</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {videoFile?.type.split('/')[1].toUpperCase()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Last Modified:</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {new Date(videoFile?.lastModified).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Title Input */}
                  <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Title <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-colors duration-200"
                      placeholder="Enter video title"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Description Input */}
                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description <span className="text-amber-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-colors duration-200 resize-none"
                      placeholder="Enter video description"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Thumbnail Upload */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Thumbnail (Optional)
                    </label>
                    <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-amber-300/50 dark:border-amber-500/50 border-dashed rounded-xl hover:border-amber-500 dark:hover:border-amber-400 transition-all duration-300 bg-amber-50/50 dark:bg-amber-900/20">
                      <div className="space-y-2 text-center">
                        {thumbnailPreviewUrl ? (
                          <div className="relative group">
                            <img
                              src={thumbnailPreviewUrl}
                              alt="Thumbnail Preview"
                              className="max-h-[200px] rounded-lg shadow-lg transform transition-transform duration-300 group-hover:scale-[1.02]"
                            />
                            <button
                              type="button"
                              onClick={clearThumbnailSelection}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-200"
                            >
                              <MdDelete className="w-6 h-6" />
                            </button>
                          </div>
                        ) : (
                          <label
                            htmlFor="thumbnail-upload"
                            className="cursor-pointer block"
                          >
                            <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center">
                              <FaImage className="h-8 w-8 text-amber-500" />
                            </div>
                            <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center mt-2">
                              <span className="font-medium text-amber-600 dark:text-amber-400 hover:text-amber-500">
                                Upload a thumbnail
                              </span>
                              <span className="pl-1">or drag and drop</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              PNG, JPG, GIF up to 10MB
                            </p>
                            <input
                              id="thumbnail-upload"
                              name="thumbnail-upload"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleThumbnailChange}
                              ref={thumbnailInputRef}
                              disabled={loading}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload Progress and Buttons */}
              <div className="space-y-4">
                {loading && (
                  <div className="space-y-4 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <FaSpinner className="animate-spin text-amber-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Uploading...
                        </span>
                      </div>
                      <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                        {uploadProgress}%
                      </span>
                    </div>
                    
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>

                    {timeRemaining && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                          Time remaining
                        </span>
                        <span className="text-amber-600 dark:text-amber-400 font-medium">
                          {timeRemaining}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end space-x-4">
                  {loading && (
                    <button
                      type="button"
                      onClick={cancelUpload}
                      className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                    >
                      Cancel Upload
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading || processing}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    {loading ? (
                      <>
                        <MdCloudUpload className="animate-bounce mr-2" />
                        Uploading...
                      </>
                    ) : processing ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <MdCheckCircle className="mr-2" />
                        Upload Video
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadVideo;