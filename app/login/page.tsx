"use client";
import LoginScreen from "../../screens/LoginScreen";
import { useRouter } from "next/navigation";
import type { UserModel } from "../../models/UserModel";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect if already logged in
    const stored = localStorage.getItem("user");
    if (stored) {
      router.replace("/home");
    }
  }, [router]);

  const handleLoginSuccess = (user: UserModel) => {
    localStorage.setItem("user", JSON.stringify(user));
    router.replace("/home"); // Go to home after login
  };

  // Only render LoginScreen if not logged in (avoids flash)
  if (typeof window !== "undefined" && localStorage.getItem("user")) {
    return null;
  }

  return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
}
