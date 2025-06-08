
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X, User, LogOut, Radio, Search, Baby } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  const { user, signOut, isAdmin, isModerator } = useAuth();
  const { isMobile } = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Get user display name from metadata if available
  const userDisplayName = user?.user_metadata?.full_name || user?.email || '';
  // Get initial letters for avatar fallback
  const userInitials = userDisplayName ? userDisplayName.slice(0, 2).toUpperCase() : '';

  // Check if the current route is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled 
          ? "bg-[#252a40]/90 backdrop-blur-md border-gray-800/50" 
          : "bg-[#252a40]/70 border-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-white text-lg md:text-xl font-bold">
              <Radio className="h-5 w-5 text-purple-400" />
              <span className="hidden sm:inline">Piper-Lee Radio</span>
              <span className="inline sm:hidden">P-L Radio</span>
            </Link>
          </div>

          {/* Search - Desktop Only */}
          <div className="hidden lg:flex items-center max-w-md w-full mx-4">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="Suchen..." 
                className="w-full py-2 pl-10 pr-4 rounded-full bg-gray-800/50 border border-gray-700/50 text-gray-300 focus:outline-none focus:border-purple-500 transition-all"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <NavLink to="/" isActive={isActive('/')} label="Startseite" />
            <NavLink to="/kids" isActive={isActive('/kids')} label={
              <div className="flex items-center gap-1">
                <Baby className="h-3.5 w-3.5" />
                <span>Kids</span>
              </div>
            } />
            <NavLink to="/sendeplan" isActive={isActive('/sendeplan')} label="Sendeplan" />
            <NavLink to="/podcasts" isActive={isActive('/podcasts')} label="Podcasts" />
            <NavLink to="/events" isActive={isActive('/events')} label="Events" />
            <NavLink to="/news" isActive={isActive('/news')} label="News" />
            <NavLink 
              to="/status" 
              isActive={isActive('/status')} 
              label={
                <div className="flex items-center gap-1">
                  <Activity className="h-3.5 w-3.5" />
                  <span>Status</span>
                </div>
              } 
            />
            
            {user && isModerator && !isAdmin && (
              <NavLink to="/moderator" isActive={location.pathname.startsWith('/moderator')} label="Moderator" />
            )}
            
            {isAdmin && (
              <NavLink to="/admin" isActive={location.pathname.startsWith('/admin')} label="Admin" />
            )}
          </nav>

          {/* User Menu / Mobile Menu */}
          <div className="flex items-center space-x-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0 rounded-full data-[state=open]:bg-muted">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={userDisplayName} />
                      <AvatarFallback className="bg-purple-700 text-white">{userInitials}</AvatarFallback>
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
                  <DropdownMenuItem asChild>
                    <Link to="/user-dashboard">
                      <User className="mr-2 h-4 w-4" />
                      <span>Mein Profil</span>
                    </Link>
                  </DropdownMenuItem>
                  {isModerator && (
                    <DropdownMenuItem asChild>
                      <Link to="/moderator">
                        <Radio className="mr-2 h-4 w-4" />
                        <span>Moderator Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">
                        <Activity className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
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
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700" asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
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
          <div className="md:hidden bg-[#1c1f2f] border-t border-gray-800 animate-fade-in">
            <div className="container px-4 py-4 space-y-2">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <input 
                  type="text" 
                  placeholder="Suchen..." 
                  className="w-full py-2 pl-10 pr-4 rounded-full bg-gray-800/50 border border-gray-700/50 text-gray-300 focus:outline-none focus:border-purple-500 transition-all"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              
              <Link to="/" className="block px-3 py-2 text-gray-300 hover:text-white font-medium rounded-md hover:bg-gray-800/50" onClick={() => setIsMobileMenuOpen(false)}>
                Startseite
              </Link>
              <Link to="/kids" className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white font-medium rounded-md hover:bg-gray-800/50" onClick={() => setIsMobileMenuOpen(false)}>
                <Baby className="h-4 w-4" />
                Kids Radio
              </Link>
              <Link to="/sendeplan" className="block px-3 py-2 text-gray-300 hover:text-white font-medium rounded-md hover:bg-gray-800/50" onClick={() => setIsMobileMenuOpen(false)}>
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
                <Link to="/moderator" className="block px-3 py-2 text-gray-300 hover:text-white font-medium rounded-md hover:bg-gray-800/50" onClick={() => setIsMobileMenuOpen(false)}>
                  Moderator
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" className="block px-3 py-2 text-gray-300 hover:text-white font-medium rounded-md hover:bg-gray-800/50" onClick={() => setIsMobileMenuOpen(false)}>
                  Admin
                </Link>
              )}
              
              {/* User actions for mobile */}
              <div className="mt-4 pt-4 border-t border-gray-700/50">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={userDisplayName} />
                        <AvatarFallback className="bg-purple-700 text-white">{userInitials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-white">{userDisplayName}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    <Link to="/user-dashboard" className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white font-medium rounded-md hover:bg-gray-800/50" onClick={() => setIsMobileMenuOpen(false)}>
                      <User className="h-4 w-4" />
                      Mein Profil
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 text-left px-3 py-2 text-gray-300 hover:text-white font-medium rounded-md hover:bg-gray-800/50"
                    >
                      <LogOut className="h-4 w-4" />
                      Abmelden
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" className="w-1/2" onClick={() => setIsMobileMenuOpen(false)} asChild>
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button className="w-1/2 bg-purple-600 hover:bg-purple-700" onClick={() => setIsMobileMenuOpen(false)} asChild>
                      <Link to="/register">Register</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

// Helper component for navigation links
const NavLink = ({ to, isActive, label }: { to: string, isActive: boolean, label: React.ReactNode }) => {
  return (
    <Link 
      to={to}
      className={cn(
        "px-3 py-2 text-sm font-medium rounded-md transition-colors",
        isActive 
          ? "text-white bg-white/10" 
          : "text-gray-300 hover:text-white hover:bg-white/5"
      )}
    >
      {label}
    </Link>
  );
};

export default Header;
