import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts';
import { toast } from "sonner";
import { useBackendCheck } from '../hooks/useBackendCheck';
import { BackendError } from '../components/BackendError';
import { MdDelete, MdCloudUpload, MdCheckCircle } from 'react-icons/md';
import { FaVideo, FaImage, FaSpinner, FaHeartBroken, FaChevronDown } from 'react-icons/fa';
import Button from '../components/ui/Button/Button';
import FormField from '../components/auth/FormField';
import FileUploadField from '../components/auth/FileUploadField';
import Dropdown from '../components/ui/Dropdown';

// FunError component for playful error display
function FunError({ message, subtext, onRetry, retrying }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-8 bg-gray-800/90 rounded-2xl shadow-lg">
      <FaHeartBroken className="text-6xl text-red-400 mb-4 animate-bounce" />
      <h2 className="text-2xl font-bold text-red-400 mb-2">{message}</h2>
      {subtext && <p className="text-lg text-red-200 mb-4">{subtext}</p>}
      <button
        onClick={onRetry}
        disabled={retrying}
        className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow transition-colors text-lg mt-2 disabled:opacity-60"
      >
        <svg className="w-5 h-5 mr-1 animate-spin" viewBox="0 0 20 20" fill="currentColor"><path d="M4 4v5h.582a7 7 0 1 1-1.31 7.093.75.75 0 1 1 1.32-.747A5.5 5.5 0 1 0 5.5 9H10V4a.75.75 0 0 0-1.5 0z" /></svg>
        {retrying ? 'Trying...' : 'Try Again'}
      </button>
    </div>
  );
}

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
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const { token } = useAuth();
  const { available: backendAvailable, retry, retrying } = useBackendCheck();

  const categoryOptions = [
    { value: '', label: 'Select a category' },
    { value: 'education', label: 'Education' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'music', label: 'Music' },
    { value: 'sports', label: 'Sports' },
    { value: 'other', label: 'Other' },
  ];
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryButtonRef = useRef(null);
  const categoryMenuRef = useRef(null);
  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(event.target) &&
        categoryButtonRef.current &&
        !categoryButtonRef.current.contains(event.target)
      ) {
        setCategoryOpen(false);
      }
    }
    if (categoryOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [categoryOpen]);
  // Keyboard navigation
  const handleCategoryKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setCategoryOpen((open) => !open);
    } else if (e.key === 'Escape') {
      setCategoryOpen(false);
    }
  };

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
    formData.append("category", category);
    formData.append("tags", JSON.stringify(tags));

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

  // Tag input handlers
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };
  const handleTagInputKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/,$/, '');
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };
  const handleRemoveTag = (removeTag) => {
    setTags(tags.filter(tag => tag !== removeTag));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">

        {/* Page heading */}
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Upload New Video
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share your content with the world
          </p>
        </header>

        <form onSubmit={handleUpload} className="space-y-12">

          {/* === Video & thumbnail section === */}
          <div className="grid gap-10 lg:grid-cols-12">
            {/* Video upload / preview */}
            <section className="lg:col-span-8 space-y-4">
              <h2 className="font-semibold text-lg flex items-center gap-2 text-gray-800 dark:text-gray-200">
                <FaVideo className="text-amber-500" /> Video file <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-md">required</span>
              </h2>

                        {videoPreviewUrl ? (
                <div className="relative w-full aspect-[16/9] overflow-hidden rounded-md bg-black border border-gray-200 dark:border-gray-700 shadow-sm">
                            <video
                              src={videoPreviewUrl}
                    className="w-full h-full object-contain absolute inset-0"
                              controls
                              onClick={(e) => e.stopPropagation()}
                            />
                            <button
                              type="button"
                              onClick={clearVideoSelection}
                    className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-md p-2 text-red-500 hover:bg-white dark:hover:bg-gray-700 transition-colors shadow"
                            >
                    <MdDelete className="h-5 w-5" />
                            </button>
                          </div>
                        ) : (
                          <label
                            htmlFor="video-upload"
                  className="flex flex-col items-center justify-center aspect-[16/9] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md cursor-pointer text-center hover:border-amber-500 dark:hover:border-amber-500/80 transition-colors bg-white dark:bg-gray-800 shadow-sm"
                >
                  <FaVideo className="h-10 w-10 text-amber-500 mb-4" />
                  <p className="font-medium text-gray-800 dark:text-gray-200">Select video to upload</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">MP4, MOV, or AVI up to 100 MB</p>
                            <input
                              id="video-upload"
                              type="file"
                              accept="video/*"
                              onChange={handleVideoFileChange}
                              ref={videoInputRef}
                              disabled={loading}
                    className="sr-only"
                            />
                          </label>
                        )}

              {/* File info */}
                  {videoFile && (
                <ul className="grid grid-cols-2 gap-4 text-base bg-gray-50 dark:bg-gray-800/60 rounded-md p-4 border border-gray-200 dark:border-gray-700">
                  <li><span className="text-gray-500">Name:</span> {videoFile.name}</li>
                  <li><span className="text-gray-500">Size:</span> {(videoFile.size / 1048576).toFixed(2)} MB</li>
                  <li><span className="text-gray-500">Type:</span> {videoFile.type.split('/')[1].toUpperCase()}</li>
                  <li><span className="text-gray-500">Modified:</span> {new Date(videoFile.lastModified).toLocaleDateString()}</li>
                </ul>
                  )}
            </section>

            {/* Thumbnail + details */}
            <aside className="lg:col-span-4 space-y-4">
              {/* Thumbnail */}
                  <div className="space-y-2">
                <h2 className="font-semibold text-lg flex items-center gap-2 text-gray-800 dark:text-gray-200">
                  <FaImage className="text-amber-500" /> Thumbnail
                </h2>
                        {thumbnailPreviewUrl ? (
                  <div className="relative w-full aspect-[16/9] bg-black overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 shadow-sm">
                    <img src={thumbnailPreviewUrl} alt="Thumbnail preview" className="object-contain w-full h-full absolute inset-0" />
                            <button
                              type="button"
                              onClick={clearThumbnailSelection}
                      className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur p-2 rounded-md text-red-500 hover:bg-white dark:hover:bg-gray-700 transition-colors shadow"
                            >
                      <MdDelete className="h-5 w-5" />
                            </button>
                          </div>
                        ) : (
                          <label
                            htmlFor="thumbnail-upload"
                    className="flex flex-col items-center justify-center aspect-[16/9] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md cursor-pointer text-center hover:border-amber-500 dark:hover:border-amber-500/80 transition-colors bg-white dark:bg-gray-800 shadow-sm"
                  >
                    <FaImage className="h-8 w-8 text-amber-500 mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Upload thumbnail (PNG/JPG)</p>
                            <input
                              id="thumbnail-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleThumbnailChange}
                              ref={thumbnailInputRef}
                              disabled={loading}
                      className="sr-only"
                            />
                          </label>
                        )}
                      </div>
              {/* Title */}
                  <div className="space-y-2">
                <label htmlFor="title" className="block text-base font-semibold text-gray-800 dark:text-gray-200">
                  Title <span className="text-red-500">*</span>
                    </label>
                    <input
                  id="title"
                  name="title"
                      type="text"
                      value={title}
                  onChange={e => setTitle(e.target.value)}
                      required
                      disabled={loading}
                  className="h-12 w-full rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-amber-500 focus:border-amber-500 px-4 py-3 text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none"
                  placeholder="Enter an engaging title"
                    />
                  </div>
              {/* Description */}
                  <div className="space-y-2">
                <label htmlFor="description" className="block text-base font-semibold text-gray-800 dark:text-gray-200">
                  Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                  name="description"
                  rows={5}
                      value={description}
                  onChange={e => setDescription(e.target.value)}
                      required
                      disabled={loading}
                  className="h-28 w-full rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-amber-500 focus:border-amber-500 px-4 py-3 text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none resize-none"
                  placeholder="Describe your video..."
                />
              </div>
              {/* Category Dropdown */}
              <div className="space-y-2">
                <label htmlFor="category" className="block text-base font-semibold text-gray-800 dark:text-gray-200">
                  Category
                </label>
                <Dropdown
                  options={categoryOptions}
                  value={category}
                  onChange={setCategory}
                  disabled={loading}
                  placeholder="Select a category"
                  className="w-full"
                    />
                  </div>
              {/* Tags Input */}
              <div className="space-y-2">
                <label htmlFor="tags" className="block text-base font-semibold text-gray-800 dark:text-gray-200">
                  Tags <span className="text-gray-400 text-sm">(press Enter or comma to add)</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map(tag => (
                    <span key={tag} className="inline-flex items-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-3 py-1 rounded-lg text-sm font-medium shadow-sm">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-gray-500 hover:text-red-500 focus:outline-none"
                        aria-label={`Remove tag ${tag}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  id="tags"
                  type="text"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagInputKeyDown}
                  disabled={loading}
                  className="h-12 w-full rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-amber-500 focus:border-amber-500 px-4 py-3 text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none"
                  placeholder="Add tags (e.g. tutorial, react, music)"
                  autoComplete="off"
                />
              </div>
            </aside>
              </div>

          {/* === Progress & actions === */}
          <div className="flex flex-col-reverse sm:flex-row items-center gap-4 border-t border-gray-200 dark:border-gray-700 pt-8">
                {loading && (
              <div className="w-full sm:w-auto flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                    <FaSpinner className="animate-spin text-amber-500" /> Uploading&nbsp;{uploadProgress}%
                        </span>
                  {timeRemaining && <span className="text-sm text-gray-600 dark:text-gray-400">{timeRemaining}</span>}
                      </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

            <div className="flex gap-3 w-full sm:w-auto">
                  {loading && (
                    <Button
                      type="button"
                      onClick={cancelUpload}
                      variant="secondary"
                  className="w-full sm:w-auto"
                    >
                  Cancel
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={loading || processing}
                className="w-full sm:w-auto"
                  >
                {loading ? 'Uploading…' : processing ? 'Processing…' : 'Publish Video'}
                  </Button>
                </div>
              </div>
            </form>
      </div>
    </div>
  );
}

export default UploadVideo;