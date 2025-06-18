import axios from 'axios';
import { useState, useRef } from 'react';
import { useAuth } from '../contexts';
import { toast } from "sonner";
import { useBackendCheck } from '../hooks/useBackendCheck';
import { BackendError } from '../components/BackendError';
import { MdDelete, MdCloudUpload, MdCheckCircle } from 'react-icons/md';
import { FaVideo, FaImage, FaSpinner } from 'react-icons/fa';
import Button from '../components/ui/Button/Button';

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
  const { available: backendAvailable, retry, retrying } = useBackendCheck();

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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-[1920px] mx-auto">
        {!backendAvailable ? (
          <BackendError onRetry={retry} retrying={retrying} />
        ) : (
          <div>
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 px-8 py-4 bg-white dark:bg-gray-800 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Upload Video
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Share your content with the world
              </p>
            </div>

            <form onSubmit={handleUpload} className="p-8">
              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column - Video Upload and Preview */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Video Upload Area */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                      Video File <span className="text-amber-500">*</span>
                    </label>
                    
                    <div className="mt-1 flex justify-center px-4 pt-4 pb-5 border-2 border-gray-200 dark:border-gray-600 border-dashed rounded-lg hover:border-amber-500 dark:hover:border-amber-400 transition-all duration-300 bg-white dark:bg-gray-800 shadow-sm">
                      <div className="space-y-1 text-center w-full">
                        {videoPreviewUrl ? (
                          <div className="relative group">
                            <video
                              src={videoPreviewUrl}
                              className="w-full max-h-[500px] rounded-lg shadow-md transform transition-transform duration-300 group-hover:scale-[1.02]"
                              controls
                              onClick={(e) => e.stopPropagation()}
                            />
                            <button
                              type="button"
                              onClick={clearVideoSelection}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors duration-200 z-10 shadow-md"
                            >
                              <MdDelete className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <label
                            htmlFor="video-upload"
                            className="cursor-pointer block"
                          >
                            <div className="mx-auto w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center shadow-sm">
                              <FaVideo className="h-8 w-8 text-amber-500" />
                            </div>
                            <div className="flex text-sm text-gray-700 dark:text-gray-300 justify-center mt-2">
                              <span className="font-medium text-amber-600 dark:text-amber-400 hover:text-amber-500">
                                Upload a video
                              </span>
                              <span className="pl-1">or drag and drop</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
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

                  {/* Video Details */}
                  {videoFile && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">
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
                </div>

                {/* Right Column - Thumbnail and Form Fields */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Thumbnail Upload */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                      Thumbnail (Optional)
                    </label>
                    <div className="mt-1 flex justify-center px-4 pt-4 pb-5 border-2 border-gray-200 dark:border-gray-600 border-dashed rounded-lg hover:border-amber-500 dark:hover:border-amber-400 transition-all duration-300 bg-white dark:bg-gray-800 shadow-sm">
                      <div className="space-y-1 text-center">
                        {thumbnailPreviewUrl ? (
                          <div className="relative group">
                            <img
                              src={thumbnailPreviewUrl}
                              alt="Thumbnail Preview"
                              className="max-h-[250px] rounded-lg shadow-md transform transition-transform duration-300 group-hover:scale-[1.02]"
                            />
                            <button
                              type="button"
                              onClick={clearThumbnailSelection}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors duration-200 shadow-md"
                            >
                              <MdDelete className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <label
                            htmlFor="thumbnail-upload"
                            className="cursor-pointer block"
                          >
                            <div className="mx-auto w-14 h-14 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center shadow-sm">
                              <FaImage className="h-7 w-7 text-amber-500" />
                            </div>
                            <div className="flex text-sm text-gray-700 dark:text-gray-300 justify-center mt-1.5">
                              <span className="font-medium text-amber-600 dark:text-amber-400 hover:text-amber-500">
                                Upload a thumbnail
                              </span>
                              <span className="pl-1">or drag and drop</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
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

                  {/* Title Input */}
                  <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                      Title <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-colors duration-200 outline-none shadow-sm"
                      placeholder="Enter video title"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Description Input */}
                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                      Description <span className="text-amber-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-colors duration-200 resize-none outline-none shadow-sm"
                      placeholder="Enter video description"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Upload Progress and Buttons */}
              <div className="mt-8 space-y-4">
                {loading && (
                  <div className="space-y-3 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <FaSpinner className="animate-spin text-amber-500" />
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          Uploading...
                        </span>
                      </div>
                      <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                        {uploadProgress}%
                      </span>
                    </div>
                    
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>

                    {timeRemaining && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Time remaining
                        </span>
                        <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                          {timeRemaining}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  {loading && (
                    <Button
                      type="button"
                      onClick={cancelUpload}
                      variant="secondary"
                      className="text-red-600 dark:text-red-400 hover:text-red-500"
                    >
                      Cancel Upload
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={loading || processing}
                    className="inline-flex items-center"
                  >
                    {loading ? (
                      <>
                        <MdCloudUpload className="animate-bounce mr-1.5" />
                        Uploading...
                      </>
                    ) : processing ? (
                      <>
                        <FaSpinner className="animate-spin mr-1.5" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <MdCheckCircle className="mr-1.5" />
                        Upload Video
                      </>
                    )}
                  </Button>
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