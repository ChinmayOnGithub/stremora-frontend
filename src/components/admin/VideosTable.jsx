// src/components/admin/VideosTable.jsx

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  ArrowUpDown,
  MoreHorizontal,
  Trash
} from "lucide-react";
import { toast } from "sonner";
import axios from "../../lib/axios";
import { DataTable } from "../ui/data-table";
import { formatDuration } from "../ui/utils";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

export function VideosTable() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalVideos: 0, totalViews: 0, totalLikes: 0 });

  // ... (Your existing state and functions remain the same) ...
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/admin/videos');
      const videoData = data || [];

      const totalViews = videoData.reduce((sum, video) => sum + (video.views || 0), 0);
      const totalLikes = videoData.reduce((sum, video) => sum + (video.likesCount || 0), 0);

      setStats({ totalVideos: videoData.length, totalViews, totalLikes });
      setVideos(videoData);
    } catch (error) {
      toast.error(`Failed to fetch videos: ${error.response?.data?.message || error.message}`);
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
      fetchVideos();
    } catch (error) {
      toast.error(`Failed to delete video: ${error.response?.data?.message || error.message}`);
    }
  }, [fetchVideos]);

  const handleBatchDelete = useCallback(() => {
    const selectedIds = Object.keys(rowSelection).map(index => videos[index]?._id).filter(Boolean);
    if (selectedIds.length === 0) {
      toast.info("No videos selected for deletion.");
      return;
    }
    toast.promise(
      Promise.all(selectedIds.map(id => axios.delete(`/admin/videos/${id}`))),
      {
        loading: `Deleting ${selectedIds.length} videos...`,
        success: () => {
          setRowSelection({});
          fetchVideos();
          return `${selectedIds.length} videos deleted successfully.`;
        },
        error: "Some videos could not be deleted."
      }
    );
  }, [rowSelection, videos, fetchVideos]);

  const columns = useMemo(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "thumbnail",
      header: "Thumbnail",
      cell: ({ row }) => {
        const video = row.original;
        return video.thumbnail ? (
          <div className="w-24 h-14 shrink-0 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
            <img src={video.thumbnail} alt={video.title || 'Video thumbnail'} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-24 h-14 shrink-0 bg-zinc-100 dark:bg-zinc-800 rounded flex items-center justify-center">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">No Image</span>
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const video = row.original;
        return (
          <div className="w-[250px]">
            <div className="font-medium truncate text-zinc-900 dark:text-zinc-100" title={video.title}>
              {video.title || "Untitled"}
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400 truncate" title={video.description}>
              {video.description || "No description provided"}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "isPublished",
      header: "Status",
      cell: ({ row }) => {
        const isPublished = row.original.isPublished;
        return <Badge variant={isPublished ? "default" : "secondary"}>{isPublished ? "Published" : "Unpublished"}</Badge>;
      }
    },
    {
      accessorKey: "owner.username",
      header: "Owner",
      cell: ({ row }) => row.original.owner?.username || <span className="text-zinc-500">Unknown</span>
    },
    {
      accessorKey: "views",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Engagement
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const video = row.original;
        return (
          <div className="flex flex-col text-sm">
            <span className="text-zinc-800 dark:text-zinc-200">{`${(video.views || 0).toLocaleString()} views`}</span>
            <span className="text-zinc-500 dark:text-zinc-400">{`${(video.likesCount || 0).toLocaleString()} likes`}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const video = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(video._id)}>Copy Video ID</DropdownMenuItem>
              <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={() => handleDeleteVideo(video._id)}>
                <Trash className="mr-2 h-4 w-4" />
                Delete Video
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [handleDeleteVideo]);

  const table = useReactTable({
    data: videos,
    columns,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      globalFilter,
      rowSelection,
    },
  });

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border bg-white dark:bg-zinc-800/50 dark:border-zinc-700/60 p-4">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Videos</h3>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.totalVideos}</div>
        </div>
        <div className="rounded-lg border bg-white dark:bg-zinc-800/50 dark:border-zinc-700/60 p-4">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Views</h3>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.totalViews.toLocaleString()}</div>
        </div>
        <div className="rounded-lg border bg-white dark:bg-zinc-800/50 dark:border-zinc-700/60 p-4">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Likes</h3>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.totalLikes.toLocaleString()}</div>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-lg border bg-white dark:bg-zinc-800/50 dark:border-zinc-700/60 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">All Videos</h2>
          <Input
            placeholder="Filter by title..."
            value={globalFilter ?? ''}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
        </div>

        {Object.keys(rowSelection).length > 0 && (
          <div className="flex items-center gap-4 bg-zinc-100 dark:bg-zinc-900/50 border dark:border-zinc-700 p-2 rounded-md">
            <p className="text-sm font-medium flex-1 text-zinc-800 dark:text-zinc-300">
              {Object.keys(rowSelection).length} video(s) selected
            </p>
            <Button variant="destructive" size="sm" onClick={handleBatchDelete}>
              <Trash className="mr-2 h-4 w-4" />
              Delete Selected
            </Button>
          </div>
        )}

        <DataTable columns={columns} data={videos} loading={loading} table={table} />
      </div>
    </div>
  );
}