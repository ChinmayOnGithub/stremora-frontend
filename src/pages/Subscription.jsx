import { useState, useEffect, useMemo } from 'react';
import { useAuth, useUser } from '../contexts';
import { useNavigate } from 'react-router-dom';
// import Lottie from 'lottie-react';
// import emptyStateAnimation from '../assets/Empty_State.json'; // Assuming you add an animation

// Shadcn UI & Lucide Icons
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { Users, PlaySquare, Clock, Compass } from 'lucide-react';
import { SubscriptionItem } from '../components'; // Assuming this component exists and is styled

function Subscription() {
  const { subscriptions = [], fetchSubscriptions } = useUser();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubscriptions = async () => {
      if (user?._id) {
        setLoading(true);
        await fetchSubscriptions();
        setLoading(false);
      } else {
        // If there's no user, we're not loading subscriptions.
        setLoading(false);
      }
    };
    loadSubscriptions();
  }, [user?._id, fetchSubscriptions]);

  const stats = useMemo(() => ({
    count: subscriptions.length,
    // These would be calculated based on more detailed data if available
    newVideos: 0,
    watchTime: "0h 0m",
  }), [subscriptions]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Subscriptions</h1>
            <p className="text-muted-foreground mt-1">
              Stay updated with your favorite creators.
            </p>
          </div>
          <Button onClick={() => navigate('/discover')}>
            <Compass className="mr-2 h-4 w-4" />
            Discover Creators
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard icon={Users} title="Subscriptions" value={stats.count} />
          <StatCard icon={PlaySquare} title="New Videos Today" value={stats.newVideos} />
          <StatCard icon={Clock} title="Total Watch Time" value={stats.watchTime} />
        </div>

        {/* Main Content */}
        {loading ? (
          <SubscriptionGridSkeleton />
        ) : subscriptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map((sub) =>
              sub.channelDetails ? (
                <SubscriptionItem
                  key={sub._id}
                  channelDetails={sub.channelDetails}
                />
              ) : null
            )}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

// --- Helper Components ---

const StatCard = ({ icon: Icon, title, value }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const SubscriptionGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array(6).fill(0).map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = () => {
  const navigate = useNavigate();
  return (
    <div className="col-span-full flex flex-col items-center justify-center text-center bg-muted/50 rounded-xl border border-dashed p-12">
      {/* <Lottie animationData={emptyStateAnimation} loop={true} style={{ height: 200 }} /> */}
      <div className="flex justify-center mb-6">
        <div className="h-24 w-24 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Users className="h-12 w-12 text-primary" />
        </div>
      </div>
      <h3 className="text-xl font-semibold mt-6">You aren&apos;t subscribed to any channels yet</h3>
      <p className="text-muted-foreground mt-2 mb-6 max-w-md mx-auto">
        Subscribe to creators to see their latest videos and posts right here.
      </p>
      <Button onClick={() => navigate('/discover')}>
        <Compass className="mr-2 h-4 w-4" />
        Discover Creators
      </Button>
    </div>
  );
};

export default Subscription;
