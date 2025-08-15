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
        <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
        <CardDescription className="text-center text-slate-600">
          Enter your credentials to access the admin dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="admin@kictgroup.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 admin-input"
                disabled={loading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 admin-input"
                disabled={loading}
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full admin-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-slate-600">
          Default credentials: admin@kictgroup.com / admin123
        </div>
      </CardContent>
    </Card>
  )
}