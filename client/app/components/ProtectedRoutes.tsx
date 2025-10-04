"use client";
import { useUser } from "../hooks/useUser";
import { ROLE_PAGES } from "../constants/roles";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

// Define routes that don't require authentication
const PUBLIC_ROUTES = ["/login", "/register", "/unauthorized"];

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { role, isAuthenticated } = useUser();
  const { isLoading } = useAuth();
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Skip redirection while authentication is being checked
    if (isLoading) return;

    // Redirect authenticated users away from login/register pages
    if (
      isAuthenticated &&
      (pathName === "/login" || pathName === "/register")
    ) {
      router.replace("/");
      return;
    }

    // Allow access to public routes without authentication
    if (PUBLIC_ROUTES.includes(pathName)) {
      return;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    // For authenticated users, check role-based permissions
    const allowedPages = ROLE_PAGES[role];
    if (!allowedPages?.includes(pathName)) {
      router.replace("/unauthorized");
    }
  }, [pathName, role, isAuthenticated, isLoading, router]);

  return <>{children}</>;
};

export default ProtectedRoutes;
