import { useState } from "react";
import { Sidebar } from "../components/admin/Sidebar";
import { UsersTable } from "@/components/admin/UsersTable";
import { VideosTable } from "@/components/admin/VideosTable";
// import { PlaylistsTable } from "@/components/admin/PlaylistsTable";
// import { CommentsTable } from "@/components/admin/CommentsTable";
// import { HistoryTable } from "@/components/admin/HistoryTable";
// import { LikesTable } from "@/components/admin/LikesTable";
// import { SubscriptionsTable } from "@/components/admin/SubscriptionsTable";
// import { TweetsTable } from "@/components/admin/TweetsTable";

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
        {section === "videos" && <VideosTable />}
        {/* {section === "playlists" && <PlaylistsTable />}
        {section === "comments" && <CommentsTable />}
        {section === "history" && <HistoryTable />}
        {section === "likes" && <LikesTable />}
        {section === "subscriptions" && <SubscriptionsTable />}
        {section === "tweets" && <TweetsTable />} */}
      </main>
    </div>
  );
}
