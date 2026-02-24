"use client";
import SignupForm from "@/components/auth/SignupForm";
import useRedirectIfAuth from "@/hooks/useRedirectIfAuth";

export default function SignupPage() {
  useRedirectIfAuth()
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignupForm />
    </div>
  );
}