
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Activity } from 'lucide-react';

const Header = () => {
  const { user, signOut, isAdmin, isModerator } = useAuth();
  const { isMobile } = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Get user display name from metadata if available
  const userDisplayName = user?.user_metadata?.full_name || user?.email || '';
  // Get initial letters for avatar fallback
  const userInitials = userDisplayName ? userDisplayName.slice(0, 2).toUpperCase() : '';

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#252a40]/80 backdrop-blur-sm z-50 border-b border-gray-800/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="text-white text-lg md:text-xl font-bold">
              Piper-Lee Radio
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
              Startseite
            </Link>
            <Link to="/schedule" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
              Sendeplan
            </Link>
            <Link to="/podcasts" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
              Podcasts
            </Link>
            <Link to="/events" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
              Events
            </Link>
            <Link to="/news" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
              News
            </Link>
            <Link to="/status" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1">
              <Activity className="h-4 w-4" />
              Status
            </Link>
            {user && isModerator && (
              <Link to="/moderator-dashboard" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                Moderator
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin/panel" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                Admin
              </Link>
            )}
          </nav>

          {/* User Menu / Mobile Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0 data-[state=open]:bg-muted">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={userDisplayName} />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userDisplayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={(event) => {
                      event.preventDefault()
                      signOut()
                    }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Abmelden</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Register
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-gray-300 hover:text-white focus:outline-none p-2"
              aria-label="Open menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#1c1f2f] border-t border-gray-800">
            <div className="container px-4 py-4 space-y-2">
              <Link to="/" className="block px-3 py-2 text-gray-300 hover:text-white font-medium rounded-md hover:bg-gray-800/50" onClick={() => setIsMobileMenuOpen(false)}>
                Startseite
              </Link>
              <Link to="/schedule" className="block px-3 py-2 text-gray-300 hover:text-white font-medium rounded-md hover:bg-gray-800/50" onClick={() => setIsMobileMenuOpen(false)}>
                Sendeplan
              </Link>
              <Link to="/podcasts" className="block px-3 py-2 text-gray-300 hover:text-white font-medium rounded-md hover:bg-gray-800/50" onClick={() => setIsMobileMenuOpen(false)}>
                Podcasts
              </Link>
              <Link to="/events" className="block px-3 py-2 text-gray-300 hover:text-white font-medium rounded-md hover:bg-gray-800/50" onClick={() => setIsMobileMenuOpen(false)}>
                Events
              </Link>
              <Link to="/news" className="block px-3 py-2 text-gray-300 hover:text-white font-medium rounded-md hover:bg-gray-800/50" onClick={() => setIsMobileMenuOpen(false)}>
                News
              </Link>
              <Link to="/status" className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white font-medium rounded-md hover:bg-gray-800/50" onClick={() => setIsMobileMenuOpen(false)}>
                <Activity className="h-4 w-4" />
                Status
              </Link>
              {user && isModerator && (
                <Link to="/moderator-dashboard" className="block px-3 py-2 text-gray-300 hover:text-white font-medium rounded-md hover:bg-gray-800/50" onClick={() => setIsMobileMenuOpen(false)}>
                  Moderator
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin/panel" className="block px-3 py-2 text-gray-300 hover:text-white font-medium rounded-md hover:bg-gray-800/50" onClick={() => setIsMobileMenuOpen(false)}>
                  Admin
                </Link>
              )}
              {user ? (
                <button
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left block px-3 py-2 text-gray-300 hover:text-white font-medium rounded-md hover:bg-gray-800/50"
                >
                  Abmelden
                </button>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-2 text-gray-300 hover:text-white font-medium rounded-md hover:bg-gray-800/50" onClick={() => setIsMobileMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="block px-3 py-2 text-gray-300 hover:text-white font-medium rounded-md hover:bg-gray-800/50" onClick={() => setIsMobileMenuOpen(false)}>
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
