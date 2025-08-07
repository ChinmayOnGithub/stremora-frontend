import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontal, Trash } from "lucide-react";
import { toast } from "sonner";
import axios from "../../lib/axios";
import { DataTable } from "../ui/data-table";
import { formatDuration } from "../ui/utils"; // Assuming this utility exists

export function VideosTable() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalViews: 0,
    totalLikes: 0,
  });

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/admin/videos');
      const videoData = data || []; // Ensure we have an array

      const totalViews = videoData.reduce((sum, video) => sum + (video.views || 0), 0);
      const totalLikes = videoData.reduce((sum, video) => sum + (video.likesCount || 0), 0);

      setStats({
        totalVideos: videoData.length,
        totalViews,
        totalLikes,
      });
      setVideos(videoData);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred";
      toast.error(`Failed to fetch videos: ${errorMessage}`);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleDeleteVideo = useCallback(async (videoId) => {
    if (!videoId) return;
    try {
      await axios.delete(`/admin/videos/${videoId}`);
      toast.success("Video deleted successfully");
      fetchVideos(); // Re-fetch data to update the UI
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred";
      toast.error(`Failed to delete video: ${errorMessage}`);
    }
  }, [fetchVideos]);

  const columns = useMemo(() => [
    {
      accessorKey: "thumbnail",
      header: "Thumbnail",
      cell: ({ row }) => {
        const video = row.original;
        return video.thumbnail ? (
          <div className="w-24 h-16 overflow-hidden rounded-md bg-muted">
            <img src={video.thumbnail} alt={video.title || 'Video thumbnail'} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-24 h-16 bg-muted rounded flex items-center justify-center">
            <span className="text-xs text-muted-foreground">No Image</span>
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        const video = row.original;
        return (
          <div className="min-w-[200px] max-w-[300px]">
            <div className="font-medium truncate" title={video.title}>{video.title || "Untitled"}</div>
            <div className="text-sm text-muted-foreground truncate" title={video.description}>
              {video.description || "No description"}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "owner",
      header: "Uploader",
      cell: ({ row }) => {
        const owner = row.original.owner;
        return owner?.username ? (
          <div className="flex items-center gap-2">
            {owner.avatar && (
              <img src={owner.avatar} alt={owner.username} className="w-8 h-8 rounded-full object-cover bg-muted" />
            )}
            <span className="font-medium">{owner.username}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">Unknown</span>
        );
      },
    },
    {
      id: "engagement",
      header: "Engagement",
      cell: ({ row }) => {
        const video = row.original;
        return (
          <div className="space-y-1 text-sm">
            <div>{`${(video.views || 0).toLocaleString()} views`}</div>
            <div>{`${(video.likesCount || 0).toLocaleString()} likes`}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => <div className="font-medium">{formatDuration(row.original.duration)}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const video = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(video._id)}>
                Copy Video ID
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => handleDeleteVideo(video._id)}>
                <Trash className="mr-2 h-4 w-4" />
                Delete Video
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [handleDeleteVideo]);

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Total Videos</h3>
          <div className="text-2xl font-bold">{stats.totalVideos}</div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Total Views</h3>
          <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Total Likes</h3>
          <div className="text-2xl font-bold">{stats.totalLikes.toLocaleString()}</div>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-4">
          <h2 className="text-lg font-semibold">All Videos</h2>
        </div>
        <div className="overflow-x-auto">
          <DataTable columns={columns} data={videos} loading={loading} />
        </div>
      </div>
    </div>
  );
}