import { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth, useUser, useVideo } from '../contexts/index.js';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '@/lib/axios.js';
import Loading from '../components/Loading/Loading.jsx';
import SubscribeButton from '../components/ui/SubscribeButton/SubscribeButton.jsx';
import CommentSection from '../components/CommentSection/CommentSection.jsx';
import { LikeButton } from '../components/index.js';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Eye, ServerCrash } from 'lucide-react';

// Helper to convert duration string (e.g. '0:14') to seconds
function durationToSeconds(duration) {
  if (!duration) return 0;
  if (typeof duration === 'number') return duration;
  const parts = duration.split(':').map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return Number(duration) || 0;
}

function Watch() {
  const { videoId } = useParams();
  const { loading: videoLoading, setLoading, timeAgo } = useVideo();
  const { subscriptions = [], isSubscribed, updateSubscriptions } = useUser();
  const { user, token } = useAuth();

  const [video, setVideo] = useState(null);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const hasCountedView = useRef(false);
  const lastProgressUpdate = useRef(0);

  useEffect(() => {
    // Require both video data and authenticated user
    if (!video?._id || !user?._id || hasCountedView.current) return;

    const durationSec = durationToSeconds(video.duration || 0);
    console.log('Initial view count ->', { videoId, duration: durationSec });

    axiosInstance.put(`/video/view/${videoId}`, {
      position: 0,
      duration: durationSec
    })
      .then(res => {
        // only mark counted on success
        hasCountedView.current = true;
        console.log('View counted response:', res?.data);
      })
      .catch(error => {
        console.error('View count error details:', error?.response || error);
        // show toast only for non-auth errors (keeps UX clean on 401)
        if (error?.response?.status !== 401) {
          toast.error('Failed to record view');
        }
      });
  }, [videoId, video, user]); // runs when video or user becomes available

  // Fetch video by ID - Your original, working logic
  useEffect(() => {
    setLoading(true);
    axiosInstance.get(`/video/get-video-by-id/${videoId}`)
      .then((res) => {
        if (res.data.success) {
          setVideo(res.data.message);
        }
      })
      .catch((err) => {
        console.error("Error fetching Video", err);
        toast.error("Failed to load video. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [videoId, token, setLoading]);

  // Fetch subscriber count - Your original, working logic
  useEffect(() => {
    if (!video?.owner?._id) return;
    axiosInstance.get(`/subscription/get-subscriber-count/${video.owner._id}`)
      .then((res) => {
        if (res.data.success) {
          setSubscriberCount(res.data.message.subscriberCount);
        }
      })
      .catch((err) => {
        console.error("Error fetching subscriber count", err);
      });
  }, [video?.owner?._id, isSubscribed]); // Refetch when subscription status changes

  // Your original watch progress tracking logic
  const handleProgress = (event) => {
    if (!user) return;
    const player = event.target;
    const position = Math.floor(player.currentTime || 0);
    const duration = Math.floor(player.duration || 0);

    // only send meaningful updates (avoid NaN/0 duration)
    if (duration <= 0) return;

    // throttle: update roughly every 10s of progress change
    if (Math.abs(position - lastProgressUpdate.current) > 10) {
      lastProgressUpdate.current = position;
      console.log('Progress update ->', { videoId, position, duration });

      axiosInstance.put(`/video/view/${videoId}`, { position, duration })
        .catch(err => console.error('Failed to update watch history:', err));
    }
  };

  if (videoLoading) return <Loading message="Loading Video..." />;
  if (!video && !videoLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Card className="w-full max-w-md p-8">
          <div className="flex flex-col items-center justify-center text-destructive">
            <ServerCrash className="h-16 w-16 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Could Not Load Video</h2>
            <p className="mb-6 text-muted-foreground">The video you are looking for does not exist or could not be loaded.</p>
            <Link to="/">
              <Button>Go Home</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const ownerInitial = video.owner?.username?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {/* Video Player */}
          <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg bg-black">
            <video
              key={video._id}
              src={video?.videoFile?.url || video?.videoFile}
              className="w-full h-full"
              controls
              autoPlay
              playsInline
              muted
              preload="auto"
              onTimeUpdate={handleProgress}
            >
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Video Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {video?.title}
          </h1>

          {/* Channel Info & Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link to={`/user/c/${video?.owner?.username}`} className="flex items-center gap-3 group">
              <Avatar className="h-12 w-12">
                <AvatarImage src={video?.owner?.avatar} alt={video?.owner?.username} className="object-cover" />
                <AvatarFallback>{ownerInitial}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{video?.owner?.username}</h2>
                <p className="text-sm text-muted-foreground">{subscriberCount} Subscribers</p>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <LikeButton entityId={videoId} entityType="video" />
              <SubscribeButton
                channelId={video?.owner?._id}
                isSubscribed={isSubscribed(video?.owner?._id)}
                onSubscriptionChange={() => updateSubscriptions(video?.owner?._id)}
              />
            </div>
          </div>

          {/* Video Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-base">
                <span className="flex items-center gap-1.5"><Eye size={16} /> {video.views?.toLocaleString()} Views</span>
                <span>•</span>
                <span>{video.createdAt ? timeAgo(video.createdAt) : '...'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-sm text-muted-foreground ${!isExpanded && 'line-clamp-2'}`}>
                {video?.description || "No description available."}
              </p>
              <Button variant="link" className="px-0 h-auto mt-2 text-sm" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? 'Show less' : 'Show more'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Comments Section */}
        <div className="lg:col-span-1">
          <CommentSection
            entityId={videoId}
            parentType={"Video"}
            user={user}
            token={token}
            apiEndpoints={{
              getComments: `/comment/get-video-comments`,
              addComment: `/comment/add-comment`,
              updateComment: `/comment/update-comment`,
              deleteComment: `/comment/delete-comment`
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Watch;
