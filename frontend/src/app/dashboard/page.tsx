"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  List,
  PieChart,
  TrendingUp,
  Wallet,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

export default function Dashboard() {
  const [active, setActive] = useState("Dashboard");
  const router = useRouter();

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  // Sidebar menu items
  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
    { name: "Transactions", icon: <List size={20} />, path: "/transactions" },
    { name: "Budget & Insights", icon: <TrendingUp size={20} />, path: "/budget" },
    { name: "Reports & Analytics", icon: <PieChart size={20} />, path: "/reports" },
    { name: "Wallets", icon: <Wallet size={20} />, path: "/wallets" },
    { name: "Notifications", icon: <Bell size={20} />, path: "/notifications" },
    { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
    { name: "Help and Support", icon: <HelpCircle size={20} />, path: "/help" },
    { name: "Logout", icon: <LogOut size={20} />, action: handleLogout },
  ];

  return (
    <div className="flex h-screen bg-white text-gray-900">
      {/* Sidebar */}
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
                  if (item.action) {
                    item.action();
                  } else if (item.path) {
                    router.push(item.path);
                  }
                }}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Top Section: Quick Stats */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-yellow-100 p-5 rounded-2xl shadow text-center">
            <h2 className="text-lg font-semibold">Total Balance</h2>
            <p className="text-2xl font-bold text-yellow-700">₹ 12,560</p>
          </div>
          <div className="bg-yellow-100 p-5 rounded-2xl shadow text-center">
            <h2 className="text-lg font-semibold">Spent This Month</h2>
            <p className="text-2xl font-bold text-yellow-700">₹ 8,320</p>
          </div>
          <div className="bg-yellow-100 p-5 rounded-2xl shadow text-center">
            <h2 className="text-lg font-semibold">Transactions</h2>
            <p className="text-2xl font-bold text-yellow-700">124</p>
          </div>
          <div className="bg-yellow-100 p-5 rounded-2xl shadow text-center">
            <h2 className="text-lg font-semibold">Upcoming Bills</h2>
            <p className="text-2xl font-bold text-yellow-700">₹ 2,450</p>
          </div>
        </div>

        {/* Middle Section: Graphs */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white border p-5 rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-4">Spending Overview</h2>
            <div className="h-56 flex items-center justify-center text-gray-400">
              [Pie Chart Placeholder]
            </div>
          </div>
          <div className="bg-white border p-5 rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-4">Expense Trend</h2>
            <div className="h-56 flex items-center justify-center text-gray-400">
              [Line/Bar Chart Placeholder]
            </div>
          </div>
        </div>

        {/* Bottom Section: Widgets */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white border p-5 rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Date</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">NFC ID</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2">30 Aug</td>
                  <td className="p-2">Food</td>
                  <td className="p-2 text-red-600">- ₹250</td>
                  <td className="p-2">#A123</td>
                </tr>
                <tr>
                  <td className="p-2">29 Aug</td>
                  <td className="p-2">Travel</td>
                  <td className="p-2 text-red-600">- ₹600</td>
                  <td className="p-2">#B981</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-yellow-100 p-5 rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-3">AI Insights</h2>
            <p className="text-gray-700">
              ⚠ You are overspending on Food by <span className="font-bold">15%</span> this month.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
