import { useEffect, useState, useMemo, useCallback } from "react";
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
import { useAuth } from "../../contexts";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

export function UsersTable() {
  const { user } = useAuth(); // Get current logged-in admin
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminCount: 0,
    userCount: 0,
    verifiedCount: 0
  });

  // State for TanStack Table features
  const [sorting, setSorting] = useState([{ id: "createdAt", desc: true }]); // Default sort by join date (newest first)
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/admin/users");
      // Backend returns users directly, not wrapped in data.data
      const userData = Array.isArray(data) ? data : (data?.data || []);
      
      const adminCount = userData.filter(user => user.role === 'admin').length;
      const userCount = userData.length - adminCount;
      const verifiedCount = userData.filter(user => user.isEmailVerified).length;
      
      setStats({
        totalUsers: userData.length,
        adminCount,
        userCount,
        verifiedCount
      });
      setUsers(userData);
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
    
    // Prevent admin from deleting themselves
    if (userId === user?._id) {
      toast.error("You cannot delete your own account!");
      return;
    }
    
    try {
      await axios.delete(`/admin/users/${userId}`);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (err) {
      toast.error(`Delete failed: ${err.response?.data?.message || err.message}`);
    }
  }, [fetchUsers, user]);

  // ADD THIS FUNCTION
  const handleBatchDelete = useCallback(() => {
    const selectedIds = Object.keys(rowSelection)
      .map(index => users[index]?._id)
      .filter(Boolean);

    if (selectedIds.length === 0) {
      toast.info("No users selected for deletion.");
      return;
    }

    // Prevent admin from deleting themselves in batch
    if (selectedIds.includes(user?._id)) {
      toast.error("Cannot delete your own account! Please deselect yourself.");
      return;
    }

    toast.promise(
      Promise.all(selectedIds.map(id => axios.delete(`/admin/users/${id}`))),
      {
        loading: `Deleting ${selectedIds.length} user(s)...`,
        success: () => {
          setRowSelection({});
          fetchUsers();
          return `${selectedIds.length} user(s) deleted successfully.`;
        },
        error: "Some users could not be deleted."
      }
    );
  }, [rowSelection, users, fetchUsers, user]);

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
        const rowUser = row.original;
        const isCurrentUser = rowUser._id === user?._id;
        
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
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(rowUser._id)}>
                  Copy User ID
                </DropdownMenuItem>
                {isCurrentUser ? (
                  <DropdownMenuItem disabled className="text-zinc-400">
                    <Trash className="mr-2 h-4 w-4" />
                    Cannot Delete Self
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    className="text-red-500 focus:text-red-500"
                    onClick={() => handleDeleteUser(rowUser._id)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete User
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ], [handleDeleteUser, user]);

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
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-white dark:bg-zinc-800/50 dark:border-zinc-700/60 p-4 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Total Users</h3>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.totalUsers}</div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Registered accounts
          </p>
        </div>
        <div className="rounded-lg border bg-white dark:bg-zinc-800/50 dark:border-zinc-700/60 p-4 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Regular Users</h3>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.userCount}</div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {stats.totalUsers > 0 ? Math.round((stats.userCount / stats.totalUsers) * 100) : 0}% of total
          </p>
        </div>
        <div className="rounded-lg border bg-white dark:bg-zinc-800/50 dark:border-zinc-700/60 p-4 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Administrators</h3>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.adminCount}</div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {stats.totalUsers > 0 ? Math.round((stats.adminCount / stats.totalUsers) * 100) : 0}% of total
          </p>
        </div>
        <div className="rounded-lg border bg-white dark:bg-zinc-800/50 dark:border-zinc-700/60 p-4 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Verified Emails</h3>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.verifiedCount}</div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {stats.totalUsers > 0 ? Math.round((stats.verifiedCount / stats.totalUsers) * 100) : 0}% verified
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-lg border bg-white dark:border-zinc-700/60 dark:bg-zinc-800/50 p-4 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">All Users</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Manage user accounts and permissions
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Input
              placeholder="Search users..."
              value={globalFilter ?? ''}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="max-w-sm"
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={fetchUsers}
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
              {Object.keys(rowSelection).length} user(s) selected
            </p>
            <Button variant="destructive" size="sm" onClick={handleBatchDelete}>
              <Trash className="mr-2 h-4 w-4" />
              Delete Selected
            </Button>
          </div>
        )}

        <DataTable columns={columns} data={users} loading={loading} table={table} />
      </div>
    </div>
  );
}