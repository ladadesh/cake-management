"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "../hooks/useUser";
import { useAuth } from "../context/AuthContext";
import { ROLE_PAGES } from "../constants/roles";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const Header = () => {
  const { role, isAuthenticated, name } = useUser();
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const allowedRoutes = ROLE_PAGES[role];

  const links = [
    { href: "/", label: "Home" },
    { href: "/upload-slip", label: "Upload Slip" },
    { href: "/place-order", label: "Place Order" },
    { href: "/orders", label: "View Orders" },
    { href: "/slip-list", label: "Slip List" },
    { href: "/users", label: "Users" },
    { href: "/admin", label: "Admin" },
    { href: "/delivery", label: "Delivery" },
  ];

  const visibleLinks = links.filter((link) =>
    allowedRoutes.includes(link.href)
  );

  return (
    <header className="flex justify-between items-center p-4 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-20">
      <Link href="/">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Cake Affair Logo"
            width={40}
            height={40}
            className="h-10 w-auto"
          />
        </div>
      </Link>

      {isAuthenticated ? (
        <>
          <div className="flex items-center md:hidden">
            {visibleLinks.length > 1 && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>

          <div className="hidden md:flex items-center">
            {/* Desktop Navigation */}
            <nav className="space-x-4 text-sm font-medium mr-6">
              {visibleLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${
                    pathname === link.href
                      ? "text-pink-600 border-b-2 border-pink-600 pb-1"
                      : "hover:text-pink-600"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* User profile and logout */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                Welcome, {name.toUpperCase() || "User"}
              </span>
              <button
                onClick={logout}
                className="text-sm px-3 py-1 bg-pink-600 hover:bg-pink-700 text-white rounded transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && visibleLinks.length > 1 && (
            <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-sm md:hidden shadow-md">
              <nav className="flex flex-col items-center p-4 space-y-4">
                {visibleLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`${
                      pathname === link.href
                        ? "text-pink-600 font-bold"
                        : "text-gray-700 hover:text-pink-600"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex flex-col items-center gap-4 pt-4 border-t w-full">
                  <span className="text-sm font-medium">
                    Welcome, {name.toUpperCase() || "User"}
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="text-sm px-4 py-2 w-full bg-pink-600 hover:bg-pink-700 text-white rounded-md transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </nav>
            </div>
          )}
        </>
      ) : (
        <nav className="space-x-4 text-sm font-medium">
          <Link
            href="/login"
            className={`${
              pathname === "/login"
                ? "text-pink-600 border-b-2 border-pink-600 pb-1"
                : "hover:text-pink-600"
            }`}
          >
            Login
          </Link>
          <Link
            href="/register"
            className={`${
              pathname === "/register"
                ? "text-pink-600 border-b-2 border-pink-600 pb-1"
                : "hover:text-pink-600"
            }`}
          >
            Register
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
