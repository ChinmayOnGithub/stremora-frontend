// src/pages/Admin.jsx

import { Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "../components/admin/Sidebar";
import { UsersTable } from "@/components/admin/UsersTable";
import { VideosTable } from "@/components/admin/VideosTable";
import { PlaylistsTable } from "@/components/admin/PlaylistsTable";
// Import other tables as you build them
// import { CommentsTable } from "@/components/admin/CommentsTable";

// This array now defines the navigation links for the sidebar.
const NAV_ITEMS = [
  { label: "Users", key: "users", path: "/admin/users" },
  { label: "Videos", key: "videos", path: "/admin/videos" },
  { label: "Playlists", key: "playlists", path: "/admin/playlists" },
  // { label: "Comments", key: "comments", path: "/admin/comments" },
];

export default function Admin() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar navItems={NAV_ITEMS} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Routes>
          {/* Default route redirects to the users table */}
          <Route path="/" element={<Navigate to="/admin/users" replace />} />
          <Route path="users" element={<UsersTable />} />
          <Route path="videos" element={<VideosTable />} />
          <Route path="playlists" element={<PlaylistsTable />} />
          {/* <Route path="comments" element={<CommentsTable />} /> */}
          {/* Add routes for other admin sections here */}
        </Routes>
      </main>
    </div>
  );
}