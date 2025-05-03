"use client"; // Required for hooks like useState, useEffect, useContext
import { useEffect, useState, createContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import TopNavBar from "../components/TopNavBar";
import type { UserModel } from "../models/UserModel";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Context for user state (can be moved to a separate file)
export const UserContext = createContext<{
  user: UserModel | null;
  logout: () => void;
}>({ user: null, logout: () => {} });

// Metadata remains a server component feature, keep it separate if needed
// export const metadata: Metadata = {
//   title: "Digi.Sale CRM",
//   description: "Digi.Sale CRM Application",
// };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<UserModel | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Prevent flicker before auth check
  const router = useRouter();
  const pathname = usePathname();

  // Check authentication on mount and path change
  useEffect(() => {
    const stored = localStorage.getItem("user");
    const isLoginPage = pathname === "/login";

    if (stored) {
      setUser(JSON.parse(stored));
    } else if (!isLoginPage) {
      // If not logged in and not on login page, redirect
      router.replace("/login");
    }
    setIsLoading(false);
  }, [pathname, router]);

  // Logout handler
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.replace("/login");
  };

  // Don't render anything until auth check is complete
  if (isLoading) {
    // Return minimal structure during loading instead of null
    return (
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* Optional: Add a loading spinner here */}
        </body>
      </html>
    );
  }

  // Determine if the nav bar should be shown
  const showNavBar = user && pathname !== "/login";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserContext.Provider value={{ user, logout: handleLogout }}>
          <div className="min-h-screen bg-[#f6f8fa] flex flex-col">
            {showNavBar && (
              <TopNavBar
                user={user}
                onLogout={handleLogout}
                activeNav={pathname.split("/")[1]}
              />
            )}
            <main className={showNavBar ? "flex-1" : ""}>{children}</main>
          </div>
        </UserContext.Provider>
      </body>
    </html>
  );
}
