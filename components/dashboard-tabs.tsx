'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CustomerInquiries } from '@/components/customer-inquiries'
import { GalleryManager } from '@/components/gallery-manager'
import { NewsManager } from '@/components/news-manager'
import { Users, Image, Newspaper, BarChart3 } from 'lucide-react'

export function DashboardTabs() {
  return (
    <div className="space-y-6">
      {/* Dashboard Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gallery Items</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">6 published</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">News Articles</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">3 published</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="inquiries" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inquiries">Customer Inquiries</TabsTrigger>
          <TabsTrigger value="gallery">Gallery Manager</TabsTrigger>
          <TabsTrigger value="news">News Manager</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inquiries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Inquiries</CardTitle>
              <CardDescription>
                Manage customer inquiries and respond with email/SMS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CustomerInquiries />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="gallery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gallery Management</CardTitle>
              <CardDescription>
                Upload and manage gallery images with categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GalleryManager />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="news" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>News Management</CardTitle>
              <CardDescription>
                Create and publish news articles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NewsManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}