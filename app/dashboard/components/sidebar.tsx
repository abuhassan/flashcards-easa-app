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
  FileText,
  Clock,
  Zap,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Primary navigation items
const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: LayoutDashboard,
    description: 'Overview of your learning progress'
  },
  { 
    name: 'Study Session', 
    href: '/dashboard/study', 
    icon: GraduationCap,
    description: 'Start a new study session'
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
    name: 'Analytics', 
    href: '/dashboard/analytics', 
    icon: BarChart,
    description: 'View your learning statistics'
  },
];

// MVP modules for EASA Part 66 exam preparation
const priorityModules = [
  { number: 1, name: 'Mathematics', href: '/dashboard/modules/module-1' },
  { number: 3, name: 'Basic Electricity', href: '/dashboard/modules/module-3' },
  { number: 4, name: 'Basic Electronics', href: '/dashboard/modules/module-4' },
  { number: 8, name: 'Basic Aerodynamics', href: '/dashboard/modules/module-8' },
];

// Secondary navigation items
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
  const [isModulesOpen, setIsModulesOpen] = useState(
    pathname.includes('/dashboard/modules/')
  );
  
  return (
    <div className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <div className="flex flex-col flex-grow pt-5 pb-4 px-4">
        <div className="mb-4">
          <Link href="/dashboard" className="flex items-center mb-4">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white text-lg font-bold">E</span>
            </div>
            <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">EASA Flashcards</span>
          </Link>
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider pl-2">
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
        
        {/* Priority Modules Section */}
        <div className="mt-6">
          <Collapsible open={isModulesOpen} onOpenChange={setIsModulesOpen}>
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between px-2 mb-2 cursor-pointer">
                <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Priority Modules
                </h2>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                  {isModulesOpen ? (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-1 pl-2">
                {priorityModules.map((module) => {
                  const moduleHref = module.href;
                  const isModuleActive = pathname === moduleHref;
                  
                  return (
                    <Link
                      key={module.number}
                      href={moduleHref}
                      className={cn(
                        "group flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                        isModuleActive 
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
                      )}
                    >
                      <span 
                        className={cn(
                          "flex items-center justify-center h-5 w-5 rounded-full mr-3 text-xs font-medium",
                          isModuleActive
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                        )}
                      >
                        {module.number}
                      </span>
                      <span className="truncate">{module.name}</span>
                      <Zap 
                        className={cn(
                          "ml-auto h-4 w-4",
                          isModuleActive
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-400 opacity-0 group-hover:opacity-100"
                        )}
                      />
                    </Link>
                  );
                })}
                
                <Link
                  href="/dashboard/modules"
                  className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <span className="text-xs ml-8">View all modules →</span>
                </Link>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        
        {/* Recent Activity Section */}
        <div className="mt-6">
          <h2 className="px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Recent Activity
          </h2>
          <div className="px-3 py-2">
            <Link 
              href="/dashboard/study/history"
              className="flex items-center text-sm text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 mb-2"
            >
              <Clock className="h-4 w-4 text-gray-400 mr-2" />
              <span className="truncate">Basic Electricity</span>
              <span className="ml-auto text-xs text-gray-500">Yesterday</span>
            </Link>
            <Link 
              href="/dashboard/study/history"
              className="flex items-center text-sm text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
            >
              <Clock className="h-4 w-4 text-gray-400 mr-2" />
              <span className="truncate">Mathematics</span>
              <span className="ml-auto text-xs text-gray-500">2d ago</span>
            </Link>
          </div>
        </div>
        
        {/* Support & Settings */}
        <div className="mt-8">
          <h2 className="px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
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