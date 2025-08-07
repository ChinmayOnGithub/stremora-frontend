import React, { useEffect, useState, useMemo, useCallback } from "react";
import { DataTable } from "../ui/data-table";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { MoreHorizontal, Trash } from "lucide-react";
import { toast } from "sonner";
import axios from "../../lib/axios";

export function UsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // useCallback ensures this function has a stable reference across re-renders,
  // preventing infinite loops in the useEffect hook.
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/admin/users");
      // Ensure data is an array to prevent crashes.
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "An unknown error occurred";
      toast.error(`Failed to fetch users: ${errorMessage}`);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // useCallback stabilizes this function so it can be used in the useMemo dependency array.
  const handleDeleteUser = useCallback(async (userId) => {
    if (!userId) return; // Guard against missing ID
    try {
      await axios.delete(`/admin/users/${userId}`);
      toast.success("User deleted successfully");
      fetchUsers(); // Re-fetch users to update the table
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "An unknown error occurred";
      toast.error(`Delete failed: ${errorMessage}`);
    }
  }, [fetchUsers]);

  // useMemo prevents the columns array from being recreated on every render,
  // which is a crucial performance optimization for tables.
  const columns = useMemo(() => [
    {
      accessorKey: "avatar",
      header: "User",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.username || 'avatar'}
              className="w-10 h-10 rounded-full object-cover bg-muted"
            />
            <div className="flex flex-col">
              <span className="font-medium">{user.username || "No Username"}</span>
              <span className="text-sm text-muted-foreground">{user.email || "No Email"}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "fullname",
      header: "Full Name",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original.role;
        const isAdmin = role === "admin";
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${isAdmin
              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
              : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
              }`}
          >
            {role}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
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
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user._id)}>
                  Copy User ID
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  onClick={() => handleDeleteUser(user._id)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ], [handleDeleteUser]);

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-4">
        <h2 className="text-lg font-semibold">All Users</h2>
      </div>
      <div className="overflow-x-auto">
        <DataTable columns={columns} data={users} loading={loading} />
      </div>
    </div>
  );
}
