"use client";

import { useAuth } from "../context/AuthContext";
import { UserRole } from "../constants/roles";

export const useUser = () => {
  const { user, isAuthenticated } = useAuth();
  
  // If user is authenticated, return user data from auth context
  // Otherwise, return a default user with null values
  return {
    id: user?.id || "",
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "employee" as UserRole,
    isAuthenticated,
  };
};