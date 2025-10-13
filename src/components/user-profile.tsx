"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUser } from "@/hooks/useUser";

export function UserProfile() {
  const { user, isLoading } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Update form fields when user data is loaded
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSaveProfile = () => {
    // Handle profile save logic
    console.log("[v0] Saving profile:", { name, email });
  };

  const handleDeleteAccount = () => {
    // Handle account deletion logic
    console.log("[v0] Deleting account");
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground md:text-2xl">
              Profile information
            </h2>
            <p className="mt-1 text-sm text-muted-foreground md:text-base">
              Loading profile data...
            </p>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Name</Label>
              <div className="h-10 bg-muted animate-pulse rounded-md max-w-2xl"></div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Email address</Label>
              <div className="h-10 bg-muted animate-pulse rounded-md max-w-2xl"></div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Information Section */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground md:text-2xl">
            Profile information
          </h2>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            Update your name and email address
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Name
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="max-w-2xl"
              disabled={!user}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="max-w-2xl"
              disabled={!user}
            />
          </div>

          <Button onClick={handleSaveProfile} className="mt-2" disabled={!user}>
            Save
          </Button>
        </div>
      </section>

      {/* Delete Account Section */}
      <section className="pt-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground md:text-2xl">
            Delete account
          </h2>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            Delete your account and all of its resources
          </p>
        </div>

        <Alert className="max-w-2xl border-destructive/50 bg-destructive/10">
          <AlertDescription className="space-y-4">
            <div>
              <p className="font-semibold text-destructive">Warning</p>
              <p className="mt-1 text-sm text-destructive">
                Please proceed with caution, this cannot be undone.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete account
            </Button>
          </AlertDescription>
        </Alert>
      </section>
    </div>
  );
}
