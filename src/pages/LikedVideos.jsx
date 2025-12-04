import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/index.js';
import { Loading } from '../components/index.js';
import VideoCardWithDelete from '../components/video/VideoCardWithDelete';
import axiosInstance from '@/lib/axios.js';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutGrid, Heart, RefreshCw, ServerCrash } from 'lucide-react';
import { toast } from 'sonner';

function LikedVideos() {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('grid');
  const [unlikingId, setUnlikingId] = useState(null);

  const fetchLikedVideos = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/like/get-liked-videos');

      if (response.data.success) {
        setVideos(response.data.data?.videos || []);
      } else {
        throw new Error("Failed to load liked videos.");
      }
    } catch (err) {
      console.error('Error fetching liked videos:', err);
      const errorMessage = err.response?.data?.message || "An unexpected error occurred.";
      setError(errorMessage);
      toast.error("Error", { description: errorMessage });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchLikedVideos();
  }, [fetchLikedVideos]);

  const handleUnlike = async (videoId) => {
    setUnlikingId(videoId);
    try {
      await axiosInstance.post(`/like/toggle-video-like/${videoId}`);
      setVideos((v) => v.filter((video) => video._id !== videoId));
      toast.success("Removed from liked videos");
    } catch (err) {
      console.error('Error unliking video:', err);
      toast.error("Failed to unlike video");
    } finally {
      setUnlikingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-48 w-full rounded-2xl" />
              <div className="flex gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Card className="w-full max-w-md p-8 bg-card">
          <div className="flex flex-col items-center justify-center text-destructive">
            <ServerCrash className="h-16 w-16 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error Loading Videos</h2>
            <p className="mb-6 text-muted-foreground">{error}</p>
            <Button onClick={fetchLikedVideos}>
              <RefreshCw className="mr-2 h-4 w-4" /> Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Card className="w-full max-w-md p-8 bg-card">
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Heart className="h-16 w-16 mb-4 text-red-500/70" />
            <h2 className="text-xl font-semibold mb-2 text-foreground">No Liked Videos Yet</h2>
            <p className="mb-6">Videos you like will appear here.</p>
            <Button onClick={fetchLikedVideos}>
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Liked Videos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            You have liked {videos.length} video(s).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchLikedVideos}
            title="Refresh list"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>

          <ToggleGroup type="single" value={view} onValueChange={(value) => value && setView(value)}>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map(video => (
          <VideoCardWithDelete
            key={video._id}
            video={video}
            onDelete={handleUnlike}
            isDeleting={unlikingId === video._id}
          />
        ))}
      </div>
    </div>
  );
}

export default LikedVideos;
