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

export function PlaylistsTable() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  async function fetchPlaylists() {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/playlists", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch playlists");
      const data = await res.json();
      setPlaylists(data.data || []);
    } catch {
      toast.error("Failed to fetch playlists");
      setPlaylists([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePlaylist(playlistId) {
    try {
      const res = await fetch(`/api/v1/admin/playlists/${playlistId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete playlist");
      toast.success("Playlist deleted successfully");
      fetchPlaylists();
    } catch {
      toast.error("Failed to delete playlist");
    }
  }

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "owner.username",
      header: "Owner",
    },
    {
      accessorKey: "videos",
      header: "Video Count",
      cell: ({ row }) => row.getValue("videos")?.length || 0,
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const playlist = row.original;
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
                onClick={() => navigator.clipboard.writeText(playlist._id)}
              >
                Copy playlist ID
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeletePlaylist(playlist._id)}>
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
    <div>
      <h2 className="text-xl font-semibold mb-4">Playlists</h2>
      <DataTable columns={columns} data={playlists} loading={loading} />
    </div>
  );
}
