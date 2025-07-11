"use client";

import React, { useState, useEffect } from "react";
import { HoveredLink, Menu, MenuItem } from "./ui/navbar-menu";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    const name = localStorage.getItem("username");

    setIsLoggedIn(!!token);
    setRole(userRole);
    setUsername(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setRole(null);
    setUsername(null);
    router.push("/auth");
  };

  return (
    <>
      {/* Centered Navbar */}
      <div className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}>
        <Menu setActive={setActive}>
          <Link href={"/"}>
            <MenuItem setActive={setActive} active={active} item="Home" />
          </Link>

          <MenuItem setActive={setActive} active={active} item="Our Courses">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/courses">All Courses</HoveredLink>
              <HoveredLink href="/courses">Basic Music Theory</HoveredLink>
              <HoveredLink href="/courses">Advanced Composition</HoveredLink>
              <HoveredLink href="/courses">Songwriting</HoveredLink>
              <HoveredLink href="/courses">Music Production</HoveredLink>
            </div>
          </MenuItem>

          <Link href={"/contact"}>
            <MenuItem setActive={setActive} active={active} item="Contact Us" />
          </Link>

          {isLoggedIn && role === "admin" && (
            <Link href="/admin">
              <MenuItem setActive={setActive} active={active} item="Admin Dashboard" />
            </Link>
          )}
        </Menu>
      </div>

      {/* Top-right Auth Section */}
      <div className="fixed top-10 right-10 z-50 flex items-center gap-4">
        {isLoggedIn ? (
          <>
            {/* 🧑 Username */}
            <span className="text-white font-medium">
              👋 {username}{" "}
              <span className="ml-2 text-xs bg-gray-700 px-2 py-1 rounded-full">
                {role === "admin" ? "🛡 Admin" : "🎓 Student"}
              </span>
            </span>

            {/* 🔓 Logout */}
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded font-semibold shadow hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/auth">
            <button className="bg-white text-black px-4 py-2 rounded font-semibold shadow hover:bg-gray-200 transition">
              Login / Register
            </button>
          </Link>
        )}
      </div>
    </>
  );
}

export default Navbar;
