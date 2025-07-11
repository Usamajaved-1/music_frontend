"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function useAuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      router.replace("/auth");
      return;
    }

    if (pathname.startsWith("/admin") && role !== "admin") {
      router.replace("/auth");
      return;
    }

    if (pathname.startsWith("/courses") && role === "admin") {
      router.replace("/admin");
      return;
    }

    setLoading(false); // ✅ We're safe to render the page
  }, [router, pathname]);

  return { loading };
}
