import { useState } from "react";
import { Sidebar } from "../components/admin/Sidebar";
import { UsersTable } from "../components/admin/UsersTable";

const NAV = [
  { label: "Users", key: "users" },
  { label: "Videos", key: "videos" },
  { label: "Playlists", key: "playlists" },
  { label: "Comments", key: "comments" },
  { label: "History", key: "history" },
  { label: "Likes", key: "likes" },
  { label: "Subscriptions", key: "subscriptions" },
  { label: "Tweets", key: "tweets" },
];

export default function Admin() {
  const [section, setSection] = useState("users");

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar nav={NAV} section={section} setSection={setSection} />
      <main className="flex-1 p-8">
        {section === "users" && <UsersTable />}
        {/* TODO: Add other tables for videos, playlists, etc. */}
      </main>
    </div>
  );
} 