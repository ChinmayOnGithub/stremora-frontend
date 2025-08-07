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
import { ArrowUpDown, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "sonner";
import axios from "../../lib/axios";
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

export function UsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for TanStack Table features
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/admin/users");
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(`Failed to fetch users: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = useCallback(async (userId) => {
    if (!userId) return;
    try {
      await axios.delete(`/admin/users/${userId}`);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (err) {
      toast.error(`Delete failed: ${err.response?.data?.message || err.message}`);
    }
  }, [fetchUsers]);

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
      id: "user",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          User
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      accessorKey: "username", // Sorting will be based on username
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.username || 'avatar'}
              className="w-10 h-10 rounded-full object-cover bg-zinc-100 dark:bg-zinc-700"
            />
            <div className="flex flex-col">
              <span className="font-medium text-zinc-900 dark:text-zinc-100">{user.username || "No Username"}</span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">{user.email || "No Email"}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "fullname",
      header: "Full Name",
      cell: ({ row }) => <span className="text-zinc-800 dark:text-zinc-200">{row.original.fullname || "N/A"}</span>,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original.role;
        return <Badge variant={role === "admin" ? "destructive" : "secondary"}>{role}</Badge>;
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Joined
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span className="text-zinc-600 dark:text-zinc-300">{new Date(row.original.createdAt).toLocaleDateString()}</span>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-zinc-100 dark:hover:bg-zinc-800">
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
                  className="text-red-500 focus:text-red-500"
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

  const table = useReactTable({
    data: users,
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
    <div className="rounded-lg border bg-white dark:border-zinc-700/60 dark:bg-zinc-800/50 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">All Users</h2>
        <Input
          placeholder="Filter by name, email..."
          value={globalFilter ?? ''}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <DataTable columns={columns} data={users} loading={loading} table={table} />
    </div>
  );
}
