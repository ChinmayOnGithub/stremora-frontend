import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Eye, 
  Trash2, 
  Loader2, 
  Clock, 
  RefreshCw, 
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Play
} from "lucide-react";

const PAGE_SIZE = 12;

function durationToSeconds(duration) {
  if (!duration) return 0;
  if (typeof duration === "number") return duration;
  const parts = duration.split(":").map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return Number(duration) || 0;
}

export default function History() {
  const { token } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [filter, setFilter] = useState("all");
  const [removingId, setRemovingId] = useState(null);

  const fetchHistory = () => {
    if (!token) return;
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URI}/history`, {
        params: { page, limit: PAGE_SIZE, filter },
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((res) => {
        setHistory(res.data.message.history);
        setPagination(res.data.message.pagination);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load history.");
        toast.error("Cannot fetch history.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHistory();
  }, [token, page, filter]);

  const handleRemove = async (id) => {
    setRemovingId(id);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URI}/history/remove/${id}`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      setHistory((h) => h.filter((e) => e.video._id !== id));
      toast.success("Removed from history");
    } catch {
      toast.error("Removal failed.");
    } finally {
      setRemovingId(null);
    }
  };

  const handleClear = async () => {
    if (!confirm("Clear entire history? This cannot be undone.")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URI}/history/clear`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setHistory([]);
      toast.success("History cleared.");
    } catch {
      toast.error("Clear failed.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Watch History</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {history.length > 0 
                ? `${pagination.totalItems} videos in your history` 
                : "No videos watched yet"}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All videos</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="incomplete">In progress</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="icon"
              onClick={fetchHistory}
              aria-label="Refresh"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            
            {history.length > 0 && (
              <Button 
                variant="destructive"
                onClick={handleClear}
                disabled={loading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="overflow-hidden border">
                <Skeleton className="aspect-video w-full" />
                <div className="p-4">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-3" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="rounded-full h-8 w-8" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-destructive/10 p-4 rounded-full mb-4">
              <X className="w-10 h-10 text-destructive" />
            </div>
            <p className="text-lg font-medium mb-2">Failed to load history</p>
            <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
            <Button onClick={fetchHistory}>Try Again</Button>
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-muted p-4 rounded-full mb-4">
              <Clock className="w-10 h-10 text-primary" />
            </div>
            <p className="text-lg font-medium mb-2">No watch history found</p>
            <p className="text-muted-foreground mb-6 max-w-md">
              Videos you watch will appear here. Start browsing to discover content.
            </p>
            <Link to="/">
              <Button>Browse Videos</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {history.map((entry) => {
              const totalSeconds = durationToSeconds(entry.video.duration);
              const percent = totalSeconds
                ? Math.round((entry.lastPosition / totalSeconds) * 100)
                : 0;
              const avatarFallback = entry.video.owner.username
                ? entry.video.owner.username.slice(0, 2).toUpperCase()
                : "?";
              return (
                <div
                  key={entry._id}
                  className="group bg-card/90 dark:bg-card/80 rounded-xl border border-border shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
                >
                  {/* Thumbnail with progress and delete */}
                  <div className="relative">
                    <Link to={`/watch/${entry.video._id}`} className="block">
                      <div className="aspect-video bg-muted relative overflow-hidden">
                      <img
                        src={entry.video.thumbnail}
                        alt={entry.video.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700/60">
                          <div
                            className="h-full bg-orange-500 transition-all"
                            style={{ width: `${Math.min(percent, 100)}%` }}
                          />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-orange-500 rounded-full p-3">
                            <Play className="w-5 h-5 fill-white text-white" />
                          </div>
                    </div>
                    </div>
                  </Link>
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className="absolute top-2 right-2 rounded-full bg-background/80 hover:bg-destructive/20 text-destructive hover:text-destructive p-2 transition-opacity opacity-0 group-hover:opacity-100"
                            aria-label="Remove"
                            onClick={() => handleRemove(entry.video._id)}
                            disabled={removingId === entry.video._id}
                            type="button"
                          >
                            {removingId === entry.video._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="left">Remove from history</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {entry.completed && (
                      <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 mr-1" /> Completed
                      </span>
                    )}
                  </div>
                  {/* Info section */}
                  <div className="flex flex-col gap-1 px-3 py-2 flex-1 min-h-0">
                    <Link to={`/watch/${entry.video._id}`} className="group">
                      <h3 className="font-medium text-base line-clamp-2 mb-1.5 group-hover:text-orange-500 transition-colors">
                        {entry.video.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="size-6">
                        <AvatarImage src={entry.video.owner.avatar} alt={entry.video.owner.username} />
                        <AvatarFallback className="text-xs">{avatarFallback}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground truncate">
                        {entry.video.owner.username}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        {entry.video.views.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(entry.watchedAt)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
        )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
                <Button
              variant="outline"
              size="sm"
              disabled={page === 1 || loading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
              <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                </Button>
            <div className="text-sm text-muted-foreground">
                  Page {pagination.currentPage} of {pagination.totalPages}
            </div>
                <Button
              variant="outline"
              size="sm"
              disabled={page === pagination.totalPages || loading}
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                >
              Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
        )}
      </div>
    </div>
  );
}
