'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Video, 
  Plus,
  Eye,
  Heart,
  Share2,
  PlayCircle
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';

const stats = [
  { name: 'Total Videos', value: '0', icon: Video },
  { name: 'Total Views', value: '0', icon: Eye },
  { name: 'Engagement Rate', value: '0%', icon: Heart },
  { name: 'Shares', value: '0', icon: Share2 }
];

export function EnhancedDashboardContent() {
  const { user, profile } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchVideos();
    }
  }, [user]);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos');
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUsagePercentage = () => {
    if (!profile || profile.subscription_plan !== 'free') return 0;
    return (profile.videos_created_this_month / 3) * 100;
  };

  const getRemainingVideos = () => {
    if (!profile) return 0;
    if (profile.subscription_plan === 'free') {
      return Math.max(0, 3 - profile.videos_created_this_month);
    }
    return 'Unlimited';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}!
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Video
          </Link>
        </Button>
      </div>

      {/* Usage Card */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Usage</CardTitle>
          <CardDescription>
            {profile?.subscription_plan === 'free' ? (
              <>You've used {profile?.videos_created_this_month || 0} of 3 videos in your free plan this month</>
            ) : (
              <>Unlimited videos with your {profile?.subscription_plan} plan</>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profile?.subscription_plan === 'free' && (
              <>
                <Progress value={getUsagePercentage()} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{profile?.videos_created_this_month || 0} videos created</span>
                  <span>{getRemainingVideos()} videos remaining</span>
                </div>
                <Button asChild size="sm">
                  <Link href="/pricing">Upgrade to Pro</Link>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Videos */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Videos</CardTitle>
          <CardDescription>Your latest video creations</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading videos...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-8">
              <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No videos yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first AI-generated video to get started
              </p>
              <Button asChild>
                <Link href="/dashboard/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Video
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {videos.slice(0, 5).map((video: any) => (
                <div key={video.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="relative w-16 h-28 bg-muted rounded-lg overflow-hidden">
                    {video.thumbnail_url ? (
                      <img 
                        src={video.thumbnail_url} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Video className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    {video.video_url && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <PlayCircle className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{video.title}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-muted-foreground">0 views</span>
                      <Badge 
                        variant={video.status === 'completed' ? 'default' : 
                                video.status === 'generating' ? 'secondary' : 
                                video.status === 'failed' ? 'destructive' : 'outline'}
                        className="text-xs"
                      >
                        {video.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(video.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}