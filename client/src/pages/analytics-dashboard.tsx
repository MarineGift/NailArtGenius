import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Activity, 
  Eye, 
  Heart, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Calendar,
  BarChart3,
  PieChart,
  Timeline
} from "lucide-react";
import { format } from "date-fns";

interface UserAnalytics {
  totalActivities: number;
  behaviorAnalytics: {
    totalPhotosUploaded: number;
    totalDesignsViewed: number;
    totalDesignsPurchased: number;
    averageOrderValue: number;
    loyaltyScore: number;
    preferredCategories: string[];
    preferredColors: string[];
    lastActive: string;
  };
  recentActivities: Array<{
    id: number;
    activityType: string;
    createdAt: string;
    activityData: any;
  }>;
}

export default function AnalyticsDashboard() {
  const { user, isAuthenticated } = useAuth();

  const { data: analytics, isLoading } = useQuery<UserAnalytics>({
    queryKey: ['/api/analytics/user'],
    enabled: isAuthenticated,
  });

  const { data: designInteractions } = useQuery({
    queryKey: ['/api/analytics/design-interactions'],
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your design preferences and activity</p>
        </div>
        <Button variant="outline">
          <BarChart3 className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="designs">Design History</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Photos Uploaded</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.behaviorAnalytics?.totalPhotosUploaded || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total nail photos analyzed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Designs Viewed</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.behaviorAnalytics?.totalDesignsViewed || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Nail art designs explored
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Designs Purchased</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.behaviorAnalytics?.totalDesignsPurchased || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Completed purchases
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Loyalty Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.behaviorAnalytics?.loyaltyScore || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Customer loyalty rating
                </p>
              </CardContent>
            </Card>
          </div>

          {analytics?.behaviorAnalytics?.averageOrderValue && (
            <Card>
              <CardHeader>
                <CardTitle>Spending Analysis</CardTitle>
                <CardDescription>Your purchasing patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Average Order Value</span>
                    <span className="font-semibold">
                      ${analytics.behaviorAnalytics.averageOrderValue}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total Orders</span>
                    <span className="font-semibold">
                      {analytics.behaviorAnalytics.totalDesignsPurchased}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="designs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Design Interaction History</CardTitle>
              <CardDescription>Your engagement with nail art designs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {designInteractions?.length > 0 ? (
                  designInteractions.map((interaction: any) => (
                    <div key={interaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div>
                          <p className="font-medium">Design #{interaction.designId || interaction.customDesignId}</p>
                          <p className="text-sm text-muted-foreground">
                            {interaction.interactionType} • {format(new Date(interaction.createdAt), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                      {interaction.rating && (
                        <Badge variant="secondary">
                          {interaction.rating} ⭐
                        </Badge>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No design interactions yet. Start exploring designs to see your history here.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferred Categories</CardTitle>
                <CardDescription>Your most viewed design categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analytics?.behaviorAnalytics?.preferredCategories?.length > 0 ? (
                    analytics.behaviorAnalytics.preferredCategories.map((category) => (
                      <Badge key={category} variant="outline">
                        {category}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No preferences detected yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferred Colors</CardTitle>
                <CardDescription>Your most selected color palette</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analytics?.behaviorAnalytics?.preferredColors?.length > 0 ? (
                    analytics.behaviorAnalytics.preferredColors.map((color) => (
                      <Badge key={color} variant="outline">
                        {color}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No color preferences detected yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {analytics?.recentActivities?.length > 0 ? (
                    analytics.recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="font-medium">
                            {activity.activityType.replace('_', ' ').toLowerCase()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(activity.createdAt), 'MMM dd, yyyy HH:mm')}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No recent activity to display.
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}