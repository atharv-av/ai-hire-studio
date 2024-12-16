"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-provider";

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

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuth, firstName, lastName, logOut } = useAuth();
  const userData = getUserData();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = "auto";
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logOut();
    localStorage.clear();
  };

  const corpData = localStorage.getItem("corp_user_data");
  const isCorp = Boolean(corpData);

  return (
    <nav
      className={`fixed py-2 top-0 left-0 w-full z-50 transition-colors duration-300 ${
        isScrolled || isMenuOpen ? "bg-[#0a0a0a]" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="#home" className="flex-shrink-0 flex items-center">
            <span className="text-white text-xl font-bold cursor-pointer">
              <span className="bg-gradient-to-r from-[#32BAFF] to-pink-500 bg-clip-text text-transparent">
                AI Hire{" "}
              </span>
              <span className="bg-gradient-to-r from-[#6666FF] to-red-400 bg-clip-text text-transparent">
                Studio
              </span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/about"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              About Us
            </Link>
            <Link
              href="#services"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Services
            </Link>
            <Link
              href="#plans"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Plans
            </Link>
            <Link
              href="/contact"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Contact
            </Link>
            {!isAuth ? (
              <div className="space-x-4">
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link href="/corporatelogin">
                  <Button
                    className="py-2 px-6 relative rounded-full bg-[#E8DDFF] hover:bg-[#C2B4FC] text-black font-semibold text-md"
                    size="default"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-center w-fit space-x-4">
                <Link href={isCorp ? "/assessments" : "/tests"}>
                  <Button
                    className="py-2 px-6 relative rounded-full bg-[#E8DDFF] hover:bg-[#C2B4FC] text-black font-semibold text-md"
                    size="default"
                  >
                    Dashboard
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="cursor-pointer relative left-4 border border-black flex items-center gap-2 p-4 rounded-full bg-[#E8DDFF] hover:bg-[#C2B4FC] text-black transition-colors"
                    asChild
                  >
                    <Avatar>
                      {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
                      <AvatarFallback className="font-bold">
                        {firstName && lastName
                          ? firstName?.charAt(0) + lastName?.charAt(0)
                          : userData?.firstName.charAt(0) +
                            userData?.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    sideOffset={5}
                    collisionPadding={20}
                    className="w-44 bg-[#0f0f0f] border-none text-white"
                  >
                    <DropdownMenuLabel>
                      {firstName && lastName
                        ? firstName + " " + lastName
                        : userData?.firstName + " " + userData?.lastName}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-600" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer hover:font-light"
                    >
                      <LogOut />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {!isAuth ? (
              <div className="space-y-1">
                <Link
                  onClick={toggleMenu}
                  href="/login"
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Login
                </Link>
                <Link
                  onClick={toggleMenu}
                  href="/corporatelogin"
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <Link
                href={isCorp ? "/assessments" : "/tests"}
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Dashboard
              </Link>
            )}
            <Link
              onClick={toggleMenu}
              href="#services"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Services
            </Link>
            <Link
              onClick={toggleMenu}
              href="#plans"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Plans
            </Link>
            <Link
              onClick={toggleMenu}
              href="/about"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              About Us
            </Link>
            <Link
              onClick={toggleMenu}
              href="/contact"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Contact
            </Link>
            {isAuth && (
              <div
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="text-gray-300 cursor-pointer hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Logout
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
