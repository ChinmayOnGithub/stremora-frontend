// src/pages/AdminLayout.jsx

import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

const NAV_ITEMS = [
  { label: "Users", key: "users", path: "/admin/users" },
  { label: "Videos", key: "videos", path: "/admin/videos" },
  { label: "Playlists", key: "playlists", path: "/admin/playlists" },
  // ... other nav items
];

export default function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      <Sidebar navItems={NAV_ITEMS} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-50 dark:bg-zinc-950">
        <Outlet />
      </main>
    </div>
  );
}