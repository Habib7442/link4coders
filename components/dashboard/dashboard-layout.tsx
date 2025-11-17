"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import {
  User,
  Link,
  Palette,
  BarChart3,
  Settings,
  ArrowLeft,
  LogOut,
  Loader2,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const navigationItems: NavItem[] = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
    href: "/profile",
  },
  {
    id: "links",
    label: "Links",
    icon: Link,
    href: "/links",
  },
  {
    id: "templates",
    label: "Templates",
    icon: Palette,
    href: "/templates",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    href: "/analytics",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  showPreview?: boolean;
  previewContent?: React.ReactNode;
}

export function DashboardLayout({
  children,
  showPreview = false,
  previewContent,
}: DashboardLayoutProps) {
  const { user, loading, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [loading, user, router]);

  // Reset navigation state when pathname changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 100); // Small delay to ensure navigation is complete
    
    return () => clearTimeout(timer);
  }, [pathname]);

  const handleNavigation = (href: string) => {
    setIsNavigating(true);
    router.push(href);
  };

  const handleSignOut = async () => {
    await logout();
    router.push("/");
  };

  const getActiveNavItem = () => {
    return (
      navigationItems.find((item) => pathname.startsWith(item.href))?.id ||
      "profile"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#18181a] flex items-center justify-center">
        <div className="glassmorphic rounded-[20px] p-8 shadow-[0px_16px_30.7px_rgba(0,0,0,0.30)]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[#54E0FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-[24px] font-medium leading-[28px] tracking-[-0.72px] font-sharp-grotesk text-white mb-2">
              Loading Dashboard
            </h2>
            <p className="text-[16px] font-light leading-[24px] tracking-[-0.48px] text-[#7a7a83] font-sharp-grotesk">
              Please wait while we load your profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to home
  }

  return (
    <div className="h-screen bg-[#18181a] flex overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:w-64 bg-[#1e1e20] border-r border-[#33373b] flex-col">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#33373b] flex-shrink-0">
          <div className="flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="Link4Devs Logo" 
              width={24}
              height={24}
              className="flex-shrink-0"
            />
            <span className="text-white text-[16px] font-medium tracking-[-0.4px] font-sharp-grotesk">
              Dashboard
            </span>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-3 border-b border-[#33373b] flex-shrink-0">
          <div className="flex items-center gap-2 mb-2">
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt={user.user_metadata.full_name || user.email || 'User avatar'}
                className="w-9 h-9 rounded-full flex-shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#54E0FF] to-[#29ADFF] flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-[#18181a]" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-[14px] font-medium leading-[18px] tracking-[-0.35px] font-sharp-grotesk text-white truncate">
                {user.user_metadata?.full_name || "Developer"}
              </h3>
              <p className="text-[12px] font-light leading-[16px] tracking-[-0.3px] text-[#7a7a83] font-sharp-grotesk truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto custom-scrollbar">
          <div className="space-y-1.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = getActiveNavItem() === item.id;

              return (
                <Button
                  key={item.id}
                  onClick={() => handleNavigation(item.href)}
                  disabled={isNavigating}
                  className={`w-full justify-start text-left p-2 h-auto rounded-[8px] transition-all duration-200 ${
                    isActive
                      ? "bg-[#54E0FF]/10 border border-[#54E0FF]/30 text-[#54E0FF]"
                      : "bg-transparent border border-transparent text-[#7a7a83] hover:text-white hover:bg-[#28282b] hover:border-[#33373b]"
                  } ${isNavigating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-start gap-2">
                    {isNavigating && isActive ? (
                      <Loader2 className="w-4 h-4 mt-0.5 flex-shrink-0 animate-spin" />
                    ) : (
                      <Icon
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          isActive ? "text-[#54E0FF]" : "text-current"
                        }`}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-[13px] font-medium leading-[16px] tracking-[-0.32px] font-sharp-grotesk flex items-center gap-1.5 ${
                          isActive ? "text-[#54E0FF]" : "text-current"
                        }`}
                      >
                        {item.label}
                      </div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[#33373b] flex-shrink-0">
          <div className="space-y-1.5">
            <Button
              onClick={() => router.push("/")}
              className="w-full justify-start bg-transparent border border-[#33373b] text-[#7a7a83] hover:text-white hover:border-[#54E0FF]/30 font-medium text-[12px] tracking-[-0.3px] font-sharp-grotesk rounded-[6px] px-2 py-1.5 h-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
              <span className="truncate">Back to Home</span>
            </Button>
            <Button
              onClick={handleSignOut}
              className="w-full justify-start bg-transparent border border-[#33373b] text-[#7a7a83] hover:text-red-400 hover:border-red-400/30 font-medium text-[12px] tracking-[-0.3px] font-sharp-grotesk rounded-[6px] px-2 py-1.5 h-auto"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
              <span className="truncate">Sign Out</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden bg-[#1e1e20] border-b border-[#33373b] flex-shrink-0">
          <div className="flex items-center justify-between w-full px-4 py-3">
            <div className="flex items-center gap-2">
              <Image 
                src="/logo.png" 
                alt="Link4Devs Logo" 
                width={24}
                height={24}
                className="flex-shrink-0"
              />
              <span className="text-white text-[16px] font-medium tracking-[-0.4px] font-sharp-grotesk">
                Dashboard
              </span>
            </div>
            <Button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 h-auto rounded-md flex items-center text-[12px] font-medium"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </Button>
          </div>
        </header>

        {/* Content Layout */}
        <div className={`flex-1 flex flex-col lg:flex-row ${showPreview ? 'lg:grid lg:grid-cols-12' : ''} overflow-hidden`}>
          {/* Page Content */}
          <main className={`flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pb-20 lg:pb-0 ${showPreview ? 'lg:col-span-8' : ''}`}>
            <div className="h-full w-full p-4 md:p-6">
              {isNavigating ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-8 h-8 border-2 border-[#54E0FF] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                children
              )}
            </div>
          </main>

          {/* Live Preview Panel */}
          {showPreview && previewContent && (
            <aside className="hidden lg:block lg:col-span-4 bg-[#1e1e20] border-l border-[#33373b] overflow-hidden">
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-[#33373b] flex-shrink-0">
                  <h3 className="text-[16px] font-medium text-white font-sharp-grotesk">
                    Live Preview
                  </h3>
                  <p className="text-[12px] text-[#7a7a83] font-sharp-grotesk mt-1">
                    See how your profile looks to visitors
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                  {previewContent}
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}