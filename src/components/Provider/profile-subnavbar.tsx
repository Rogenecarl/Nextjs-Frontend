"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // Assuming you use shadcn's utility function

// Define your navigation links
const navLinks = [
    { name: "Profile", href: "/provider/profile" },
    { name: "Services", href: "/provider/profile/services" },
    { name: "Operating Hours", href: "/provider/profile/operating-hours" },
];

export default function ProfileNavLinks() {
    // Get the current path to determine which link is active
    const pathname = usePathname();

    return (
        <nav className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1">
            {navLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        // We use the `cn` utility to conditionally apply the "active" styles
                        className={cn(
                            "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all",
                            isActive
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {link.name}
                    </Link>
                );
            })}
        </nav>
    );
}