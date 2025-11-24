import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  Eye, 
  Heart, 
  Users, 
  TrendingUp, 
  Clock,
  Play,
  ThumbsUp
} from 'lucide-react';
import { abbreviateNumber } from "js-abbreviation-number";

// Individual stat card component
const StatCard = ({ title, value, icon: Icon, trend, color = "blue", description }) => (
  <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {title}
      </CardTitle>
      <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/20`}>
        <Icon className={`h-4 w-4 text-${color}-600 dark:text-${color}-400`} />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {typeof value === 'number' ? abbreviateNumber(value) : value}
      </div>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </p>
      )}
      {trend && (
        <div className="flex items-center mt-2">
          <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
          <span className="text-xs text-green-600 dark:text-green-400">
            +{trend}% from last month
          </span>
        </div>
      )}
    </CardContent>
  </Card>
);

// Main stats dashboard component
function StatsCards({ stats }) {
  const defaultStats = {
    totalVideos: 0,
    totalViews: 0,
    totalLikes: 0,
    totalUsers: 0,
    avgWatchTime: "0:00",
    engagementRate: 0,
    ...stats
  };

  const statCards = [
    {
      title: "Total Videos",
      value: defaultStats.totalVideos,
      icon: Video,
      color: "blue",
      trend: 12,
      description: "Published videos"
    },
    {
      title: "Total Views",
      value: defaultStats.totalViews,
      icon: Eye,
      color: "green",
      trend: 8,
      description: "Across all videos"
    },
    {
      title: "Total Likes",
      value: defaultStats.totalLikes,
      icon: Heart,
      color: "red",
      trend: 15,
      description: "User engagement"
    },
    {
      title: "Active Users",
      value: defaultStats.totalUsers,
      icon: Users,
      color: "purple",
      trend: 5,
      description: "Registered users"
    },
    {
      title: "Avg Watch Time",
      value: defaultStats.avgWatchTime,
      icon: Clock,
      color: "orange",
      description: "Per video session"
    },
    {
      title: "Engagement Rate",
      value: `${defaultStats.engagementRate}%`,
      icon: ThumbsUp,
      color: "indigo",
      trend: 3,
      description: "Likes per view"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}

export default StatsCards;