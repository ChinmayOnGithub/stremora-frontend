import { useEffect, useState, useCallback } from "react";
import axiosInstance from '@/lib/axios.js';
import { useAuth } from "../contexts";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  Trash2,
  Loader2,
  Clock,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Helper function to format large numbers
const formatCompactNumber = (number) => {
  if (number === null || number === undefined) return '0';
  if (number < 1000) return number.toString();
  return new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(number);
};

// This is the new, self-contained component for displaying a single history item
const HistoryItem = ({ entry, onRemove, isRemoving, index }) => {
  const navigate = useNavigate();
  const video = entry.video;
  const ownerInitial = video.owner?.username?.charAt(0).toUpperCase() || 'U';
  const watchedAt = entry.watchedAt ? formatDistanceToNow(new Date(entry.watchedAt), { addSuffix: true }) : 'N/A';

  return (
    <div className="group flex items-center gap-4 w-full">
      {typeof index === 'number' && (
        <div className="text-2xl font-bold text-muted-foreground group-hover:text-amber-500 transition-colors">
          {index.toString().padStart(2, '0')}
        </div>
      )}
      <div
        className="flex flex-1 items-center gap-4 sm:gap-6 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-muted"
        onClick={() => navigate(`/watch/${video._id}`)}
      >
        {/* Thumbnail */}
        <div className="relative flex-shrink-0 w-32 sm:w-40 h-20 sm:h-24 rounded-lg overflow-hidden">
          <img
            src={video.thumbnail || '/default-thumbnail.jpg'}
            alt={video.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full font-mono">
            {video.duration || '0:00'}
          </div>
        </div>

        {/* Details Section */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base sm:text-lg text-foreground truncate" title={video.title}>
            {video.title || "Untitled Video"}
          </h3>

          {/* Channel Info */}
          <div className="flex items-center gap-2 mt-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={video.owner?.avatar} alt={video.owner?.username} />
              <AvatarFallback>{ownerInitial}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-xs text-muted-foreground truncate group-hover:text-primary transition-colors">
              {video.owner?.username || 'Unknown Channel'}
            </span>
          </div>

          {/* Meta Stats */}
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground mt-2">
            <span className="flex items-center gap-1.5" title={`${video.views || 0} views`}>
              <Eye size={14} /> {formatCompactNumber(video.views || 0)} views
            </span>
            <span className="text-muted-foreground/50">•</span>
            <span>Watched {watchedAt}</span>
          </div>
        </div>
      </div>
      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-destructive"
        aria-label="Remove from history"
        onClick={() => onRemove(video._id)}
        disabled={isRemoving}
      >
        {isRemoving ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Trash2 className="w-5 h-5" />
        )}
      </Button>
    </div>
  );
};

const PAGE_SIZE = 10;

export default function History() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [filter, setFilter] = useState("all");
  const [removingId, setRemovingId] = useState(null);

  const fetchHistory = useCallback(() => {
    if (!user) return;
    setLoading(true);
    axiosInstance
      .get(`/history`, {
        params: { page, limit: PAGE_SIZE, filter },
      })
      .then((res) => {
        // This is the critical fix. The data is in res.data.message, not res.data.data.
        setHistory(res.data.message.history || []);
        setPagination(res.data.message.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 });
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load history.");
        toast.error("Cannot fetch history.");
      })
      .finally(() => setLoading(false));
  }, [user, page, filter]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleRemove = async (id) => {
    setRemovingId(id);
    try {
      await axiosInstance.delete(`/history/remove/${id}`);
      setHistory((h) => h.filter((e) => e.video._id !== id));
      toast.success("Removed from history");
    } catch {
      toast.error("Removal failed.");
    } finally {
      setRemovingId(null);
    }
  };

  const handleClear = async () => {
    if (!window.confirm("Clear entire watch history? This action cannot be undone.")) return;
    try {
      await axiosInstance.delete(`/history/clear`);
      setHistory([]);
      setPagination({ currentPage: 1, totalPages: 1, totalItems: 0 });
      toast.success("History cleared.");
    } catch {
      toast.error("Failed to clear history.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Watch History</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {pagination.totalItems > 0
                ? `You have ${pagination.totalItems} videos in your history`
                : "No videos watched yet"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Watch History</SelectItem>
                <SelectItem value="completed">Completed Videos</SelectItem>
                <SelectItem value="incomplete">In-progress Videos</SelectItem>
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
                Clear All History
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => <HistorySkeleton key={i} />)}
          </div>
        ) : error ? (
          <Card className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-destructive/10 p-4 rounded-full mb-4">
              <X className="w-10 h-10 text-destructive" />
            </div>
            <p className="text-lg font-medium mb-2">Failed to load history</p>
            <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
            <Button onClick={fetchHistory}>Try Again</Button>
          </Card>
        ) : history.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-16 text-center">
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
          </Card>
        ) : (
          <div className="space-y-3">
            {history.map((entry, index) => (
              <HistoryItem
                key={entry._id}
                entry={entry}
                onRemove={handleRemove}
                isRemoving={removingId === entry.video._id}
                index={index + 1 + (page - 1) * PAGE_SIZE}
              />
            ))}
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

const HistorySkeleton = () => (
  <div className="flex items-center gap-6 p-3">
    <Skeleton className="h-24 w-40 rounded-lg" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  </div>
);
