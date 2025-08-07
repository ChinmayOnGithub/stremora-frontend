import { useEffect, useState } from "react"
import { DataTable } from "../ui/data-table"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "../ui/dropdown-menu"
import { MoreHorizontal, Trash } from "lucide-react"
import { toast } from "sonner"
import axios from "../../lib/axios"

export function UsersTable() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    setLoading(true)
    try {
      const { data } = await axios.get("/admin/users")
      setUsers(data)
    } catch (err) {
      toast.error(`Failed to fetch users: ${err.message}`)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteUser(userId) {
    try {
      await axios.delete(`/admin/users/${userId}`)
      toast.success("User deleted")
      fetchUsers()
    } catch (err) {
      toast.error(`Delete failed: ${err.message}`)
    }
  }

  const columns = [
    {
      Header: "Avatar",
      accessor: "avatar",
      Cell: ({ value }) => (
        <img
          src={value}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
      ),
    },
    { Header: "Username", accessor: "username" },
    { Header: "Email", accessor: "email" },
    { Header: "Full Name", accessor: "fullname" },
    {
      Header: "Role",
      accessor: "role",
      Cell: ({ value }) => {
        const isAdmin = value === "admin"
        return (
          <span
            className={`px-2 py-1 rounded text-sm ${isAdmin
              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
              : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
              }`}
          >
            {value}
          </span>
        )
      },
    },
    {
      Header: "Created At",
      accessor: "createdAt",
      Cell: ({ value }) =>
        new Date(value).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      Header: "Actions",
      id: "actions",
      Cell: ({ row }) => {
        const userId = row.original._id
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(userId)}
              >
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteUser(userId)}>
                <Trash className="mr-2 h-4 w-4 text-red-600" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div>
      {loading ? (
        <div className="text-center py-4 text-muted-foreground">
          Loading users...
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          No users found.
        </div>
      ) : (
        <DataTable columns={columns} data={users} loading={loading} />
      )}
    </div>
  )
}
