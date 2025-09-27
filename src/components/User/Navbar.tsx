"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, MapPin, Heart, Calendar, Search } from "lucide-react"
import AvatarDropdownmenu from "../avatar"
import { useUser } from "@/hooks/useUser"
import Image from "next/image"

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { user, isLoading } = useUser()


    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const navLinks = [
        { name: "Find Services", href: "/healthcare" },
        { name: "Booking", href: "/booking" },
        { name: "Favorite", href: "/favorites" },
        { name: "Map", href: "/map" },
    ]

    return (
        <nav className="border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and Brand */}
                    <Link href="/" className="flex items-center">
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                                    <Image src="/logo.png" alt="Logo" width={40} height={40} />
                                </div>
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-xl font-bold text-foreground">Project HIMSOG</h1>
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => {
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
                                >
                                    <span>{link.name}</span>
                                </Link>
                            )
                        })}
                    </div>

                    {/* Show Avatar menu if user is authenticated, otherwise show auth buttons */}
                    {user ? (
                        <AvatarDropdownmenu user={user} />
                    ) : (
                        <div className="hidden md:flex items-center space-x-3">
                            <Link href="/auth/login">
                                <Button variant="ghost" className="text-foreground hover:text-primary">
                                    Login
                                </Button>
                            </Link>
                            <Link href="/auth/role">
                                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Register</Button>
                            </Link>
                        </div>
                    )}

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <Button variant="ghost" size="sm" onClick={toggleMenu} className="text-foreground hover:text-primary">
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-border">
                        <div className="px-2 pt-2 pb-3 space-y-1">
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
                                )
                            })}

                            {/* Mobile Auth Buttons - Only show if not authenticated */}
                            {!user && (
                                <div className="pt-4 space-y-2">
                                    <Link href="/auth/login">
                                        <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary">
                                            Login
                                        </Button>
                                    </Link>
                                    <Link href="/auth/role">
                                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Register</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
