import { useEffect, useState, useCallback } from "react";
import axiosInstance from '@/lib/axios.js';
import { useAuth } from "../contexts";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import VideoCardWithDelete from "../components/video/VideoCardWithDelete";
import {
  Trash2,
  Clock,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const PAGE_SIZE = 20;

export default function History() {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [filter, setFilter] = useState("all");
  const [removingId, setRemovingId] = useState(null);
  const [view, setView] = useState('grid');

  const fetchHistory = useCallback(() => {
    if (!user) return;
    setLoading(true);
    setError(null);
    axiosInstance
      .get(`/history`, {
        params: { page, limit: PAGE_SIZE, filter },
      })
      .then((res) => {
        // Extract videos from history entries
        const historyEntries = res.data.message?.history || [];
        const videoList = historyEntries.map(entry => entry.video).filter(v => v !== null);
        setVideos(videoList);
        setPagination(res.data.message?.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 });
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
      setVideos((v) => v.filter((video) => video._id !== id));
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
      setVideos([]);
      setPagination({ currentPage: 1, totalPages: 1, totalItems: 0 });
      toast.success("History cleared.");
    } catch {
      toast.error("Failed to clear history.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-48 w-full rounded-2xl" />
                <div className="flex gap-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Card className="w-full max-w-md p-8 bg-card">
          <div className="flex flex-col items-center justify-center text-destructive">
            <X className="h-16 w-16 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error Loading History</h2>
            <p className="mb-6 text-muted-foreground">{error}</p>
            <Button onClick={fetchHistory}>
              <RefreshCw className="mr-2 h-4 w-4" /> Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Card className="w-full max-w-md p-8 bg-card">
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Clock className="h-16 w-16 mb-4 text-primary" />
            <h2 className="text-xl font-semibold mb-2 text-foreground">No Watch History Yet</h2>
            <p className="mb-6">Videos you watch will appear here.</p>
            <Link to="/">
              <Button>Browse Videos</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Watch History</h1>
          <p className="text-sm text-muted-foreground mt-1">
            You have watched {pagination.totalItems} video(s).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Videos</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="incomplete">In Progress</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={fetchHistory}
            title="Refresh list"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>

          {videos.length > 0 && (
            <Button
              variant="destructive"
              onClick={handleClear}
              disabled={loading}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}

          <ToggleGroup type="single" value={view} onValueChange={(value) => value && setView(value)}>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map(video => (
          <VideoCardWithDelete
            key={video._id}
            video={video}
            onDelete={handleRemove}
            isDeleting={removingId === video._id}
          />
        ))}
      </div>

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
  );
}
