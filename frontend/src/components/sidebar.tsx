"use client";
import { useRouter, usePathname } from "next/navigation"; // <--- 1. Import usePathname
// import { useState } from "react"; // <--- 2. Remove useState
import {
  Home, List, PieChart, TrendingUp, Wallet, Bell,
  Settings, HelpCircle, LogOut
} from "lucide-react";

export default function Sidebar() {
  // const [active, setActive] = useState(""); // <--- 3. Remove this state
  const router = useRouter();
  const pathname = usePathname(); // <--- 4. Get the current path

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
          {menuItems.map((item) => {
            // 5. Check if the current path starts with the item's path
            const isActive = item.path && pathname.startsWith(item.path);

            return (
              <li
                key={item.name}
                className={`flex items-center px-5 py-3 cursor-pointer hover:bg-yellow-500 ${
                  isActive ? "bg-yellow-700" : "" // <--- 6. Use the isActive variable here
                }`}
                onClick={() => {
                  // setActive(item.name); // <--- 7. Remove this
                  if (item.action) item.action();
                  else if (item.path) router.push(item.path);
                }}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}