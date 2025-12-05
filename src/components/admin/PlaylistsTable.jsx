import { useEffect, useState, useMemo, useCallback } from "react";
import { DataTable } from "../ui/data-table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "sonner";
import axios from "../../lib/axios";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

export function PlaylistsTable() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPlaylists: 0,
    totalVideos: 0,
    publicCount: 0,
    privateCount: 0
  });

  const [sorting, setSorting] = useState([{ id: "createdAt", desc: true }]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  const fetchPlaylists = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/admin/playlists");
      // Backend returns playlists directly, not wrapped in data.data
      const playlistData = Array.isArray(data) ? data : (data?.data || []);
      
      const totalVideos = playlistData.reduce((sum, playlist) => sum + (playlist.videos?.length || 0), 0);
      const publicCount = playlistData.filter(p => p.isPublic).length;
      const privateCount = playlistData.length - publicCount;
      
      setStats({
        totalPlaylists: playlistData.length,
        totalVideos,
        publicCount,
        privateCount
      });
      setPlaylists(playlistData);
    } catch (error) {
      toast.error(`Failed to fetch playlists: ${error.response?.data?.message || error.message}`);
      setPlaylists([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const handleDeletePlaylist = useCallback(async (playlistId) => {
    if (!playlistId) return;
    try {
      await axios.delete(`/admin/playlists/${playlistId}`);
      toast.success("Playlist deleted successfully");
      fetchPlaylists();
    } catch (error) {
      toast.error(`Failed to delete playlist: ${error.response?.data?.message || error.message}`);
    }
  }, [fetchPlaylists]);

  const handleBatchDelete = useCallback(() => {
    const selectedIds = Object.keys(rowSelection)
      .map(index => playlists[index]?._id)
      .filter(Boolean);

    if (selectedIds.length === 0) {
      toast.info("No playlists selected for deletion.");
      return;
    }

    toast.promise(
      Promise.all(selectedIds.map(id => axios.delete(`/admin/playlists/${id}`))),
      {
        loading: `Deleting ${selectedIds.length} playlist(s)...`,
        success: () => {
          setRowSelection({});
          fetchPlaylists();
          return `${selectedIds.length} playlist(s) deleted successfully.`;
        },
        error: "Some playlists could not be deleted."
      }
    );
  }, [rowSelection, playlists, fetchPlaylists]);

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
      accessorKey: "name",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const playlist = row.original;
        return (
          <div className="min-w-[200px]">
            <div className="font-medium text-zinc-900 dark:text-zinc-100">
              {playlist.name || "Untitled Playlist"}
            </div>
            {playlist.description && (
              <div className="text-sm text-zinc-500 dark:text-zinc-400 truncate max-w-[300px]" title={playlist.description}>
                {playlist.description}
              </div>
            )}
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
      accessorKey: "isPublic",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Visibility
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const isPublic = row.original.isPublic;
        return (
          <Badge variant={isPublic ? "default" : "secondary"}>
            {isPublic ? "Public" : "Private"}
          </Badge>
        );
      }
    },
    {
      accessorKey: "videos",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Videos
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const count = row.getValue("videos")?.length || 0;
        return (
          <span className="text-zinc-800 dark:text-zinc-200 font-medium">
            {count}
          </span>
        );
      },
      sortingFn: (rowA, rowB) => {
        const countA = rowA.original.videos?.length || 0;
        const countB = rowB.original.videos?.length || 0;
        return countA - countB;
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Created
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
        const playlist = row.original;
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
                onClick={() => navigator.clipboard.writeText(playlist._id)}
                className="text-zinc-700 dark:text-zinc-300"
              >
                Copy Playlist ID
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/20"
                onClick={() => handleDeletePlaylist(playlist._id)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete Playlist
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
    },
  ], [handleDeletePlaylist]);

  const table = useReactTable({
    data: playlists,
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-white dark:bg-zinc-800/50 dark:border-zinc-700/60 p-4 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Total Playlists</h3>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.totalPlaylists}</div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            All playlists
          </p>
        </div>
        <div className="rounded-lg border bg-white dark:bg-zinc-800/50 dark:border-zinc-700/60 p-4 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Total Videos</h3>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalVideos}</div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {stats.totalPlaylists > 0 ? Math.round(stats.totalVideos / stats.totalPlaylists) : 0} avg per playlist
          </p>
        </div>
        <div className="rounded-lg border bg-white dark:bg-zinc-800/50 dark:border-zinc-700/60 p-4 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Public</h3>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.publicCount}</div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {stats.totalPlaylists > 0 ? Math.round((stats.publicCount / stats.totalPlaylists) * 100) : 0}% of total
          </p>
        </div>
        <div className="rounded-lg border bg-white dark:bg-zinc-800/50 dark:border-zinc-700/60 p-4 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Private</h3>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.privateCount}</div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {stats.totalPlaylists > 0 ? Math.round((stats.privateCount / stats.totalPlaylists) * 100) : 0}% of total
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-lg border bg-white dark:bg-zinc-800/50 dark:border-zinc-700/60 p-4 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">All Playlists</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Manage user-created playlists
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Input
              placeholder="Search playlists..."
              value={globalFilter ?? ''}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="max-w-sm"
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={fetchPlaylists}
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
              {Object.keys(rowSelection).length} playlist(s) selected
            </p>
            <Button variant="destructive" size="sm" onClick={handleBatchDelete}>
              <Trash className="mr-2 h-4 w-4" />
              Delete Selected
            </Button>
          </div>
        )}

        <DataTable columns={columns} data={playlists} loading={loading} table={table} />
      </div>
    </div>
  );
}
