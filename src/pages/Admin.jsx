import { useState } from "react";
import { UsersTable } from "../components/admin/UsersTable";
import { VideosTable } from "../components/admin/VideosTable";

export default function Admin() {
  const [section, setSection] = useState("users");

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
          <nav className="space-y-2">
            <button
              onClick={() => setSection("users")}
              className={`w-full text-left px-4 py-2 rounded transition-colors ${section === "users"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
                }`}
            >
              Users
            </button>
            <button
              onClick={() => setSection("videos")}
              className={`w-full text-left px-4 py-2 rounded transition-colors ${section === "videos"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
                }`}
            >
              Videos
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            {section === "users" ? "Users" : "Videos"}
          </h1>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="p-6">
            {section === "users" ? (
              <UsersTable />
            ) : (
              <VideosTable />
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 