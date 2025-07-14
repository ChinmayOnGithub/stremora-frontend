import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts";
import { toast } from "sonner";
import { FaHistory, FaSpinner, FaRegSadTear } from "react-icons/fa";
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-2">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-3">
            <FaHistory className="text-2xl text-amber-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Watch History</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={fetchHistory} variant="secondary" className="text-amber-600 dark:text-amber-400">
              Refresh
            </Button>
            {safeHistory.length > 0 && (
              <Button onClick={handleClear} variant="secondary" className="text-red-600 dark:text-red-400">
                <MdDelete className="mr-1.5" /> Clear All
              </Button>
            )}
          </div>
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FaSpinner className="animate-spin text-4xl text-amber-500 mb-4" />
            <span className="text-lg text-gray-700 dark:text-gray-300">Loading history...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FaRegSadTear className="text-4xl text-red-500 mb-4" />
            <span className="text-lg text-red-600 dark:text-red-400">{error}</span>
            <Button onClick={() => setPage(1)} variant="secondary" className="mt-4">Retry</Button>
          </div>
        ) : safeHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FaRegSadTear className="text-4xl text-amber-500 mb-4" />
            <span className="text-lg text-gray-700 dark:text-gray-300">No watch history yet.</span>
            <Link to="/" className="mt-4 text-amber-600 hover:underline">Go to Home</Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {safeHistory.map((entry) => (
                <div key={entry._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col transition hover:shadow-2xl group border border-gray-200 dark:border-gray-700">
                  <Link to={`/watch/${entry.video._id}`} className="block group">
                    <div className="aspect-[16/9] bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-2 relative">
                      <img
                        src={entry.video.thumbnail}
                        alt={entry.video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                      <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                        {entry.video.duration}
                      </span>
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-white truncate mb-1 text-base group-hover:text-amber-600 transition-colors">
                      {entry.video.title}
                    </div>
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Watched: {new Date(entry.watchedAt).toLocaleString()}</span>
                    {entry.completed && (
                      <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded ml-2">Completed</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs mb-2">
                    <span className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">
                      Progress: {(() => {
                        const totalSeconds = durationToSeconds(entry.video.duration);
                        if (!totalSeconds) return '0%';
                        const percent = Math.round((entry.lastPosition / totalSeconds) * 100);
                        return `${Math.min(percent, 100)}%`;
                      })()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Link to={`/user/c/${entry.video.owner.username}`} className="flex items-center gap-2 group-hover:underline">
                      <img
                        src={entry.video.owner.avatar}
                        alt={entry.video.owner.username}
                        className="w-6 h-6 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-xs text-gray-700 dark:text-gray-200">{entry.video.owner.username}</span>
                    </Link>
                    <span className="text-xs text-gray-400 ml-auto">{entry.video.views} views</span>
                  </div>
                  <Button
                    onClick={() => handleRemove(entry.video._id)}
                    variant="secondary"
                    className="text-red-600 dark:text-red-400 mt-auto"
                  >
                    <MdDelete className="mr-1.5" /> Remove
                  </Button>
                </div>
              ))}
            </div>
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <Button
                  variant="secondary"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <Button
                  variant="secondary"
                  disabled={page === pagination.totalPages}
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}