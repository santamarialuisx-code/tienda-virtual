import { auth } from "./config";
import { redirect } from "next/navigation";

/**
 * Get server session - wrapper around NextAuth's auth()
 * Returns the session or null if not authenticated
 */
export async function getServerSession() {
  return await auth();
}

/**
 * Check if the current user has admin role
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession();
  return session?.user?.role === "admin";
}

/**
 * Require authentication - redirects to login if not authenticated
 * Returns the session if authenticated
 */
export async function requireAuth() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/auth/login");
  }
  return session;
}

/**
 * Require admin role - redirects to login if not authenticated,
 * or shows unauthorized page if not admin
 */
export async function requireAdmin() {
  const session = await requireAuth();
  if (session.user.role !== "admin") {
    redirect("/admin/not-authorized");
  }
  return session;
}