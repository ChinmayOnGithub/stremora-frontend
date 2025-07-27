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
import axios from "../../lib/axios";

export function UsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    console.log('%c[Admin] Fetching users...', 'color: #0ea5e9; font-weight: bold');
    setLoading(true);
    try {
      const { data } = await axios.get('/admin/users');
      console.log('%c[Admin] Users fetched successfully:', 'color: #059669; font-weight: bold', {
        count: data.length,
        timestamp: new Date().toISOString(),
        sample: data.slice(0, 1) // Log first user as sample
      });
      setUsers(data);
    } catch (error) {
      console.error('%c[Admin] Error fetching users:', 'color: #dc2626; font-weight: bold', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        timestamp: new Date().toISOString()
      });
      toast.error(`Failed to fetch users: ${error.response?.data?.message || error.message}`);
      setUsers([]);
    } finally {
      setLoading(false);
      console.log('%c[Admin] Users fetch completed', 'color: #0ea5e9; font-weight: bold');
    }
  }

  async function handleDeleteUser(userId) {
    console.log('%c[Admin] Deleting user...', 'color: #0ea5e9; font-weight: bold', { userId });
    try {
      await axios.delete(`/admin/users/${userId}`);
      console.log('%c[Admin] User deleted successfully', 'color: #059669; font-weight: bold', {
        userId,
        timestamp: new Date().toISOString()
      });
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error('%c[Admin] Error deleting user:', 'color: #dc2626; font-weight: bold', {
        userId,
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        timestamp: new Date().toISOString()
      });
      toast.error(`Failed to delete user: ${error.response?.data?.message || error.message}`);
    }
  }

  const columns = [
    {
      accessorKey: "avatar",
      header: "Avatar",
      cell: ({ row }) => (
        <img
          src={row.getValue("avatar")}
          alt={row.getValue("username")}
          className="w-10 h-10 rounded-full object-cover"
        />
      )
    },
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "fullname",
      header: "Full Name",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded text-sm ${row.getValue("role") === "admin"
          ? "bg-red-100 text-red-800"
          : "bg-blue-100 text-blue-800"
          }`}>
          {row.getValue("role")}
        </span>
      )
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;

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
                onClick={() => navigator.clipboard.writeText(user._id)}
              >
                Copy user ID
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteUser(user._id)}>
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
      {loading ? (
        <div className="text-center py-4">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          No users found. {/* This will show when the array is empty */}
        </div>
      ) : (
        <DataTable columns={columns} data={users} />
      )}
    </div>
  );
} 