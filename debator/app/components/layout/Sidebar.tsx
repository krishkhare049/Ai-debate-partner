"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  History,
  User,
  CreditCard,
  LogOut,
  Menu,
  Sun,
  Moon,
  ChevronLeft,
  Telescope,
  SmilePlus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Sidebar() {
  const logout = useAuthStore((s) => s.logout);

  const user = useAuthStore((s) => s.user);

  const router = useRouter();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [dark, setDark] = useState(true);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const menu = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Explore", href: "/explore", icon: Telescope },
    { name: "Start Debate", href: "/debate", icon: MessageSquare },
    { name: "Leaderboard", href: "/leaderboard", icon: SmilePlus },
    { name: "History", href: "/history", icon: History },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Subscription", href: "/subscription", icon: CreditCard },
  ];

  const SidebarContent = (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      className="h-screen bg-gradient-to-b from-black to-gray-900 text-white flex flex-col p-4 shadow-2xl"
    >
      {/* Top */}
      <div className="flex items-center justify-between mb-8">
        {!collapsed && (
          <div>
            <h2 className="text-xl font-bold">Debator 🧠🔥</h2>
            <p className="text-xs text-gray-400">AI Debate Partner</p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded hover:bg-gray-800"
        >
          <ChevronLeft
            className={`transition ${collapsed ? "rotate-180" : ""}`}
            size={18}
          />
        </button>
      </div>

      {/* User */}
      <div className="flex items-center gap-3 mb-8 bg-white/10 p-3 rounded-lg">
       <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
  {user?.avatar ? (
    <Image
      src={user.avatar}
      alt="User"
      width={40}
      height={40}
      className="object-cover w-full h-full"
    />
  ) : (
    <span className="text-sm font-semibold">
      {user?.name?.charAt(0)}
    </span>
  )}
</div>
        {!collapsed && (
          <div>
            <p className="text-sm font-medium">{user?.name}</p>
            {/* <p className="text-xs text-gray-400">Premium</p> */}
            <span className="text-xs bg-white text-black px-2 py-1 rounded">
              {user?.plan?.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-2 flex-1">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition
                ${
                  active
                    ? "bg-white text-black font-medium"
                    : "hover:bg-gray-800 text-gray-300"
                }`}
            >
              <Icon size={18} />
              {!collapsed && item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="flex flex-col gap-3 mt-auto">
        {/* Theme Toggle */}
        <button
          onClick={() => setDark(!dark)}
          className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-800"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
          {!collapsed && "Toggle Theme"}
        </button>

        {/* Logout */}
        <button
          onClick={() => setConfirmLogout(true)}
          className="flex items-center gap-3 px-3 py-3 rounded-lg bg-white text-black hover:scale-105 transition"
        >
          <LogOut size={18} />
          {!collapsed && "Logout"}
        </button>
      </div>
    </motion.aside>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden p-3 bg-black text-white flex justify-between">
        <button onClick={() => setMobileOpen(true)}>
          <Menu />
        </button>
        <span className="font-bold">Debator</span>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">{SidebarContent}</div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed inset-0 z-50 flex"
          >
            {SidebarContent}
            <div
              className="flex-1 bg-black/50"
              onClick={() => setMobileOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {confirmLogout && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-xl w-80"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h3 className="text-lg font-semibold mb-2">Confirm Logout</h3>

              <p className="text-gray-600 mb-6">
                Are you sure you want to logout?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmLogout(false)}
                  className="px-4 py-2 rounded border"
                >
                  Cancel
                </button>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded bg-black text-white"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
