// src/components/admin/Sidebar.jsx

import { NavLink, Link } from "react-router-dom";
import { cn } from "@/lib/utils"; // Assuming you have this utility from shadcn
import { useAuth } from "../../contexts"; // Assuming this is the correct path
import {
  Users,
  Video,
  ListMusic,
  MessageSquare,
  Home,
  LogOut,
} from "lucide-react";
import { ThemeToggle } from "../theme/theme-toggle2";

const ICONS = {
  users: Users,
  videos: Video,
  playlists: ListMusic,
  comments: MessageSquare,
  // Add other icons as needed
};

export function Sidebar({ navItems }) {
  const { logout } = useAuth();

  return (
    // The 'dark' class here forces a dark theme for all child elements
    <aside className="dark w-64 border-r border-slate-200/10 bg-slate-900 flex flex-col p-4 text-slate-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 px-2">
        <h2 className="text-xl font-semibold tracking-tight text-white">
          Admin Panel
        </h2>
        <ThemeToggle />
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = ICONS[item.key];
          return (
            <NavLink
              key={item.key}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "w-full px-3 py-2 rounded-md flex items-center gap-3 transition-colors group text-left",
                  isActive
                    ? "bg-slate-800 text-white border-l-4 border-amber-400 pl-2" // Enhanced active style
                    : "hover:bg-slate-800 hover:text-white"
                )
              }
            >
              {Icon && <Icon className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors" />}
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="mt-auto pt-4 border-t border-slate-700/50">
        <div className="space-y-1">
          <Link
            to="/"
            className="w-full px-3 py-2 rounded-md flex items-center gap-3 transition-colors group text-left text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <Home className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
            <span className="text-sm font-medium">Back to App</span>
          </Link>

          <button
            onClick={logout}
            className="w-full px-3 py-2 rounded-md flex items-center gap-3 transition-colors group text-left text-slate-400 hover:bg-slate-800"
          >
            <LogOut className="w-5 h-5 text-slate-500 group-hover:text-red-400 transition-colors" />
            <span className="text-sm font-medium group-hover:text-red-400">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}