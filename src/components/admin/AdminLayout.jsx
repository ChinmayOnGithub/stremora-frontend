// src/pages/AdminLayout.jsx

import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

// This array now defines the navigation links for the admin sidebar.
const NAV_ITEMS = [
  { label: "Users", key: "users", path: "/admin/users" },
  { label: "Videos", key: "videos", path: "/admin/videos" },
  // { label: "Playlists", key: "playlists", path: "/admin/playlists" },
  // { label: "Comments", key: "comments", path: "/admin/comments" },
];

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar navItems={NAV_ITEMS} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* The correct table will be rendered here based on the route */}
        <Outlet />
      </main>
    </div>
  );
}