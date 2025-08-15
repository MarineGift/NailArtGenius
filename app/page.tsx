'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { getCurrentUser, signOut, type AuthUser } from '@/lib/auth'
import { LoginForm } from '@/components/login-form'
import { DashboardTabs } from '@/components/dashboard-tabs'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'
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
            <h1 className="text-4xl font-bold text-white mb-2">KICT Group</h1>
            <p className="text-white/80">Admin Dashboard</p>
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
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">KICT Group Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-white">
                <User className="h-5 w-5" />
                <span>{user.firstName || user.username}</span>
                <span className="text-white/70">({user.role})</span>
              </div>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="text-white border-white/20 hover:bg-white/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardTabs />
      </main>
    </div>
  )
}