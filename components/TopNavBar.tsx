import React, { useState, useRef, useEffect } from "react";
import type { UserModel } from "../models/UserModel";
import { useRouter, usePathname } from "next/navigation";

interface TopNavBarProps {
  user: UserModel;
  onLogout: () => void;
  activeNav?: string;
}

const navItems = [
  { label: "Khách hàng", dropdown: true },
  { label: "Cơ hội bán" },
  { label: "Công việc" },
  { label: "Báo cáo" },
];

export default function TopNavBar({
  user,
  onLogout,
  activeNav,
}: TopNavBarProps) {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [khDropdownOpen, setKhDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const khDropdownRef = useRef<HTMLLIElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
      if (
        khDropdownRef.current &&
        !khDropdownRef.current.contains(event.target as Node)
      ) {
        setKhDropdownOpen(false);
      }
    }
    if (userDropdownOpen || khDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userDropdownOpen, khDropdownOpen]);

  return (
    <nav className="flex items-center justify-between bg-white px-8 py-4 shadow-sm">
      <div className="flex items-center">
        <button
          onClick={() => router.push("/")}
          className="focus:outline-none"
          aria-label="Go to home page"
        >
          <img src="/images/logo.svg" alt="Digi.Sale" className="h-8 mr-6" />
        </button>
        <ul className="flex space-x-8">
          {/* Khách hàng dropdown */}
          <li className="relative" ref={khDropdownRef}>
            <button
              className={`font-semibold text-[#222] hover:text-[#ff6a00] cursor-pointer flex items-center gap-1 ${
                activeNav === "khach-hang" ? "text-[#ff6a00]" : ""
              }`}
              onClick={() => setKhDropdownOpen((open) => !open)}
            >
              Khách hàng
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {khDropdownOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-[#222]"
                  onClick={() => {
                    setKhDropdownOpen(false);
                    router.push("/khach-hang-tiem-nang");
                  }}
                >
                  Khách hàng tiềm năng
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-[#222]"
                  onClick={() => {
                    setKhDropdownOpen(false);
                    router.push("/khach-hang-hien-huu");
                  }}
                >
                  Danh mục khách hàng hiện hữu
                </button>
              </div>
            )}
          </li>
          {/* Other nav items */}
          {navItems.slice(1).map((item) => {
            let path: string;
            if (item.label === "Cơ hội bán") {
              path = "/co-hoi-ban";
            } else if (item.label === "Công việc") {
              path = "/cong-viec";
            } else if (item.label === "Báo cáo") {
              path = "/bao-cao";
            } else {
              path = `/${item.label.toLowerCase().replace(/ /g, "-")}`;
            }
            const isActive = pathname === path;
            return (
              <li
                key={item.label}
                className={`font-semibold text-[#222] hover:text-[#ff6a00] cursor-pointer ${
                  isActive ? "text-[#ff6a00]" : ""
                }`}
              >
                <button
                  onClick={() => router.push(path)}
                  className="focus:outline-none"
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Mã số thuế/ Tên KH/ Số CIF"
          className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6a00]"
        />
        <div className="relative" ref={userDropdownRef}>
          <button
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center focus:outline-none"
            onClick={() => setUserDropdownOpen((open) => !open)}
          >
            <img src="/images/user.jpg" alt="User" className="w-8 h-8" />
          </button>
          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-3 z-50 border">
              <div className="px-4 py-2 border-b">
                <div className="font-semibold text-[#222]">{user.name}</div>
                <div className="text-sm text-gray-500">
                  {user.email || user.username}
                </div>
              </div>
              <button
                className="w-full text-left px-4 py-2 text-[#ff6a00] hover:bg-gray-100 font-medium mt-2"
                onClick={onLogout}
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
