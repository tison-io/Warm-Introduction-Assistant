"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AUTH_EVENT } from "../lib/auth-events";

export default function AuthGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const expiry = localStorage.getItem("auth_expiry");

      if (token && expiry && Date.now() > parseInt(expiry)) {
        localStorage.clear();
        window.dispatchEvent(new Event(AUTH_EVENT));
        router.push("/login");
        return true;
      }
      return false;
    };

    checkAuth();

    const interval = setInterval(checkAuth, 60000);

    return () => clearInterval(interval);
  }, [pathname, router]);

  return null;
}