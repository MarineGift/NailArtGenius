import { useAuth } from "@/hooks/useAuth";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Palette, LogOut, Menu, X } from "lucide-react";
import LanguageSwitcher from "./language-switcher";
import { Link } from "wouter";
import { useState } from "react";

export default function Header() {
  const { user } = useAuth();
  const { isAuthenticated: isAdminAuthenticated, adminUser, logoutMutation } = useAdminAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center flex-1">
            <div className="flex-shrink-0 flex items-center">
              <Palette className="text-secondary text-xl sm:text-2xl mr-2" />
              <span className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 truncate">{t('home.title')}</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
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
                <Link href="/admin">
                  <Button variant="ghost" className="text-gray-500 hover:text-gray-900">
                    Admin Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Right side - Language Switcher and Admin Profile */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            
            {isAdminAuthenticated && (
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImageUrl || undefined} />
                    <AvatarFallback className="bg-secondary/10 text-secondary">
                      {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName || user?.email}
                    </p>
                    <p className="text-xs text-gray-600">{user?.email}</p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => logoutMutation.mutate()}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="ml-1 hidden lg:inline">{logoutMutation.isPending ? 'Logging out...' : t('nav.logout')}</span>
                </Button>
              </div>
            )}

            {/* Mobile menu button - Always visible on mobile */}
            <div className="block md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="bg-gray-800 text-white p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                aria-label="메뉴 열기"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 z-50 bg-white shadow-2xl border-t-2 border-gray-300">
            <div className="px-4 pt-4 pb-6 space-y-2">
              <Link href="/">
                <div 
                  className="block px-4 py-3 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  🏠 {t('nav.home')}
                </div>
              </Link>
              <Link href="/services">
                <div 
                  className="block px-4 py-3 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  💅 {t('nav.services')}
                </div>
              </Link>
              <Link href="/booking">
                <div 
                  className="block px-4 py-3 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  📅 {t('nav.booking')}
                </div>
              </Link>
              <Link href="/gallery">
                <div 
                  className="block px-4 py-3 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  🖼️ {t('nav.gallery')}
                </div>
              </Link>
              <Link href="/ai-generator">
                <div 
                  className="block px-4 py-3 text-lg font-medium text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors border-2 border-purple-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  🤖 AI Nail Art
                </div>
              </Link>
              <Link href="/contact">
                <div 
                  className="block px-4 py-3 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  📞 {t('nav.contact')}
                </div>
              </Link>
              
              {/* Mobile Language Switcher */}
              <div className="px-4 py-3 border-t border-gray-200 mt-4 pt-4">
                <div className="text-sm font-medium text-gray-500 mb-2">언어 선택</div>
                <LanguageSwitcher />
              </div>

              {/* Mobile Auth Section */}
              {!isAdminAuthenticated ? (
                <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                  <Link href="/admin-login">
                    <div
                      className="block px-4 py-3 text-lg font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      🔑 Log In
                    </div>
                  </Link>
                  <Link href="/signup">
                    <div
                      className="block px-4 py-3 text-lg font-medium text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      ✨ Sign Up
                    </div>
                  </Link>
                </div>
              ) : (
                <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                  <Link href="/admin">
                    <div
                      className="block px-4 py-3 text-lg font-medium text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      ⚙️ Admin Dashboard
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      logoutMutation.mutate();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-lg font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    disabled={logoutMutation.isPending}
                  >
                    🚪 {logoutMutation.isPending ? 'Logging out...' : t('nav.logout')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
