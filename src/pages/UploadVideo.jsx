import { useState, useRef } from 'react';
import axiosInstance from '@/lib/axios.js'; // Use the new, correct instance
import axios from 'axios'; // Keep for the isCancel check
import { toast } from "sonner";
import { useAuth } from '../contexts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FaVideo, FaImage } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { Loader2, UploadCloud } from 'lucide-react';
import { UPLOAD_MAINTENANCE, MAINTENANCE_MESSAGE } from '@/config/maintenance';

// This is the final, fully functional component that preserves all your original features.
function UploadVideo() {

  const [videoFile, setVideoFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState("");
  const startTimeRef = useRef(null);

  // The AbortController is the modern way to cancel requests.
  const abortControllerRef = useRef(null);
  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  // Your original state for tags is preserved.
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const { isLoaded } = useAuth();

  const handleUpload = async (e) => {
    e.preventDefault();

    // Check maintenance mode first
    if (UPLOAD_MAINTENANCE) {
      toast.error("Upload service is temporarily unavailable. Please try again later.");
      return;
    }

    if (!videoFile || !title || !description) {
      toast.error("Please provide a video, title, and description.");
      return;
    }

    setLoading(true);
    setUploadProgress(0);
    setTimeRemaining("");
    startTimeRef.current = Date.now();
    abortControllerRef.current = new AbortController();

    const formData = new FormData();
    formData.append("videoFile", videoFile);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }
    formData.append("title", title);
    formData.append("description", description);
    // formData.append("tags", JSON.stringify(tags)); // Uncomment if your backend supports tags

    const uploadPromise = axiosInstance.post(
      `/video/publish`,
      formData,
      {
        // No more manual headers needed, the interceptor handles it.
        headers: { "Content-Type": "multipart/form-data" },
        // Use the modern AbortController signal.
        signal: abortControllerRef.current.signal,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);

          // Your original time remaining logic is preserved.
          if (startTimeRef.current && progress > 0) {
            const elapsedTime = (Date.now() - startTimeRef.current) / 1000; // in seconds
            const totalTime = (elapsedTime / progress) * 100;
            const remaining = Math.round(totalTime - elapsedTime);
            setTimeRemaining(remaining > 0 ? `${remaining}s remaining` : "");
          }
        },
      }
    );

    toast.promise(uploadPromise, {
      loading: "Uploading video...",
      success: () => {
        // Clear the form on successful upload
        setVideoFile(null);
        setVideoPreviewUrl(null);
        setThumbnail(null);
        setThumbnailPreviewUrl(null);
        setTitle("");
        setDescription("");
        setTags([]);
        if (videoInputRef.current) videoInputRef.current.value = "";
        if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
        return "Video uploaded successfully!";
      },
      error: (err) => {
        // Added console.log for better debugging, as requested.
        console.error("Upload failed with error:", err.response || err);
        if (axios.isCancel(err)) {
          return "Upload canceled.";
        }
        return err.response?.data?.message || "Upload failed. Please try again.";
      },
      finally: () => {
        setLoading(false);
        setUploadProgress(0);
        setTimeRemaining("");
      }
    });
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    if (fileType === 'video') {
      setVideoFile(file);
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
      setVideoPreviewUrl(URL.createObjectURL(file));
    } else if (fileType === 'thumbnail') {
      setThumbnail(file);
      if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
      setThumbnailPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearSelection = (fileType) => {
    if (fileType === 'video') {
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
      setVideoFile(null);
      setVideoPreviewUrl(null);
      if (videoInputRef.current) videoInputRef.current.value = "";
    } else if (fileType === 'thumbnail') {
      if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
      setThumbnail(null);
      setThumbnailPreviewUrl(null);
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
    }
  };

  const cancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  // Your original tag handling logic is preserved.
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


  if (!isLoaded) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto">
        <header className="py-4">
          <h1 className="text-xl font-extrabold text-foreground">
            Upload New Video
          </h1>
          <p className="text-muted-foreground">
            Share your content with the world
          </p>
        </header>

        <form onSubmit={handleUpload} className="">
          {UPLOAD_MAINTENANCE && (
            <Card className="mb-6 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="text-orange-600 dark:text-orange-400">
                    🔧
                  </div>
                  <div>
                    <h3 className="font-semibold text-orange-800 dark:text-orange-200">
                      {MAINTENANCE_MESSAGE.title}
                    </h3>
                    <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                      {MAINTENANCE_MESSAGE.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardContent className="p-6 grid gap-10 lg:grid-cols-12">
              <section className="lg:col-span-8 space-y-4">
                <Label className="font-semibold text-lg flex items-center gap-2 text-foreground">
                  <FaVideo className="text-primary" /> Video File <Badge variant="outline">Required</Badge>
                </Label>
                {videoPreviewUrl ? (
                  <div className="relative w-full aspect-video overflow-hidden rounded-md bg-black border shadow-sm">
                    <video src={videoPreviewUrl} className="w-full h-full object-contain" controls />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => clearSelection('video')}
                      className="absolute top-3 right-3 rounded-full h-8 w-8"
                    >
                      <MdDelete className="h-5 w-5" />
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor="video-upload"
                    className="flex flex-col items-center justify-center aspect-video border-2 border-dashed rounded-md cursor-pointer text-center hover:border-primary transition-colors bg-card"
                  >
                    <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
                    <p className="font-medium text-foreground">Select video to upload</p>
                    <p className="text-sm text-muted-foreground mt-1">MP4, MOV, or AVI up to 100MB</p>
                    <input
                      id="video-upload"
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileChange(e, 'video')}
                      ref={videoInputRef}
                      disabled={loading}
                      className="sr-only"
                    />
                  </label>
                )}
              </section>

              <aside className="lg:col-span-4 space-y-6">
                <div className="space-y-2">
                  <Label className="font-semibold text-lg flex items-center gap-2 text-foreground">
                    <FaImage className="text-primary" /> Thumbnail
                  </Label>
                  {thumbnailPreviewUrl ? (
                    <div className="relative w-full aspect-video bg-black overflow-hidden rounded-md border shadow-sm">
                      <img src={thumbnailPreviewUrl} alt="Thumbnail preview" className="object-contain w-full h-full" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => clearSelection('thumbnail')}
                        className="absolute top-2 right-2 rounded-full h-8 w-8"
                      >
                        <MdDelete className="h-5 w-5" />
                      </Button>
                    </div>
                  ) : (
                    <label
                      htmlFor="thumbnail-upload"
                      className="flex flex-col items-center justify-center aspect-video border-2 border-dashed rounded-md cursor-pointer text-center hover:border-primary transition-colors bg-card"
                    >
                      <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Upload thumbnail</p>
                      <input
                        id="thumbnail-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'thumbnail')}
                        ref={thumbnailInputRef}
                        disabled={loading}
                        className="sr-only"
                      />
                    </label>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title" className="font-semibold">Title <span className="text-red-500">*</span></Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Enter an engaging title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="font-semibold">Description <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="description"
                    rows={5}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Describe your video..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags" className="font-semibold">Tags</Label>
                  <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px] bg-background">
                    {tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-muted-foreground hover:text-foreground"
                        >
                          &times;
                        </button>
                      </Badge>
                    ))}
                    <input
                      id="tags"
                      type="text"
                      value={tagInput}
                      onChange={handleTagInputChange}
                      onKeyDown={handleTagInputKeyDown}
                      disabled={loading}
                      className="flex-grow bg-transparent outline-none text-sm"
                      placeholder="Add tags..."
                    />
                  </div>
                </div>
              </aside>
            </CardContent>
          </Card>

          <div className="flex flex-col-reverse sm:flex-row items-center gap-4 border-t pt-8">
            {loading && (
              <div className="w-full sm:w-auto flex-grow">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-muted-foreground mt-2 text-center sm:text-left">
                  Uploading... {uploadProgress}% {timeRemaining && `(${timeRemaining})`}
                </p>
              </div>
            )}
            <div className="flex gap-3 w-full sm:w-auto ml-auto">
              {loading && (
                <Button
                  type="button"
                  onClick={cancelUpload}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={loading || UPLOAD_MAINTENANCE}
                className="w-full sm:w-auto"
                title={UPLOAD_MAINTENANCE ? "Upload service is temporarily unavailable. We're working to fix this issue." : ""}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {UPLOAD_MAINTENANCE ? MAINTENANCE_MESSAGE.buttonText :
                  loading ? 'Uploading…' : 'Publish Video'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadVideo;
