import { useAuth } from "@/hooks/useAuth";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Palette, LogOut, Settings, BarChart3 } from "lucide-react";
import LanguageSwitcher from "./language-switcher";
import { Link } from "wouter";

export default function Header() {
  const { user } = useAuth();
  const { isAuthenticated: isAdminAuthenticated, adminUser, logoutMutation } = useAdminAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Palette className="text-secondary text-2xl mr-2" />
              <span className="text-xl font-bold text-gray-900">{t('home.title')}</span>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link href="/">
                  <Button variant="ghost" className="text-gray-500 hover:text-gray-900">
                    {t('nav.home')}
                  </Button>
                </Link>
                <Link href="/services">
                  <Button variant="ghost" className="text-gray-500 hover:text-gray-900">
                    {t('nav.services')}
                  </Button>
                </Link>
                <Link href="/booking">
                  <Button variant="ghost" className="text-gray-500 hover:text-gray-900">
                    {t('nav.booking')}
                  </Button>
                </Link>

                <Link href="/gallery">
                  <Button variant="ghost" className="text-gray-500 hover:text-gray-900">
                    {t('nav.gallery')}
                  </Button>
                </Link>
                <Link href="/ai-generator">
                  <Button variant="ghost" className="text-gray-500 hover:text-gray-900">
                    AI Nail Art
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="ghost" className="text-gray-500 hover:text-gray-900">
                    {t('nav.contact')}
                  </Button>
                </Link>
                {!isAdminAuthenticated ? (
                  <>
                    <Link href="/admin-login">
                      <Button variant="ghost" className="text-gray-500 hover:text-gray-900">
                        Log In
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button variant="ghost" className="text-gray-500 hover:text-gray-900">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Welcome, {adminUser?.name || adminUser?.username}</span>
                    <Link href="/admin">
                      <Button variant="ghost" className="text-gray-500 hover:text-gray-900">
                        Admin Panel
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="text-gray-500 hover:text-gray-900"
                      onClick={() => logoutMutation.mutate()}
                    >
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            
            {isAdminAuthenticated && (
              <div className="flex items-center space-x-4">
                <Link href="/analytics">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-secondary"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span className="ml-1 hidden sm:inline">Analytics</span>
                  </Button>
                </Link>
                
                <Link href="/customer-management">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-secondary"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="ml-1 hidden sm:inline">Customer Management</span>
                  </Button>
                </Link>
                
                <Link href="/admin-panel">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-secondary"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="ml-1 hidden sm:inline">Admin Panel</span>
                  </Button>
                </Link>
                
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImageUrl || undefined} />
                    <AvatarFallback className="bg-secondary/10 text-secondary">
                      {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName || user?.email}
                    </p>
                    <p className="text-xs text-gray-600">{user?.email}</p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.href = "/api/logout"}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="ml-1 hidden sm:inline">{t('nav.logout')}</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
