"use client";

import UserNavbar from "@/components/User/user-navbar";
import { useUser } from "@/hooks/useUser";

export default function FullWidthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser();

  return (
    // Use flexbox to make the main content fill the remaining height
    <div className="h-screen flex flex-col bg-background">
      <UserNavbar user={user} />
      {/* This main tag takes up the remaining vertical space */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
