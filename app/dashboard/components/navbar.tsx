'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from '@/lib/auth';
import { signOutAction } from '@/app/actions/auth-actions';
import { 
  Menu,
  X, 
  Moon, 
  Sun, 
  LogOut, 
  User as UserIcon,
  Bell,
  Search,
  ChevronDown,
  BookOpen,
  Settings,
  GraduationCap,
  Clock,
  HelpCircle,
  Zap
} from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuShortcut
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Define a custom user type that matches what we're getting from auth()
interface NavbarUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  emailVerified?: Date | null;
}

interface NavbarProps {
  user: NavbarUser;
}

export default function Navbar({ user }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSignOut = async () => {
    try {
      // Call the server action
      await signOutAction();
      // The redirect will be handled by the server action
    } catch (error) {
      console.error('Error signing out:', error);
      // Fallback client-side navigation if server action fails
      router.push('/');
      router.refresh();
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const userInitials = user.name 
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : user.email?.charAt(0).toUpperCase() || 'U';
  
  // Get the current module name from the path if we're in a module page
  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname.startsWith('/dashboard/modules/module-')) {
      const moduleNumber = pathname.split('module-')[1];
      const moduleNames: Record<string, string> = {
        '1': 'Module 1: Mathematics',
        '3': 'Module 3: Basic Electricity',
        '4': 'Module 4: Basic Electronics',
        '8': 'Module 8: Basic Aerodynamics'
      };
      return moduleNames[moduleNumber] || `Module ${moduleNumber}`;
    }
    if (pathname.includes('/flashcards')) return 'Flashcards';
    if (pathname.includes('/study')) return 'Study Session';
    if (pathname.includes('/analytics')) return 'Analytics';
    if (pathname.includes('/community')) return 'Community';
    if (pathname.includes('/settings')) return 'Settings';
    
    // Default to capitalizing the last part of the path
    const parts = pathname.split('/');
    const lastPart = parts[parts.length - 1];
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
  };
  
  return (
    <nav className="sticky top-0 z-10 border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Logo & Brand - Mobile Only */}
          <div className="flex md:hidden items-center gap-2">
            <Link 
              href="/dashboard" 
              className="text-lg font-bold flex items-center"
            >
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mr-2">
                <span className="text-primary-foreground text-sm font-bold">E</span>
              </div>
              <span className="sr-only md:not-sr-only">EASA</span>
            </Link>
          </div>
          
          {/* Page Title - Desktop Only */}
          <div className="hidden md:flex items-center">
            <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
            {pathname.includes('/study') && (
              <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Active Session
              </Badge>
            )}
          </div>
          
          {/* Search - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                type="search"
                placeholder="Search flashcards, modules..."
                className="w-full pl-10 py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                size="sm" 
                variant="ghost" 
                className="absolute inset-y-0 right-0 px-3"
              >
                <span className="sr-only">Search</span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  ⌘K
                </kbd>
              </Button>
            </form>
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Quick Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="hidden md:flex">
                  <Zap className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/study">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      Start Study Session
                      <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/flashcards/create">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Create Flashcard
                      <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/modules">
                      <Clock className="mr-2 h-4 w-4" />
                      Review Due Cards
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-muted-foreground"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600"></span>
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex justify-between items-center">
                  Notifications
                  <Badge variant="secondary" className="ml-auto">New</Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  <div className="p-3 border-b">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        <GraduationCap className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-medium">Study reminder</p>
                        <p className="text-sm text-muted-foreground">
                          You have cards due for review in Module 3: Basic Electricity
                        </p>
                        <div className="mt-2 flex">
                          <Button size="sm" variant="secondary" asChild>
                            <Link href="/dashboard/study">Study now</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        <Bell className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-medium">Daily streak</p>
                        <p className="text-sm text-muted-foreground">
                          You're on a 2-day study streak! Keep it up!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/notifications" className="cursor-pointer flex justify-center">
                    View all notifications
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Help */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <HelpCircle className="h-5 w-5" />
              <span className="sr-only">Help</span>
            </Button>
            
            {/* User Menu - Desktop */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2">
                    <Avatar className="h-8 w-8 border border-muted">
                      <AvatarImage src={user.image || ''} alt={user.name || 'User'} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-left">
                      <span className="text-sm font-medium">{user.name || 'User'}</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                        {user.email}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">
                      <UserIcon className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-500 focus:text-red-500 cursor-pointer" 
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader className="mb-6">
                    <SheetTitle>EASA Flashcards</SheetTitle>
                  </SheetHeader>
                  
                  {/* Search - Mobile */}
                  <form onSubmit={handleSearch} className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      type="search"
                      placeholder="Search flashcards..."
                      className="w-full pl-10 py-2"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </form>
                  
                  <div className="space-y-6">
                    {/* User Profile - Mobile */}
                    <div className="flex items-center space-x-3 border-b pb-4">
                      <Avatar>
                        <AvatarImage src={user.image || ''} alt={user.name || 'User'} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.name || 'User'}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    
                    {/* Quick Actions - Mobile */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">Quick Actions</h3>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start" asChild>
                          <Link href="/dashboard/study">
                            <GraduationCap className="mr-2 h-4 w-4" />
                            Start Study Session
                          </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                          <Link href="/dashboard/flashcards/create">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Create Flashcard
                          </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                          <Link href="/dashboard/analytics">
                            <Clock className="mr-2 h-4 w-4" />
                            View Analytics
                          </Link>
                        </Button>
                      </div>
                    </div>
                    
                    {/* Profile & Settings - Mobile */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium mb-2">Account</h3>
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link href="/dashboard/profile">
                          <UserIcon className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </Button>
                      
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link href="/dashboard/settings">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                      </Button>
                    </div>
                    
                    {/* Theme & Logout - Mobile */}
                    <div className="space-y-2 pt-4 border-t">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      >
                        {theme === 'dark' ? (
                          <>
                            <Sun className="mr-2 h-4 w-4" />
                            Light Mode
                          </>
                        ) : (
                          <>
                            <Moon className="mr-2 h-4 w-4" />
                            Dark Mode
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-red-500 hover:text-red-600" 
                        onClick={handleSignOut}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}