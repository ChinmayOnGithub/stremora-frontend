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
  const [stats, setStats] = useState({ 
    totalVideos: 0, 
    totalViews: 0, 
    totalLikes: 0,
    publishedCount: 0,
    draftCount: 0
  });

  const [sorting, setSorting] = useState([{ id: "createdAt", desc: true }]); // Default sort by upload date (newest first)
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/admin/videos');
      // Backend returns videos directly, not wrapped in data.data
      const videoData = Array.isArray(data) ? data : (data?.data || []);

      const totalViews = videoData.reduce((sum, video) => sum + (video.views || 0), 0);
      const totalLikes = videoData.reduce((sum, video) => sum + (video.likesCount || 0), 0);
      const publishedCount = videoData.filter(video => video.isPublished).length;
      const draftCount = videoData.length - publishedCount;

      setStats({ 
        totalVideos: videoData.length, 
        totalViews, 
        totalLikes,
        publishedCount,
        draftCount
      });
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

  const handleTogglePublish = useCallback(async (videoId, currentStatus) => {
    if (!videoId) return;
    try {
      await axios.patch(`/videos/toggle-published/${videoId}`);
      const newStatus = !currentStatus;
      toast.success(`Video ${newStatus ? 'published' : 'unpublished'} successfully`);
      fetchVideos();
    } catch (error) {
      toast.error(`Failed to toggle status: ${error.response?.data?.message || error.message}`);
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
        // Handle both string and object thumbnail formats
        const thumbnailUrl = typeof video.thumbnail === 'string' 
          ? video.thumbnail 
          : video.thumbnail?.url;
        
        return thumbnailUrl ? (
          <div className="w-28 h-16 shrink-0 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <img 
              src={thumbnailUrl} 
              alt={video.title || 'Video thumbnail'} 
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<span class="text-xs text-zinc-500 dark:text-zinc-400 flex items-center justify-center h-full">Failed</span>';
              }}
            />
          </div>
        ) : (
          <div className="w-28 h-16 shrink-0 bg-zinc-100 dark:bg-zinc-800 rounded-md border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">No Image</span>
          </div>
        );
      },
      enableSorting: false,
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
          <div className="min-w-[250px] max-w-[350px]">
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
      accessorKey: "owner.username",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Owner
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const owner = row.original.owner;
        return owner ? (
          <div className="flex items-center gap-2">
            {owner.avatar && (
              <img 
                src={owner.avatar} 
                alt={owner.username} 
                className="w-8 h-8 rounded-full object-cover bg-zinc-100 dark:bg-zinc-700"
              />
            )}
            <span className="text-zinc-800 dark:text-zinc-200">{owner.username}</span>
          </div>
        ) : (
          <span className="text-zinc-500 dark:text-zinc-400">Unknown</span>
        );
      }
    },
    {
      accessorKey: "isPublished",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const video = row.original;
        const isPublished = video.isPublished;
        return (
          <Badge variant={isPublished ? "default" : "secondary"}>
            {isPublished ? "Published" : "Draft"}
          </Badge>
        );
      }
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => {
        const duration = row.original.duration;
        return (
          <span className="text-zinc-700 dark:text-zinc-300">
            {duration ? formatDuration(duration) : "N/A"}
          </span>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "views",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Views
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const views = row.original.views || 0;
        return (
          <span className="text-zinc-800 dark:text-zinc-200 font-medium">
            {views.toLocaleString()}
          </span>
        );
      },
    },
    {
      accessorKey: "likesCount",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Likes
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const likes = row.original.likesCount || 0;
        return (
          <span className="text-zinc-800 dark:text-zinc-200 font-medium">
            {likes.toLocaleString()}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Uploaded
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return (
          <div className="flex flex-col text-sm">
            <span className="text-zinc-800 dark:text-zinc-200">
              {date.toLocaleDateString()}
            </span>
            <span className="text-zinc-500 dark:text-zinc-400 text-xs">
              {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        );
      },
      sortingFn: (rowA, rowB) => {
        const dateA = new Date(rowA.original.createdAt).getTime();
        const dateB = new Date(rowB.original.createdAt).getTime();
        return dateA - dateB;
      },
    },
    {
      id: "actions",
      header: "Actions",
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
            <DropdownMenuContent align="end" className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
              <DropdownMenuLabel className="text-zinc-900 dark:text-zinc-100">Actions</DropdownMenuLabel>
              <DropdownMenuItem 
                onClick={() => handleTogglePublish(video._id, video.isPublished)}
                className="text-zinc-700 dark:text-zinc-300"
              >
                {video.isPublished ? (
                  <>
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                    Unpublish Video
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Publish Video
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => navigator.clipboard.writeText(video._id)}
                className="text-zinc-700 dark:text-zinc-300"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Video ID
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => window.open(`/watch/${video._id}`, '_blank')}
                className="text-zinc-700 dark:text-zinc-300"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Video
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/20" 
                onClick={() => handleDeleteVideo(video._id)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete Video
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
    },
  ], [handleDeleteVideo, handleTogglePublish]);

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-lg border bg-white dark:bg-zinc-800/50 dark:border-zinc-700/60 p-4 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Total Videos</h3>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.totalVideos}</div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {stats.publishedCount} published, {stats.draftCount} drafts
          </p>
        </div>
        <div className="rounded-lg border bg-white dark:bg-zinc-800/50 dark:border-zinc-700/60 p-4 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Published</h3>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.publishedCount}</div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {stats.totalVideos > 0 ? Math.round((stats.publishedCount / stats.totalVideos) * 100) : 0}% of total
          </p>
        </div>
        <div className="rounded-lg border bg-white dark:bg-zinc-800/50 dark:border-zinc-700/60 p-4 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Drafts</h3>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.draftCount}</div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {stats.totalVideos > 0 ? Math.round((stats.draftCount / stats.totalVideos) * 100) : 0}% of total
          </p>
        </div>
        <div className="rounded-lg border bg-white dark:bg-zinc-800/50 dark:border-zinc-700/60 p-4 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Total Views</h3>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalViews.toLocaleString()}</div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {stats.totalVideos > 0 ? Math.round(stats.totalViews / stats.totalVideos).toLocaleString() : 0} avg per video
          </p>
        </div>
        <div className="rounded-lg border bg-white dark:bg-zinc-800/50 dark:border-zinc-700/60 p-4 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Total Likes</h3>
          <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">{stats.totalLikes.toLocaleString()}</div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {stats.totalVideos > 0 ? Math.round(stats.totalLikes / stats.totalVideos).toLocaleString() : 0} avg per video
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-lg border bg-white dark:bg-zinc-800/50 dark:border-zinc-700/60 p-4 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">All Videos</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Manage and monitor all videos on the platform
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Input
              placeholder="Search videos..."
              value={globalFilter ?? ''}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="max-w-sm"
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={fetchVideos}
              disabled={loading}
              className="shrink-0"
            >
              <svg 
                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </Button>
          </div>
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