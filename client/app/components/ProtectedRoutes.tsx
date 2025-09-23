"use client";
import { useUser } from "../hooks/useUser";
import { ROLE_PAGES } from "../constants/roles";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { role } = useUser();
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    const allowedPages = ROLE_PAGES[role];
    if (!allowedPages?.includes(pathName)) {
      router.replace("/unauthorized");
    }
  }, [pathName, role, router]);

  return <>{children}</>;
};

export default ProtectedRoutes;
