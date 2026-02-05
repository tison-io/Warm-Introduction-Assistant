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

      if (token && expiry) {
        if (Date.now() > parseInt(expiry)) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("auth_expiry");
          
          window.dispatchEvent(new Event(AUTH_EVENT));
          router.push("/login");
        }
      }
    };

    checkAuth();
  }, [pathname, router]);

  return null;
}