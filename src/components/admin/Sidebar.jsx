// src/components/admin/Sidebar.jsx

import { NavLink, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "../../contexts";
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
};

export function Sidebar({ navItems }) {
  const { logout } = useAuth();

  return (
    <aside className="dark w-64 border-r border-zinc-200/10 bg-zinc-900 flex flex-col p-4 text-zinc-300">
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
                    ? "bg-zinc-800 text-white border-l-4 border-amber-400 pl-2"
                    : "hover:bg-zinc-800 hover:text-white"
                )
              }
            >
              {Icon && <Icon className="w-5 h-5 text-zinc-500 group-hover:text-amber-400 transition-colors" />}
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="mt-auto pt-4 border-t border-zinc-700/50">
        <div className="space-y-1">
          <Link
            to="/"
            className="w-full px-3 py-2 rounded-md flex items-center gap-3 transition-colors group text-left text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <Home className="w-5 h-5 text-zinc-500 group-hover:text-amber-400 transition-colors" />
            <span className="text-sm font-medium">Back to App</span>
          </Link>

          <button
            onClick={logout}
            className="w-full px-3 py-2 rounded-md flex items-center gap-3 transition-colors group text-left text-zinc-400 hover:bg-zinc-800"
          >
            <LogOut className="w-5 h-5 text-zinc-500 group-hover:text-red-400 transition-colors" />
            <span className="text-sm font-medium group-hover:text-red-400">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}