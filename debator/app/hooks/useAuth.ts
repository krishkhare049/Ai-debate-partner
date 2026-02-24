"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function useAuth() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!token && !storedToken) {
      router.push("/login");
    }
  }, [token, router]);
}