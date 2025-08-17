'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { getCurrentUser, signOut, type AuthUser } from '@/lib/auth'
import { LoginForm } from '@/components/login-form'
import { DashboardTabs } from '@/components/dashboard-tabs'
import { Button } from '@/components/ui/button'
import { LogOut, User, Sparkles } from 'lucide-react'
import { Toaster } from '@/components/ui/toaster'

export default function AdminDashboard() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setUser(null)
      router.refresh()
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  const handleLoginSuccess = (authUser: AuthUser) => {
    setUser(authUser)
  }

  if (loading) {
    return (
      <div className="min-h-screen admin-gradient flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen admin-gradient flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-white/30 to-purple-200/20 flex items-center justify-center backdrop-blur-md border-2 border-white/40 shadow-xl pastel-float pastel-glow">
                <Sparkles className="h-10 w-10 text-purple-700" />
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent mb-3 drop-shadow-lg">ConnieNail</h1>
            <p className="text-purple-700 font-medium text-lg drop-shadow-sm">럭셔리 네일 살롱 관리</p>
          </div>
          <LoginForm onSuccess={handleLoginSuccess} />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="admin-gradient shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-white/40 to-purple-200/30 flex items-center justify-center backdrop-blur-md border-2 border-white/50 shadow-lg pastel-float">
                <Sparkles className="h-7 w-7 text-purple-700" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">ConnieNail Admin</h1>
                <p className="text-purple-700 text-sm font-medium drop-shadow-sm">럭셔리 네일 살롱 관리 시스템</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-white/40 to-purple-200/30 flex items-center justify-center backdrop-blur-md border-2 border-white/50 shadow-lg">
                  <User className="h-5 w-5 text-purple-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-purple-700 drop-shadow-sm">
                    {user.firstName || user.email.split('@')[0]}
                  </p>
                  <p className="text-xs text-purple-600 capitalize font-medium">{user.role.replace('_', ' ')}</p>
                </div>
              </div>
              <Button
                onClick={handleSignOut}
                className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-2 border-purple-200 hover:from-purple-200 hover:to-pink-200 hover:border-purple-300 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                size="sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardTabs currentUser={user} />
      </main>
    </div>
  )
}