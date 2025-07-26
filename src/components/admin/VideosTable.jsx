import { useEffect, useState } from "react";
import { DataTable } from "../ui/data-table";
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

export function VideosTable() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/admin/videos", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        throw new Error("Failed to fetch videos");
      }

      const videoData = await res.json();
      console.log("Videos data:", videoData);
      setVideos(videoData || []); // The API returns an array directly
    } catch (error) {
      console.error("Error in fetchVideos:", error);
      toast.error(`Failed to fetch videos: ${error.message}`);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteVideo(videoId) {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/admin/videos/${videoId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!res.ok) throw new Error("Failed to delete video");
      toast.success("Video deleted successfully");
      fetchVideos();
    } catch (error) {
      toast.error("Failed to delete video");
      console.error("Error deleting video:", error);
    }
  }

  // Format duration for display
  function formatDuration(duration) {
    if (!duration) return "0:00";

    // Handle different duration formats
    if (typeof duration === "string") {
      // If it's already formatted like "1:10" or "0:30"
      if (duration.includes(":")) return duration;

      // If it's a number string like "15"
      const seconds = parseInt(duration);
      if (!isNaN(seconds)) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
      }
    }

    return duration;
  } const columns = [
    {
      accessorKey: "thumbnail",
      header: "Thumbnail",
      cell: ({ row }) => {
        const video = row.original;
        return video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt="Video thumbnail"
            className="w-24 h-16 object-cover rounded"
          />
        ) : (
          <div className="w-24 h-16 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-xs text-gray-500">No thumbnail</span>
          </div>
        );
      }
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        const video = row.original;
        return (
          <div>
            <div className="font-medium truncate max-w-[200px]">{video.title}</div>
            <div className="text-sm text-muted-foreground truncate max-w-[200px]">{video.description}</div>
          </div>
        );
      }
    },
    {
      accessorKey: "views",
      header: "Engagement",
      cell: ({ row }) => {
        const video = row.original;
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{video.views.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">views</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{video.likesCount || 0}</span>
              <span className="text-xs text-muted-foreground">likes</span>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => {
        const video = row.original;
        return (
          <div className="font-medium">
            {formatDuration(video.duration)}
          </div>
        );
      }
    },
    {
      accessorKey: "createdAt",
      header: "Uploaded",
      cell: ({ row }) => {
        const video = row.original;
        return (
          <div className="font-medium">
            {new Date(video.createdAt).toLocaleDateString()}
          </div>
        );
      }
    },

    {
      id: "actions",
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
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(video._id)}
              >
                Copy video ID
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteVideo(video._id)}>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* Stats Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Videos</h3>
          </div>
          <div className="text-2xl font-bold">{videos.length}</div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Views</h3>
          </div>
          <div className="text-2xl font-bold">
            {videos.reduce((total, video) => total + video.views, 0).toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Likes</h3>
          </div>
          <div className="text-2xl font-bold">
            {videos.reduce((total, video) => total + (video.likesCount || 0), 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-4 flex items-center gap-4">
          <h2 className="text-lg font-semibold">Videos</h2>
          {loading && <div className="text-sm text-muted-foreground">Loading...</div>}
        </div>
        {loading ? (
          <div className="p-8 flex items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              Loading videos...
            </div>
          </div>
        ) : videos.length === 0 ? (
          <div className="p-8 flex items-center justify-center text-muted-foreground">
            No videos found.
          </div>
        ) : (
          <DataTable columns={columns} data={videos} />
        )}
      </div>
    </div>
  );
}
