"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { UserProfile } from "@/components/user-profile";
import ProviderLayout from "@/components/Provider/layout/ProviderLayout";
import UserLayout from "@/components/User/layout/user-layout";
import { useUser } from "@/hooks/useUser";

type Tab = "profile" | "password";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { user, isLoading } = useUser();

  const handleSavePassword = () => {
    // Handle password save logic
    console.log("[v0] Saving password");
  };

  // Determine which layout to use based on user role
  const Layout = user?.role === "provider" ? ProviderLayout : UserLayout;

  // Show loading state while fetching user data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background md:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Settings
            </h1>
            <p className="mt-2 text-base text-muted-foreground md:text-lg">
              Manage your profile and account settings
            </p>
          </div>

          {/* Main Content */}
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-64">
              <nav className="flex flex-row gap-2 lg:flex-col">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={cn(
                    "flex-1 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors lg:flex-none",
                    activeTab === "profile"
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab("password")}
                  className={cn(
                    "flex-1 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors lg:flex-none",
                    activeTab === "password"
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  Password
                </button>
              </nav>
            </aside>

            {/* Content Area */}
            <main className="flex-1">
              {activeTab === "profile" && <UserProfile />}

              {activeTab === "password" && (
                <section>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-foreground md:text-2xl">
                      Update password
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground md:text-base">
                      Ensure your account is using a long, random password to
                      stay secure
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="current-password"
                        className="text-sm font-medium"
                      >
                        Current password
                      </Label>
                      <Input
                        id="current-password"
                        type="password"
                        placeholder="Current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="max-w-2xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="new-password"
                        className="text-sm font-medium"
                      >
                        New password
                      </Label>
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="max-w-2xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="confirm-password"
                        className="text-sm font-medium"
                      >
                        Confirm password
                      </Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="max-w-2xl"
                      />
                    </div>

                    <Button onClick={handleSavePassword} className="mt-2">
                      Save password
                    </Button>
                  </div>
                </section>
              )}
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
}
