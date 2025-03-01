'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  BookOpen, 
  BarChart, 
  Settings,
  PlusCircle,
  GraduationCap,
  Users,
  FileText
} from 'lucide-react';

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: LayoutDashboard,
    description: 'Overview of your learning progress'
  },
  { 
    name: 'Flashcards', 
    href: '/dashboard/flashcards', 
    icon: BookOpen,
    description: 'Browse your flashcard collection'
  },
  { 
    name: 'Create', 
    href: '/dashboard/flashcards/create', 
    icon: PlusCircle,
    description: 'Add new flashcards to your collection'
  },
  { 
    name: 'Study Session', 
    href: '/dashboard/study', 
    icon: GraduationCap,
    description: 'Start a new study session'
  },
  { 
    name: 'Analytics', 
    href: '/dashboard/analytics', 
    icon: BarChart,
    description: 'View your learning statistics'
  },
];

const secondaryNavigation = [
  { 
    name: 'Community', 
    href: '/dashboard/community', 
    icon: Users,
    description: 'Connect with other EASA students'
  },
  { 
    name: 'Resources', 
    href: '/dashboard/resources', 
    icon: FileText,
    description: 'EASA learning resources'
  },
  { 
    name: 'Settings', 
    href: '/dashboard/settings', 
    icon: Settings,
    description: 'Manage your account settings'
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  
  return (
    <div className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <div className="flex flex-col flex-grow pt-5 pb-4 px-4">
        <div className="mb-6">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center mb-2 ml-2">
            <span className="text-white text-lg font-bold">E</span>
          </div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider pl-2">
            Main Menu
          </h2>
        </div>
        
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                  isActive 
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
                )}
                title={item.description}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    isActive 
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-8">
          <h2 className="px-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Support & Settings
          </h2>
          <nav className="mt-2 space-y-1">
            {secondaryNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                    isActive 
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
                  )}
                  title={item.description}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0",
                      isActive 
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 flex items-center justify-center">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">EASA Part 66</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Licensed Study App</p>
          </div>
        </div>
      </div>
    </div>
  );
}