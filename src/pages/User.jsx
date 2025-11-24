import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth, useVideo } from "../contexts/index.js";
import { useNavigate } from "react-router-dom";
import axiosInstance from '@/lib/axios.js';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { VideoCard, VideoCardDetailed } from "../components/index.js";
import useSubscriberCount from "../hooks/useSubscriberCount.js";
import { LogOut, Pencil, Users, Eye, List, LayoutGrid, Heart, RefreshCw, ServerCrash } from "lucide-react";

// ============================================================================
// My Videos Tab Component
// ============================================================================
const MyVideosTab = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { userVideos, fetchVideos, loading: videosLoading } = useVideo();
  const [sortFilter, setSortFilter] = useState('latest');

  useEffect(() => {
    if (user?._id) {
      fetchVideos(1, 10, user._id);
    }
  }, [user?._id, fetchVideos]);

  const sortedVideos = useMemo(() => {
    if (!userVideos) return [];
    const videosCopy = [...userVideos];
    if (sortFilter === 'latest') {
      return videosCopy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    if (sortFilter === 'oldest') {
      return videosCopy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    if (sortFilter === 'popular') {
      return videosCopy.sort((a, b) => (b.views || 0) - (a.views || 0));
    }
    return videosCopy;
  }, [userVideos, sortFilter]);

  if (videosLoading) {
    return <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"><VideoSkeleton /><VideoSkeleton /><VideoSkeleton /><VideoSkeleton /></div>;
  }

  if (sortedVideos.length === 0) {
    return (
      <p className="text-muted-foreground italic col-span-full text-center py-8">
        You haven't uploaded any videos yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-foreground">My Uploads</h3>
        <ToggleGroup type="single" value={sortFilter} onValueChange={(value) => value && setSortFilter(value)} defaultValue="latest">
          <ToggleGroupItem value="latest" aria-label="Sort by latest">Latest</ToggleGroupItem>
          <ToggleGroupItem value="popular" aria-label="Sort by popular">Popular</ToggleGroupItem>
          <ToggleGroupItem value="oldest" aria-label="Sort by oldest">Oldest</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedVideos.map((video) => (
          <VideoCard
            key={video._id}
            video={video}
            onClick={() => navigate(`/watch/${video._id}`)}
          />
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// Liked Videos Tab Component
// ============================================================================
const LikedVideosTab = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('list');

  const fetchLikedVideos = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/like/get-liked-videos');
      if (response.data.success) {
        setLikedVideos(response.data.data?.videos || []);
      } else {
        throw new Error("Failed to load liked videos.");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An unexpected error occurred.";
      setError(errorMessage);
      toast.error("Error fetching liked videos", { description: errorMessage });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchLikedVideos();
  }, [fetchLikedVideos]);

  if (loading) {
    return <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"><VideoSkeleton /><VideoSkeleton /><VideoSkeleton /><VideoSkeleton /></div>;
  }
  if (error) {
    return (
      <Card className="col-span-full flex flex-col items-center justify-center text-destructive p-8 text-center">
        <ServerCrash className="h-12 w-12 mb-4" />
        <h3 className="text-lg font-semibold">Error Loading Videos</h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={fetchLikedVideos}><RefreshCw className="mr-2 h-4 w-4" /> Try Again</Button>
      </Card>
    );
  }
  if (likedVideos.length === 0) {
    return (
      <p className="text-muted-foreground italic col-span-full text-center py-8">
        You haven't liked any videos yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-foreground">Liked Videos</h3>
        <ToggleGroup type="single" value={view} onValueChange={(value) => value && setView(value)}>
          <ToggleGroupItem value="list" aria-label="List view"><List className="h-4 w-4" /></ToggleGroupItem>
          <ToggleGroupItem value="grid" aria-label="Grid view"><LayoutGrid className="h-4 w-4" /></ToggleGroupItem>
        </ToggleGroup>
      </div>
      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {likedVideos.map(video => <VideoCard key={video._id} video={video} />)}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {likedVideos.map(video => <VideoCardDetailed key={video._id} video={video} />)}
        </div>
      )}
    </div>
  );
};


// ============================================================================
// Main User Profile Component
// ============================================================================
function User() {
  const { user, loading: authLoading, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const { subscriberCount } = useSubscriberCount(user?._id);

  if (authLoading || !user) {
    return <UserProfileSkeleton />;
  }

  return (
    <>
      <div className="w-full">
        <div className="relative w-full h-40 sm:h-56 bg-muted">
          <img
            src={user.coverImage || "https://placehold.co/1200x300/18181b/333333?text=+"}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 sm:-mt-20">
              <div className="relative shrink-0">
                <Avatar className="h-32 w-32 sm:h-36 sm:w-36 border-4 border-background">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute bottom-2 right-2 rounded-full h-8 w-8 bg-background/80 backdrop-blur-sm"
                  onClick={() => navigate(`/user/c/${user.username}`)}
                  title="View your profile as others see it"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between w-full sm:pb-4">
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl font-bold text-foreground">{user.fullname}</h1>
                  <p className="text-muted-foreground">@{user.username}</p>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{subscriberCount.toLocaleString()} Subscribers</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 sm:mt-0">
                  <Button variant="outline" onClick={() => navigate("/user/update-account")}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit Profile
                  </Button>
                  <Button variant="destructive" onClick={() => setShowLogoutModal(true)}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="videos" className="mt-8">
            <TabsList>
              <TabsTrigger value="videos">My Videos</TabsTrigger>
              <TabsTrigger value="playlists">My Playlists</TabsTrigger>
              <TabsTrigger value="liked">Liked Videos</TabsTrigger>
            </TabsList>
            <TabsContent value="videos" className="mt-4">
              <MyVideosTab />
            </TabsContent>
            <TabsContent value="playlists" className="mt-4">
              <p className="text-muted-foreground italic col-span-full text-center py-8">
                You haven't created any playlists yet.
              </p>
            </TabsContent>
            <TabsContent value="liked" className="mt-4">
              <LikedVideosTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <AlertDialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be returned to the login page and will need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={logout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Skeleton component for the user profile loading state
const UserProfileSkeleton = () => (
  <div className="w-full animate-pulse">
    <div className="h-40 sm:h-56 bg-muted"></div>
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 sm:-mt-20">
          <Skeleton className="h-32 w-32 sm:h-36 sm:w-36 rounded-full border-4 border-background" />
          <div className="w-full sm:pb-4 space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
      </div>
      <div className="mt-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {Array.from({ length: 4 }).map((_, i) => <VideoSkeleton key={i} />)}
        </div>
      </div>
    </div>
  </div>
);

// Skeleton component for a single video card
const VideoSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-32 w-full rounded-lg" />
    <Skeleton className="h-5 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
  </div>
);

export default User;
