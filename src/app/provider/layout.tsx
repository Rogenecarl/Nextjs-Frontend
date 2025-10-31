"use client"
import ProviderNavbar from "@/components/Provider/provider-navbar";
import { useUser } from "@/hooks/useUser";

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser();
  return (
    <div className="min-h-screen bg-background">
      <ProviderNavbar user={user} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {children}
      </main>
    </div>
  );
}
