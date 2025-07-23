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
    <nav className="bg-white shadow-sm border-b border-gray-100">
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
            <div className="md:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 border-gray-300 p-2 ml-2"
                aria-label="메뉴 열기"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 z-50 bg-white shadow-lg border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/">
                <Button
                  variant="ghost"
                  className="w-full text-left justify-start text-gray-500 hover:text-gray-900"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.home')}
                </Button>
              </Link>
              <Link href="/services">
                <Button
                  variant="ghost"
                  className="w-full text-left justify-start text-gray-500 hover:text-gray-900"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.services')}
                </Button>
              </Link>
              <Link href="/booking">
                <Button
                  variant="ghost"
                  className="w-full text-left justify-start text-gray-500 hover:text-gray-900"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.booking')}
                </Button>
              </Link>
              <Link href="/gallery">
                <Button
                  variant="ghost"
                  className="w-full text-left justify-start text-gray-500 hover:text-gray-900"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.gallery')}
                </Button>
              </Link>
              <Link href="/ai-generator">
                <Button
                  variant="ghost"
                  className="w-full text-left justify-start text-gray-500 hover:text-gray-900"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  AI Nail Art
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="ghost"
                  className="w-full text-left justify-start text-gray-500 hover:text-gray-900"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.contact')}
                </Button>
              </Link>
              
              {/* Mobile Language Switcher */}
              <div className="px-3 py-2 border-t border-gray-100 mt-2 pt-4">
                <LanguageSwitcher />
              </div>

              {/* Mobile Auth Section */}
              {!isAdminAuthenticated ? (
                <div className="border-t border-gray-100 mt-2 pt-4 space-y-1">
                  <Link href="/admin-login">
                    <Button
                      variant="ghost"
                      className="w-full text-left justify-start text-gray-500 hover:text-gray-900"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button
                      variant="ghost"
                      className="w-full text-left justify-start text-gray-500 hover:text-gray-900"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="border-t border-gray-100 mt-2 pt-4 space-y-1">
                  <Link href="/admin">
                    <Button
                      variant="ghost"
                      className="w-full text-left justify-start text-gray-500 hover:text-gray-900"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      logoutMutation.mutate();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left justify-start text-gray-500 hover:text-gray-900"
                    disabled={logoutMutation.isPending}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {logoutMutation.isPending ? 'Logging out...' : t('nav.logout')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
