'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CustomerInquiries } from '@/components/customer-inquiries'
import { GalleryManager } from '@/components/gallery-manager'
import { NewsManager } from '@/components/news-manager'
import { AdminManagement } from '@/components/admin-management'
import { BookingManagement } from '@/components/booking-management'
import { CustomerCRM } from '@/components/customer-crm'
import { Users, Image, Newspaper, BarChart3, Shield, Calendar, UserCheck, Package, Sparkles, Settings } from 'lucide-react'

interface DashboardTabsProps {
  currentUser: any
}

export function DashboardTabs({ currentUser }: DashboardTabsProps) {
  return (
    <div className="space-y-6">
      {/* Luxury Dashboard Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">오늘 예약</CardTitle>
            <Calendar className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">15</div>
            <p className="text-xs text-purple-600">3건 완료, 12건 예정</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">총 고객</CardTitle>
            <UserCheck className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">248</div>
            <p className="text-xs text-blue-600">이번 달 +12명 증가</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700">월 매출</CardTitle>
            <Sparkles className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">₩2.8M</div>
            <p className="text-xs text-emerald-600">전월 대비 +18%</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">갤러리 이미지</CardTitle>
            <Image className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">156</div>
            <p className="text-xs text-amber-600">142개 게시됨</p>
          </CardContent>
        </Card>
      </div>

      {/* Luxury Main Tabs */}
      <Tabs defaultValue="bookings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7 bg-gradient-to-r from-purple-100 to-pink-100 p-1 rounded-xl shadow-inner">
          <TabsTrigger 
            value="bookings" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
          >
            <Calendar className="h-4 w-4 mr-2" />
            예약 관리
          </TabsTrigger>
          <TabsTrigger 
            value="customers" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
          >
            <UserCheck className="h-4 w-4 mr-2" />
            고객 CRM
          </TabsTrigger>
          <TabsTrigger 
            value="gallery" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
          >
            <Image className="h-4 w-4 mr-2" />
            갤러리
          </TabsTrigger>
          <TabsTrigger 
            value="news" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
          >
            <Newspaper className="h-4 w-4 mr-2" />
            뉴스
          </TabsTrigger>
          <TabsTrigger 
            value="products" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
          >
            <Package className="h-4 w-4 mr-2" />
            제품
          </TabsTrigger>
          <TabsTrigger 
            value="carousel" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            캐러셀
          </TabsTrigger>
          <TabsTrigger 
            value="admin" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
          >
            <Shield className="h-4 w-4 mr-2" />
            관리자
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="bookings" className="space-y-4">
          <BookingManagement currentUser={currentUser} />
        </TabsContent>
        
        <TabsContent value="customers" className="space-y-4">
          <CustomerCRM currentUser={currentUser} />
        </TabsContent>
        
        <TabsContent value="gallery" className="space-y-4">
          <Card className="shadow-lg border-purple-100">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
              <CardTitle className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                갤러리 관리
              </CardTitle>
              <CardDescription>
                네일 아트 이미지를 업로드하고 카테고리별로 관리합니다
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <GalleryManager />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="news" className="space-y-4">
          <Card className="shadow-lg border-purple-100">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
              <CardTitle className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                뉴스 관리
              </CardTitle>
              <CardDescription>
                뉴스 기사를 작성하고 게시합니다
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <NewsManager />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-4">
          <Card className="shadow-lg border-purple-100">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
              <CardTitle className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                제품 관리
              </CardTitle>
              <CardDescription>
                네일 제품을 등록하고 관리합니다
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <Package className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                <p className="text-gray-500">제품 관리 기능을 준비 중입니다.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="carousel" className="space-y-4">
          <Card className="shadow-lg border-purple-100">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
              <CardTitle className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                캐러셀 관리
              </CardTitle>
              <CardDescription>
                메인 페이지 슬라이드 이미지를 관리합니다
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <Sparkles className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                <p className="text-gray-500">캐러셀 관리 기능을 준비 중입니다.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="admin" className="space-y-4">
          <AdminManagement currentUser={currentUser} />
        </TabsContent>
      </Tabs>
    </div>
  )
}