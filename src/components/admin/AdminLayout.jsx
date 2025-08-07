// src/pages/AdminLayout.jsx

import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

const NAV_ITEMS = [
  { label: "Users", key: "users", path: "/admin/users" },
  { label: "Videos", key: "videos", path: "/admin/videos" },
  // ... other nav items
];

export default function AdminLayout() {
  return (
    // The forced 'dark' class is removed. We now use standard light/dark mode classes.
    <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-900">
      <Sidebar navItems={NAV_ITEMS} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}