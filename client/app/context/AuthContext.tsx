"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios"; // Using axios directly here, but could also be your api.ts instance
import { useRouter } from "next/navigation";
import { UserRole } from "../constants/roles";

// It's better to create the axios instance outside the component
// to prevent it from being recreated on every render.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ========================
// Types
// ========================
type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

interface AuthContextType {
  user: User;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

// ========================
// Create Context
// ========================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ========================
// Auth Provider
// ========================
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check token on load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      fetchUserData(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  // ========================
  // Fetch User Data
  // ========================
  const fetchUserData = async (authToken: string) => {
    try {
      // Pass the token directly in the request headers for immediate authorization
      const { data } = await api.get("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setUser({
        id: data._id, // MongoDB uses _id by default
        name: data.username,
        email: data.email,
        role: "employee",
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      logout();
      setIsLoading(false);
    }
  };

  // ========================
  // Login
  // ========================
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data } = await api.post("/api/auth/login", { email, password });

      localStorage.setItem("token", data.token);
      await fetchUserData(data.token);

      return { success: true };
    } catch (error: any) {
      console.error("Login error:", error);
      const message =
        error.response?.data?.message || "An error occurred during login";
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  // ========================
  // Register
  // ========================
  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      setIsLoading(true);
      const { data } = await api.post("/api/auth/register", {
        username,
        email,
        password,
      });

      return {
        success: true,
        message: data.message || "Registration successful. Please log in.",
      };
    } catch (error: any) {
      console.error("Registration error:", error);
      const message =
        error.response?.data?.message ||
        "An error occurred during registration";
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  // ========================
  // Logout
  // ========================
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  // ========================
  // Context Value
  // ========================
  const value = {
    user, // The user object
    token: typeof window !== "undefined" ? localStorage.getItem("token") : null, // Provide token if needed elsewhere
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ========================
// Custom Hook
// ========================
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
