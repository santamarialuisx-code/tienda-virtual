import { auth } from "@/lib/auth/config";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  
  // Protected routes that require authentication
  const protectedRoutes = ["/account", "/checkout"];
  const adminRoutes = ["/admin"];
  
  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some((route) => 
    pathname.startsWith(route)
  );
  
  const isAdminRoute = adminRoutes.some((route) => 
    pathname.startsWith(route)
  );
  
  // If user is not authenticated and trying to access protected route
  if ((isProtectedRoute || isAdminRoute) && !req.auth) {
    const url = new URL("/auth/login", req.url);
    url.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(url);
  }
  
  // If user is authenticated but not admin and trying to access admin route
  if (isAdminRoute && req.auth?.user?.role !== "admin") {
    return NextResponse.redirect(new URL("/admin/not-authorized", req.url));
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ["/account/:path*", "/checkout/:path*", "/admin/:path*"],
};