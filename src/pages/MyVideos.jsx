import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { MoreHorizontal, Pencil, Trash2, BarChart2, Copy, AlertCircle, Video as VideoIcon, Eye, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { useAuth } from "../contexts";

const PAGE_SIZE = 10;
const columns = [
  { key: "serial", label: "#" },
  { key: "video", label: "Video" },
  { key: "duration", label: "Length" },
  { key: "views", label: "Views" },
  { key: "commentCount", label: "Comments" },
  { key: "likeCount", label: "Likes" },
  { key: "createdAt", label: "Published" },
  { key: "actions", label: "Actions" },
];

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toISOString().slice(0, 10);
}

function formatNumber(num) {
  if (num == null) return "-";
  return num.toLocaleString();
}

function compare(a, b, key, dir) {
  if (key === "video") {
    // Alphabetical by title
    return dir === "asc"
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title);
  }
  if (["views", "commentCount", "likeCount"].includes(key)) {
    return dir === "asc"
      ? (a[key] || 0) - (b[key] || 0)
      : (b[key] || 0) - (a[key] || 0);
  }
  if (key === "createdAt") {
    return dir === "asc"
      ? new Date(a.createdAt) - new Date(b.createdAt)
      : new Date(b.createdAt) - new Date(a.createdAt);
  }
  if (key === "duration") {
    // Parse mm:ss or h:mm:ss to seconds
    const toSec = (d) => {
      if (!d) return 0;
      const parts = d.split(":").map(Number);
      if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
      if (parts.length === 2) return parts[0] * 60 + parts[1];
      return Number(d) || 0;
    };
    return dir === "asc"
      ? toSec(a.duration) - toSec(b.duration)
      : toSec(b.duration) - toSec(a.duration);
  }
  return 0;
}

function MyVideos() {
  const { token } = useAuth();
  const [videos, setVideos] = useState([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchVideos() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/video/my-videos`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        // Defensive: check for expected structure
        if (!res.data || !res.data.message || !Array.isArray(res.data.message.videos)) {
          setError("Unexpected response from server");
          setVideos([]);
        } else {
          setVideos(res.data.message.videos);
        }
      } catch (err) {
        // Handle 401/403
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setError("You are not authorized. Please log in again.");
        } else if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else if (err.message && err.message.includes("Network Error")) {
          setError("Network error: Could not connect to server.");
        } else {
          setError("Failed to load videos");
        }
        setVideos([]);
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchVideos();
  }, [token]);

  // Sorting
  const sortedVideos = useMemo(() => {
    const arr = [...videos];
    arr.sort((a, b) => compare(a, b, sortBy, sortDir));
    return arr;
  }, [videos, sortBy, sortDir]);

  // Pagination
  const totalVideos = videos.length;
  const totalViews = videos.reduce((sum, v) => sum + (v.views || 0), 0);
  const totalLikes = videos.reduce((sum, v) => sum + (v.likeCount || 0), 0);
  const totalPages = Math.ceil(sortedVideos.length / PAGE_SIZE) || 1;
  const pagedVideos = sortedVideos.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const startIdx = (page - 1) * PAGE_SIZE + 1;
  const endIdx = Math.min(page * PAGE_SIZE, sortedVideos.length);

  const handleSort = (key) => {
    if (key === "actions" || key === "serial") return;
    if (sortBy === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir("desc");
    }
    setPage(1);
  };

  const handleEdit = (video) => {
    alert(`Edit video: ${video.title}`);
  };
  const handleDelete = (video) => {
    alert(`Delete video: ${video.title}`);
  };
  const handleViewStats = (video) => {
    alert(`View stats for: ${video.title}`);
  };
  const handleCopyLink = (video) => {
    navigator.clipboard.writeText(window.location.origin + "/watch/" + video._id);
    alert("Link copied!");
  };

  // Pagination controls
  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">My Videos</h1>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Total Videos */}
          <div className="flex items-center gap-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-5">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-700">
              <VideoIcon size={28} className="text-neutral-500 dark:text-neutral-300" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 leading-tight">{formatNumber(totalVideos)}</div>
              <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Videos</div>
            </div>
          </div>
          {/* Total Views */}
          <div className="flex items-center gap-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-5">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-700">
              <Eye size={28} className="text-neutral-500 dark:text-neutral-300" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 leading-tight">{formatNumber(totalViews)}</div>
              <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Views</div>
            </div>
          </div>
          {/* Total Likes */}
          <div className="flex items-center gap-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-5">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-700">
              <Heart size={28} className="text-neutral-500 dark:text-neutral-300" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 leading-tight">{formatNumber(totalLikes)}</div>
              <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Likes</div>
            </div>
          </div>
        </div>
        {/* Table Container */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-neutral-100 dark:bg-neutral-800/80">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={clsx(
                        "px-4 py-3 text-left font-semibold text-neutral-700 dark:text-neutral-300 border-b border-neutral-200 dark:border-neutral-700 align-middle",
                        col.key !== "actions" && col.key !== "serial" && "hover:text-primary-500 dark:hover:text-primary-400 transition-colors cursor-pointer select-none"
                      )}
                      onClick={() => handleSort(col.key)}
                      style={{ minWidth: col.key === 'video' ? 220 : undefined }}
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        {sortBy === col.key && (
                          <span className="text-xs opacity-80">{sortDir === "asc" ? "▲" : "▼"}</span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    {columns.map((col, idx) => (
                      <td
                        key={col.key}
                        className={clsx(
                          "py-12",
                          idx === 0 ? "pl-4" : "",
                          idx === columns.length - 1 ? "pr-4" : "",
                          "text-neutral-500 dark:text-neutral-400 align-middle"
                        )}
                      >
                        {idx === Math.floor(columns.length / 2) ? (
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                          </div>
                        ) : null}
                      </td>
                    ))}
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-8 text-red-500 dark:text-red-400">
                      <div className="flex items-center justify-center gap-2">
                        <AlertCircle size={18} />
                        {error}
                      </div>
                    </td>
                  </tr>
                ) : pagedVideos.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <VideoIcon size={24} />
                        <span>No videos found. Upload your first video!</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  pagedVideos.map((video, idx) => (
                    <tr
                      key={video._id}
                      className={clsx(
                        "border-b border-neutral-100 dark:border-neutral-700",
                        idx % 2 === 0 ? "bg-white dark:bg-neutral-900" : "bg-neutral-50 dark:bg-neutral-800",
                        "transition-colors group"
                      )}
                    >
                      {/* Serial number (leftmost) */}
                      <td className="px-4 py-3 text-neutral-400 dark:text-neutral-500 font-mono text-xs text-right whitespace-nowrap">
                        {startIdx + idx}
                      </td>
                      {/* Thumbnail + Title */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 min-w-[200px]">
                          <div className="relative w-20 h-12 flex-shrink-0 rounded-md overflow-hidden bg-neutral-200 dark:bg-neutral-700">
                            <img
                              src={video.thumbnail || "/public/loader.svg"}
                              alt={video.title || "Video Thumbnail"}
                              className="object-cover w-full h-full"
                              onError={e => { e.target.onerror = null; e.target.src = "/public/loader.svg"; }}
                            />
                            <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] px-1 py-0.5 rounded text-white font-mono">
                              {video.duration || '-'}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <Link
                              to={`/watch/${video._id}`}
                              className="font-medium truncate max-w-[160px] text-primary-700 dark:text-primary-400 underline-offset-2 hover:underline focus:underline focus:outline-none"
                              title={video.title || 'Untitled Video'}
                            >
                              {video.title ? (video.title.length > 32 ? video.title.slice(0, 29) + '...' : video.title) : 'Untitled'}
                            </Link>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-[160px]">
                              {video.owner?.username || 'Unknown'}
                            </div>
                            <span className={clsx(
                              "inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium border",
                              typeof video.isPublished === 'boolean' ? (video.isPublished ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800' : 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800') : 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-800'
                            )}>
                              {typeof video.isPublished === 'boolean' ? (video.isPublished ? 'Public' : 'Draft') : 'Draft'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-sm text-neutral-700 dark:text-neutral-300 whitespace-nowrap">{video.duration || '-'}</td>
                      <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300 whitespace-nowrap">{formatNumber(video.views || 0)}</td>
                      <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300 whitespace-nowrap">{formatNumber(video.commentCount || 0)}</td>
                      <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300 whitespace-nowrap">{formatNumber(video.likeCount || 0)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-neutral-700 dark:text-neutral-300">{formatDate(video.createdAt)}</td>
                      {/* Actions - Always visible */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(video)}
                            className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none"
                            aria-label="Edit video"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleViewStats(video)}
                            className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none"
                            aria-label="View stats"
                          >
                            <BarChart2 size={16} />
                          </button>
                          <button
                            onClick={() => handleCopyLink(video)}
                            className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none"
                            aria-label="Copy link"
                          >
                            <Copy size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(video)}
                            className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900/30 focus:outline-none"
                            aria-label="Delete video"
                          >
                            <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700">
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              {sortedVideos.length > 0 && (
                <span>
                  Showing <b>{startIdx}</b>–<b>{endIdx}</b> of <b>{sortedVideos.length}</b>
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => goToPage(i + 1)}
                  className={clsx(
                    "px-3 py-1 rounded border border-neutral-200 dark:border-neutral-700",
                    i + 1 === page
                      ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-bold"
                      : "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  )}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-1 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyVideos;