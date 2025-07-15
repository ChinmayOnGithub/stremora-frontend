import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts";
import { toast } from "sonner";
import { FaHistory, FaSpinner, FaRegSadTear, FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Button from "../components/ui/Button/Button";
import { Link } from "react-router-dom";

const PAGE_SIZE = 12;

// Helper to convert duration string (e.g. '0:14') to seconds
function durationToSeconds(duration) {
  if (!duration) return 0;
  if (typeof duration === 'number') return duration;
  const parts = duration.split(':').map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return Number(duration) || 0;
}

export default function History() {
  const { token } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  const fetchHistory = () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URI}/history`, {
        params: { page, limit: PAGE_SIZE },
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((res) => {
        setHistory(res.data.message.history);
        setPagination(res.data.message.pagination);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || err.message || "Failed to fetch history."
        );
        toast.error("Failed to load history");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHistory();
  }, [token, page]);

  const handleRemove = async (videoId) => {
    if (!window.confirm("Remove this video from your history?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URI}/history/remove/${videoId}`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      setHistory((h) => h.filter((entry) => entry.video._id !== videoId));
      toast.success("Removed from history");
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to remove from history."
      );
    }
  };

  const handleClear = async () => {
    if (!window.confirm("Clear your entire watch history?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URI}/history/clear`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setHistory([]);
      toast.success("History cleared");
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to clear history."
      );
    }
  };

  const safeHistory = Array.isArray(history) ? history : [];

  return (
    <div className="min-h-screen text-foreground py-0 px-4">
      <div className="max-w-6xl mx-auto mt-8 px-4 pb-4">
        {/* Header, matching LikedVideos */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Watch History
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchHistory}
              className="flex items-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              title="Refresh list"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M5.582 9A7.003 7.003 0 0112 5c3.314 0 6.127 2.163 6.816 5M18.418 15A7.003 7.003 0 0112 19a6.978 6.978 0 01-6.816-5" /></svg>
            </button>
            {safeHistory.length > 0 && (
              <button
                onClick={handleClear}
                className="flex items-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-red-500"
                title="Clear All"
              >
                <MdDelete className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* List-style, info-rich, professional card layout, matching VideoCardDetailed */}
        <div className="flex flex-col gap-4 mb-4">
          {safeHistory.map((entry) => {
            const totalSeconds = durationToSeconds(entry.video.duration);
            const percent = totalSeconds
              ? Math.round((entry.lastPosition / totalSeconds) * 100)
              : 0;
            return (
              <div
                key={entry._id}
                className="group flex bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden min-h-[112px] h-[112px] relative hover:shadow-lg transition-shadow"
              >
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-40 h-full relative">
                  <Link to={`/watch/${entry.video._id}`}> 
                    <img
                      src={entry.video.thumbnail}
                      alt={entry.video.title}
                      className="w-full h-full object-cover rounded-l-lg"
                    />
                    {/* Progress Bar */}
                    <div className="absolute left-0 right-0 bottom-0 h-1 bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-1 bg-amber-500 transition-all"
                        style={{ width: `${Math.min(percent, 100)}%` }}
                      ></div>
                    </div>
                  </Link>
                </div>
                {/* Details */}
                <div className="flex flex-col flex-1 py-2 px-4 min-w-0 justify-between">
                  {/* Title at the top */}
                  <div className="min-w-0">
                    <div className="font-bold text-base text-gray-900 dark:text-white truncate mb-1">
                      <Link to={`/watch/${entry.video._id}`}>{entry.video.title}</Link>
                    </div>
                    {/* Channel row */}
                    <div className="flex items-center gap-2 mb-1">
                      <img
                        src={entry.video.owner.avatar}
                        alt={entry.video.owner.username}
                        className="w-6 h-6 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                      />
                      <span className="font-medium text-xs text-gray-800 dark:text-gray-200 truncate">
                        {entry.video.owner.username}
                      </span>
                    </div>
                  </div>
                  {/* Meta row at the bottom */}
                  <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 mt-1">
                    <span className="flex items-center gap-1 min-w-0">
                      <FaEye className="w-4 h-4" />
                      {entry.video.views}
                    </span>
                    <span className="flex items-center gap-1 min-w-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {new Date(entry.watchedAt).toLocaleDateString()}
                    </span>
                    {entry.completed && (
                      <span className="bg-emerald-700/40 text-emerald-300 px-1.5 py-0.5 rounded text-[10px]">
                        Completed
                      </span>
                    )}
                  </div>
                </div>
                {/* Actions: three dots, delete icon on hover only */}
                <div className="flex flex-col items-center justify-center w-12 h-full relative">
                  <button
                    className="opacity-100 group-hover:opacity-0 transition-opacity duration-200 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    tabIndex={-1}
                    aria-label="More"
                    disabled
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><circle cx="4" cy="10" r="2"/><circle cx="10" cy="10" r="2"/><circle cx="16" cy="10" r="2"/></svg>
                  </button>
                  <button
                    onClick={() => handleRemove(entry.video._id)}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30"
                    aria-label="Delete from history"
                  >
                    <MdDelete className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-4">
            <Button
              variant="secondary"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ⬅ Prev
            </Button>
            <span className="px-4 py-2 text-gray-300 text-sm">
              Page {pagination.currentPage} / {pagination.totalPages}
            </span>
            <Button
              variant="secondary"
              disabled={page === pagination.totalPages}
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            >
              Next ➡
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}