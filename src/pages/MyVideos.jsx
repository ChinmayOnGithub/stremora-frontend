import React, { useEffect, useState, useMemo, useCallback } from "react";
import axiosInstance from '@/lib/axios.js';
import { MoreHorizontal, Pencil, Trash2, Video as VideoIcon, Eye, Heart, ArrowUpDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString();
}

function formatNumber(num) {
  if (num == null) return "-";
  return num.toLocaleString();
}

export default function MyVideos() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  const fetchVideos = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(`/video/my-videos`);
      if (!res.data || !res.data.message || !Array.isArray(res.data.message.videos)) {
        throw new Error("Unexpected response from server");
      }
      setVideos(res.data.message.videos);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load videos");
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleDelete = useCallback((videoIds, videoTitles) => {
    const isBatch = Array.isArray(videoIds);
    const titleText = isBatch ? `${videoIds.length} videos` : `"${videoTitles[0]}"`;

    if (!window.confirm(`Are you sure you want to delete ${titleText}? This action cannot be undone.`)) {
      return;
    }

    const deletePromises = videoIds.map(id => axiosInstance.delete(`/video/${id}`));

    toast.promise(Promise.all(deletePromises), {
      loading: `Deleting ${titleText}...`,
      success: () => {
        fetchVideos();
        setRowSelection({}); // Clear selection after batch delete
        return `${isBatch ? 'Videos' : 'Video'} deleted successfully.`;
      },
      error: (err) => err.response?.data?.message || `Failed to delete ${isBatch ? 'some videos' : 'video'}.`,
    });
  }, [fetchVideos]);

  const handleEdit = (videoId) => {
    navigate(`/edit-video/${videoId}`);
  };

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
      accessorKey: "title",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Video
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const video = row.original;
        return (
          <div className="flex items-center gap-3">
            <img src={video.thumbnail} alt={video.title} className="w-24 h-14 rounded-md object-cover bg-muted" />
            <div className="w-[200px]">
              <Link to={`/watch/${video._id}`} className="font-medium truncate block hover:underline" title={video.title}>
                {video.title || "Untitled"}
              </Link>
              <Badge variant={video.isPublished ? "default" : "secondary"} className="mt-1">
                {video.isPublished ? "Published" : "Draft"}
              </Badge>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "views",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Stats
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex flex-col text-sm">
          <span>{formatNumber(row.original.views)} views</span>
          <span className="text-muted-foreground">{formatNumber(row.original.likeCount)} likes</span>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Published
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const video = row.original;
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleEdit(video._id)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => handleDelete([video._id], [video.title])}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ], [handleDelete]);

  // The table instance must be created before any functions that use it.
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

  const handleBatchDelete = useCallback(() => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length === 0) {
      toast.info("No videos selected for deletion.");
      return;
    }
    const selectedIds = selectedRows.map(row => row.original._id);
    const selectedTitles = selectedRows.map(row => row.original.title);
    handleDelete(selectedIds, selectedTitles);
  }, [table, handleDelete]);

  const totalVideos = videos.length;
  const totalViews = videos.reduce((sum, v) => sum + (v.views || 0), 0);
  const totalLikes = videos.reduce((sum, v) => sum + (v.likeCount || 0), 0);

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-foreground">My Videos</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-lg border bg-card text-card-foreground p-5">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                <VideoIcon size={28} className="text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-extrabold leading-tight">{formatNumber(totalVideos)}</div>
                <div className="text-sm font-medium text-muted-foreground">Total Videos</div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card text-card-foreground p-5">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                <Eye size={28} className="text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-extrabold leading-tight">{formatNumber(totalViews)}</div>
                <div className="text-sm font-medium text-muted-foreground">Total Views</div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card text-card-foreground p-5">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                <Heart size={28} className="text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-extrabold leading-tight">{formatNumber(totalLikes)}</div>
                <div className="text-sm font-medium text-muted-foreground">Total Likes</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">All My Videos</h2>
            <Input
              placeholder="Filter by title..."
              value={globalFilter ?? ''}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="max-w-sm"
            />
          </div>

          {Object.keys(rowSelection).length > 0 && (
            <div className="flex items-center gap-4 bg-secondary text-secondary-foreground p-2 rounded-md">
              <p className="text-sm font-medium flex-1">
                {Object.keys(rowSelection).length} video(s) selected
              </p>
              <Button variant="destructive" size="sm" onClick={handleBatchDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected
              </Button>
            </div>
          )}

          <DataTable columns={columns} data={videos} loading={loading} table={table} />
        </div>
      </div>
    </div>
  );
}
