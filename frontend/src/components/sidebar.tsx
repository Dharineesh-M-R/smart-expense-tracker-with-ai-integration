"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Home, List, PieChart, TrendingUp, Wallet, Bell,
  Settings, HelpCircle, LogOut
} from "lucide-react";

export default function Sidebar() {
  const [active, setActive] = useState("");
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
    { name: "Transactions", icon: <List size={20} />, path: "/transactions" },
    {
      name: "Budget & Insights",
      icon: <TrendingUp size={20} />,
      path: "/budget",
    },
    {
      name: "Reports & Analytics",
      icon: <PieChart size={20} />,
      path: "/reports",
    },
    { name: "Wallets", icon: <Wallet size={20} />, path: "/wallets" },
    { name: "Notifications", icon: <Bell size={20} />, path: "/notifications" },
    { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
    { name: "Help and Support", icon: <HelpCircle size={20} />, path: "/help" },
    { name: "Logout", icon: <LogOut size={20} />, action: handleLogout },
  ];
  return (
    <aside className="w-64 bg-gradient-to-b from-yellow-400 to-yellow-600 text-white shadow-lg flex flex-col">
      <div className="p-5 text-2xl font-bold border-b border-yellow-300">
        Smart Expense Tracker
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`flex items-center px-5 py-3 cursor-pointer hover:bg-yellow-500 ${
                active === item.name ? "bg-yellow-700" : ""
              }`}
              onClick={() => {
                setActive(item.name);
                if (item.action) item.action();
                else if (item.path) router.push(item.path);
              }}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
