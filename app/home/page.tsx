"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { UserModel } from "../../models/UserModel";
import HomeScreen from "../../screens/HomeScreen";

export default function HomeDashboardPage() {
  const [user, setUser] = useState<UserModel | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    else router.replace("/login");
  }, [router]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.replace("/login");
  };

  if (!user) return null;
  return <HomeScreen user={user} onLogout={handleLogout} />;
}
