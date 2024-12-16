"use client";

import React, { useState, ReactNode, useEffect } from "react";
import {
  Menu,
  X,
  FileSpreadsheet,
  ListChecks,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getUserData } from "@/utils/storage";
import { cn } from "@/lib/utils";

interface SidebarLayoutProps {
  children: ReactNode;
}

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  // eslint-disable-next-line
  href?: any;
  onClick?: () => void;
  isButton?: boolean;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const { firstName, lastName, logOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const { isAuth } = useAuth();
  const userData = getUserData();

  const handleLogout = () => {
    logOut();
    setShowLogoutDialog(false);
    setIsLoading(true);
    localStorage.clear();
    router.push("/home");
  };

  const menuItems: MenuItem[] = [
    // { icon: Home, text: "Home", href: "/home" },
    { icon: FileSpreadsheet, text: "Create Test", href: "/createtest" },
    { icon: ListChecks, text: "Assessments", href: "/assessments" },
    {
      icon: LogOut,
      text: "Logout",
      onClick: () => setShowLogoutDialog(true),
      isButton: true,
    },
  ];

  useEffect(() => {
    if (!isAuth && pathname === "/corporatelogin") {
      router.replace("/corporatelogin");
    }
  }, [isAuth, pathname, router]);

  return (
    <div className="min-h-screen h-fit relative bg-gradient-to-r">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800 via-[#2C0368] to-[#0a0a0a]"></div>

      {/* Grid overlay */}
      <div className="absolute h-1/2 inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      {/* Mobile hamburger button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden relative top-4 left-4 z-50 p-2 rounded-md bg-[#0f0f0f] text-white"
        >
          <Menu size={24} />
        </button>
      )}

      {/* User Avatar Button - Fixed to top right */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "fixed top-4 cursor-pointer right-4 border border-slate-700 z-50 flex items-center gap-2 p-6 rounded-full bg-[#0f0f0f] text-white transition-colors",
            isLoading ? "hidden" : ""
          )}
          asChild
        >
          <Avatar>
            {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
            <AvatarFallback>
              {firstName && lastName
                ? firstName?.charAt(0) + lastName?.charAt(0)
                : userData?.firstName.charAt(0) + userData?.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44 bg-[#0f0f0f] border-none text-white">
          <DropdownMenuLabel>
            {firstName && lastName
              ? firstName + " " + lastName
              : userData?.firstName + " " + userData?.lastName}
          </DropdownMenuLabel>{" "}
          <DropdownMenuSeparator className="bg-slate-600" />
          <DropdownMenuItem
            onClick={() => setShowLogoutDialog(true)}
            className="cursor-pointer hover:font-light"
          >
            <LogOut />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Logout Confirmation Modal */}
      {showLogoutDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Modal Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowLogoutDialog(false)}
          />

          {/* Modal Content */}
          <div className="relative rounded-2xl bg-[#0f0f0f] w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Confirm Logout
              </h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to logout? Any unsaved progress will be
                lost.
              </p>

              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => setShowLogoutDialog(false)}
                  className="px-4 border-none shadow-none text-white cursor-pointer py-2 rounded-md hover:text-slate-400 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-2xl bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#0f0f0f] bg-opacity-50 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 lg:w-80 bg-[#0f0f0f] text-white transform transition-transform duration-200 ease-in-out z-40
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
      >
        {/* Header with company name and close button */}
        <div className="h-16 bg-[#0f0f0f] relative">
          {/* Close button - only visible on mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute right-2 top-3 p-2 rounded-md text-gray-300 hover:text-white"
          >
            <X size={24} />
          </button>

          {/* Company name */}
          <div className="h-full flex items-center px-6">
            <Link href="/home" className="flex-shrink-0 flex items-center">
              <span className="text-white lg:text-3xl text-2xl font-bold cursor-pointer">
                <span className="bg-gradient-to-r from-[#32BAFF] to-pink-500 bg-clip-text text-transparent">
                  AI Hire{" "}
                </span>
                <span className="bg-gradient-to-r from-[#6666FF] to-red-400 bg-clip-text text-transparent">
                  Studio
                </span>
              </span>
            </Link>
          </div>
        </div>

        {/* Menu items */}
        <nav className="mt-12 px-2">
          {menuItems.map((item, index) =>
            item.isButton ? (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full flex items-center rounded-full my-3 px-6 py-3 hover:text-[#0f0f0f] hover:bg-white hover:font-bold transition-colors duration-200"
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.text}</span>
              </button>
            ) : (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center rounded-full my-3 px-6 py-3 hover:font-bold hover:text-[#0f0f0f] hover:bg-white transition-colors duration-200
                  ${
                    pathname === item.href
                      ? "bg-white text-[#0f0f0f] font-bold"
                      : ""
                  }`} // Highlight if active
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.text}</span>
              </Link>
            )
          )}
        </nav>
      </div>

      {/* Main content wrapper */}
      <div className="lg:ml-64 relative">
        {/* Mobile header spacer */}
        <div className="h-16" />

        {/* Content area with proper padding */}
        <div className="p-6 lg:px-20">{children}</div>
      </div>
    </div>
  );
};

export default SidebarLayout;
