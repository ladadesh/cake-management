"use client";
import Link from "next/link";
import { useUser } from "../hooks/useUser";
import { ROLE_PAGES } from "../constants/roles";
import { usePathname } from "next/navigation";

const Header = () => {
  const { role } = useUser();
  const pathname = usePathname();
  const allowedRoutes = ROLE_PAGES[role];

  const links = [
    { href: "/", label: "Home" },
    { href: "/upload-slip", label: "Upload Slip" },
    { href: "/place-order", label: "Place Order" },
    { href: "/orders", label: "View Orders" },
    { href: "/users", label: "Users" },
    { href: "/admin", label: "Admin" },
    { href: "/slip-list", label: "Slip List" },
  ];

  return (
    <header className="flex justify-between items-center p-4 border-b">
      <Link href="/">
        <div className="text-pink-600 font-bold text-lg flex items-center">
          <span className="mr-2">🎂</span> Cake Affair
        </div>
      </Link>
      <nav className="space-x-4 text-sm font-medium">
        {links
          .filter((link) => allowedRoutes.includes(link.href))
          .map((link) => (
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
    </header>
  );
};

export default Header;
