"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, MapPin, Heart, Calendar, Search } from "lucide-react";
import AvatarDropdownmenu from "../avatar";
import { useUser } from "@/hooks/useUser";
import AvatarLoadingSkeleton from "../skeletons/avatar-skeleton";
import NotificationBell from "../notification";

export default function ProviderNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoading } = useUser();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: "Dashboard", href: "/provider/dashboard" },
    { name: "Appointments", href: "/provider/appointments" },
    { name: "Services", href: "/provider/services" },
    { name: "Schedule", href: "/provider/schedule" },
    { name: "Provider Profile", href: "/provider/profile" },
    { name: "Reviews", href: "/provider/reviews" },
  ];

  return (
    <nav className="border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-xl">
                      S
                    </span>
                  </div>
                </div>
                {/* <div className="hidden sm:block">
                                <h1 className="text-xl font-bold text-foreground">Project HIMSOG</h1>
                            </div> */}
              </div>
            </Link>

            {/* Desktop Navigation Links - Show only main ones */}
            <div className="hidden lg:flex items-center space-x-6">
              {navLinks.slice(0, 4).map((link) => {
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium text-sm"
                  >
                    <span>{link.name}</span>
                  </Link>
                );
              })}
              {/* More dropdown for additional items */}
              <div className="relative group">
                <button className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium text-sm">
                  <span>More</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {navLinks.slice(4).map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Show Avatar menu if user is authenticated, otherwise show auth buttons */}
          <div className="flex items-center space-x-3">
            {isLoading && user ? (
              <AvatarLoadingSkeleton />
            ) : !user ? (
              <div className="hidden md:flex items-center space-x-3">
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    className="text-foreground hover:text-primary"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/auth/role">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Register
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <NotificationBell />
                <AvatarDropdownmenu user={user} />
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="text-foreground hover:text-primary"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1 max-h-96 overflow-y-auto">
              {navLinks.map((link) => {
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center space-x-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="font-medium">{link.name}</span>
                  </Link>
                );
              })}

              {/* Mobile Auth Buttons - Only show if not authenticated */}
              {!user && (
                <div className="pt-4 space-y-2 border-t border-border">
                  <Link href="/auth/login">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-foreground hover:text-primary"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/role">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
