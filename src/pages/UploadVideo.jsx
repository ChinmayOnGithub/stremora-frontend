import { useState, useRef } from 'react';
import axiosInstance from '@/lib/axios.js';
import axios from 'axios';
import { toast } from "sonner";
import { useAuth } from '../contexts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FaVideo, FaImage } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { Loader2, UploadCloud, X } from 'lucide-react';
import { UPLOAD_MAINTENANCE, MAINTENANCE_MESSAGE } from '@/config/maintenance';

function UploadVideo() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Other");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState("");
  const startTimeRef = useRef(null);
  const abortControllerRef = useRef(null);
  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const { isLoaded } = useAuth();

  const categories = [
    'Education',
    'Entertainment',
    'Gaming',
    'Music',
    'News',
    'Sports',
    'Technology',
    'Other'
  ];

  const handleUpload = async (e) => {
    e.preventDefault();

    if (UPLOAD_MAINTENANCE) {
      toast.error("Upload Unavailable", {
        description: "Upload service is temporarily unavailable. Please try again later."
      });
      return;
    }

    if (!videoFile || !title) {
      toast.error("Missing Required Fields", {
        description: "Please provide a video file and title."
      });
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
    formData.append("category", category);
    formData.append("tags", JSON.stringify(tags));

    const uploadPromise = axiosInstance.post(
      `/video/publish`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        signal: abortControllerRef.current.signal,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);

          if (startTimeRef.current && progress > 0) {
            const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
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
        setVideoFile(null);
        setVideoPreviewUrl(null);
        setThumbnail(null);
        setThumbnailPreviewUrl(null);
        setTitle("");
        setDescription("");
        setCategory("Other");
        setTags([]);
        if (videoInputRef.current) videoInputRef.current.value = "";
        if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
        return "Video uploaded successfully!";
      },
      error: (err) => {
        console.error("Upload failed:", err.response || err);
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

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/,$/, '');
      if (newTag && !tags.includes(newTag) && tags.length < 10) {
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
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Upload Video</h1>
          <p className="text-muted-foreground mt-1">Share your content with the world</p>
        </header>

        <form onSubmit={handleUpload}>
          {UPLOAD_MAINTENANCE && (
            <Card className="mb-6 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="text-orange-600 dark:text-orange-400 text-2xl">🔧</div>
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
            <CardContent className="p-6 grid gap-6 lg:grid-cols-12">
              {/* Video Upload Section */}
              <section className="lg:col-span-7 space-y-4">
                <Label className="font-semibold text-base flex items-center gap-2 text-foreground">
                  <FaVideo className="text-primary" /> Video File <span className="text-red-500">*</span>
                </Label>
                {videoPreviewUrl ? (
                  <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-black border shadow-sm">
                    <video src={videoPreviewUrl} className="w-full h-full object-contain" controls />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => clearSelection('video')}
                      className="absolute top-3 right-3 rounded-full h-9 w-9 shadow-lg"
                    >
                      <MdDelete className="h-5 w-5" />
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor="video-upload"
                    className="flex flex-col items-center justify-center aspect-video border-2 border-dashed rounded-lg cursor-pointer text-center hover:border-primary hover:bg-accent/50 transition-all bg-card"
                  >
                    <UploadCloud className="h-12 w-12 text-muted-foreground mb-3" />
                    <p className="font-medium text-foreground">Click to upload video</p>
                    <p className="text-sm text-muted-foreground mt-2">MP4, MOV, or AVI up to 100MB</p>
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

              {/* Form Fields Section */}
              <aside className="lg:col-span-5 space-y-5">
                {/* Thumbnail */}
                <div className="space-y-2">
                  <Label className="font-semibold text-base flex items-center gap-2 text-foreground">
                    <FaImage className="text-primary" /> Thumbnail
                  </Label>
                  {thumbnailPreviewUrl ? (
                    <div className="relative w-full aspect-video bg-black overflow-hidden rounded-lg border shadow-sm">
                      <img src={thumbnailPreviewUrl} alt="Thumbnail" className="object-contain w-full h-full" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => clearSelection('thumbnail')}
                        className="absolute top-2 right-2 rounded-full h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label
                      htmlFor="thumbnail-upload"
                      className="flex flex-col items-center justify-center aspect-video border-2 border-dashed rounded-lg cursor-pointer text-center hover:border-primary hover:bg-accent/50 transition-all bg-card"
                    >
                      <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Upload custom thumbnail</p>
                      <p className="text-xs text-muted-foreground mt-1">(Optional - auto-generated if not provided)</p>
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

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="font-semibold">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Enter an engaging title"
                    maxLength={100}
                  />
                  <p className="text-xs text-muted-foreground">{title.length}/100 characters</p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="font-semibold">Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    disabled={loading}
                    placeholder="Describe your video... (optional)"
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground">{description.length}/500 characters</p>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="font-semibold">Category</Label>
                  <Select value={category} onValueChange={setCategory} disabled={loading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags" className="font-semibold">
                    Tags <span className="text-xs text-muted-foreground">(Max 10)</span>
                  </Label>
                  <div className="flex flex-wrap gap-2 p-3 border rounded-lg min-h-[44px] bg-background">
                    {tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1 px-2 py-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    <input
                      id="tags"
                      type="text"
                      value={tagInput}
                      onChange={handleTagInputChange}
                      onKeyDown={handleTagInputKeyDown}
                      disabled={loading || tags.length >= 10}
                      className="flex-grow bg-transparent outline-none text-sm min-w-[120px]"
                      placeholder={tags.length >= 10 ? "Max tags reached" : "Add tags (press Enter)"}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Press Enter or comma to add tags</p>
                </div>
              </aside>
            </CardContent>
          </Card>

          {/* Upload Progress & Actions */}
          <div className="mt-6 space-y-4">
            {loading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="w-full h-2" />
                <p className="text-sm text-muted-foreground text-center">
                  Uploading... {uploadProgress}% {timeRemaining && `(${timeRemaining})`}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              {loading && (
                <Button
                  type="button"
                  onClick={cancelUpload}
                  variant="outline"
                >
                  Cancel Upload
                </Button>
              )}
              <Button
                type="submit"
                disabled={loading || UPLOAD_MAINTENANCE}
                size="lg"
                className="min-w-[140px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Publish Video'
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadVideo;
