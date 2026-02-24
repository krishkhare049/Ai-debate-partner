"use client";
import LoginForm from "@/components/auth/LoginForm";
import useRedirectIfAuth from "@/hooks/useRedirectIfAuth";

export default function LoginPage() {
  useRedirectIfAuth()
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoginForm />
    </div>
  );
}