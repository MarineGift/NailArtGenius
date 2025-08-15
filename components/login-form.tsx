'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { signIn, type AuthUser } from '@/lib/auth'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Mail, Lock } from 'lucide-react'

interface LoginFormProps {
  onSuccess: (user: AuthUser) => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    
    try {
      const user = await signIn(email, password)
      
      if (user) {
        toast({
          title: "Success",
          description: "Welcome to KICT Group Admin Dashboard"
        })
        onSuccess(user)
      } else {
        toast({
          title: "Error",
          description: "Invalid email or password",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: "Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="admin-card">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">로그인</CardTitle>
        <CardDescription className="text-center text-purple-600 font-medium">
          관리자 대시보드에 접속하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-purple-700 font-semibold">이메일</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
              <Input
                id="email"
                type="email"
                placeholder="admin@connienail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-11 admin-input h-12 text-purple-700 placeholder:text-purple-300"
                disabled={loading}
              />
            </div>
          </div>
          <div className="space-y-3">
            <Label htmlFor="password" className="text-purple-700 font-semibold">비밀번호</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-11 admin-input h-12 text-purple-700"
                disabled={loading}
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full admin-button h-12 text-lg font-semibold mt-6"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                로그인 중...
              </>
            ) : (
              '로그인'
            )}
          </Button>
        </form>
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-100">
          <p className="text-center text-sm text-purple-600 font-medium">기본 계정 정보</p>
          <p className="text-center text-xs text-purple-500 mt-1">admin@connienail.com / admin123</p>
        </div>
      </CardContent>
    </Card>
  )
}