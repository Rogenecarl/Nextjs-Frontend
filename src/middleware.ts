// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { UserProps } from "./types/types";
import axios from "axios";

// This interface should match your Laravel UserResource structure
interface User extends UserProps {
    role: 'admin' | 'provider' | 'user';
}

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('authToken')?.value;
    const url = req.nextUrl.clone();

    const isAuthPage = url.pathname.startsWith('/auth');
    const isAdminPage = url.pathname.startsWith('/admin');
    const isProviderPage = url.pathname.startsWith('/provider');
    const isHomePage = url.pathname === '/';

    // user group routes
    const userGroupRoutes = [
        '/healthcare',
        '/booking',
        '/favorite',
        '/map'
    ]

    // Case 1: No token, but trying to access a protected page
    if (!token && (isAdminPage || isProviderPage)) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // Case 2: A token exists. Verify it and get the user role.
    if (token) {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
            if (!apiUrl) {
                throw new Error("NEXT_PUBLIC_BACKEND_API_URL is not defined.");
            }

            const response = await axios.get(`${apiUrl}/user`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });

            const user: User = response.data.data;
            const userRole = user.role;

            console.log("user details from middleware:", user);

            // --- REDIRECT LOGIC ---
            // If the user is authenticated and tries to visit an auth page, redirect them.
            if (isAuthPage) {
                if (userRole === 'admin') {
                    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
                } else if (userRole === 'provider') {
                    return NextResponse.redirect(new URL('/provider/dashboard', req.url));
                } else {
                    // Default dashboard for other roles like 'user'
                    return NextResponse.redirect(new URL('/healthcare', req.url));
                }
            }

            // If the user is authenticated and tries to visit the home page, redirect them to their dashboard.
            if (isHomePage || userGroupRoutes.includes(url.pathname)) {
                if (userRole === 'admin') {
                    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
                } else if (userRole === 'provider') {
                    return NextResponse.redirect(new URL('/provider/dashboard', req.url));
                }
            }

            // --- AUTHORIZATION LOGIC ---
            // If on a protected page, check if the role is sufficient.
            if (isAdminPage && userRole !== 'admin') {
                return NextResponse.redirect(new URL('/unauthorized', req.url));
            }
            if (isProviderPage && userRole !== 'provider') {
                return NextResponse.redirect(new URL('/unauthorized', req.url));
            }

        } catch (error) {
            // This means the token is invalid or expired.
            console.error("Token verification failed:", error);
            // Delete the invalid cookie
            const response = NextResponse.redirect(new URL('/auth/login', req.url));
            response.cookies.delete('authToken');
            return response;
        }
    }

    // If none of the above conditions are met, allow the request to proceed.
    return NextResponse.next();
}

// --- THIS IS THE CRUCIAL CHANGE ---
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};