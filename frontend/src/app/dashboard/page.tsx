"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
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

// Define transaction type
interface Transaction {
  id: number;
  date: string;
  category: string;
  amount: number;
  nfcId: string;
}

export default function Dashboard() {
  const [active, setActive] = useState("Dashboard");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const router = useRouter();

  // Fetch transactions when component loads
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get<Transaction[]>("http://localhost:5000/api/dashboard");
      setTransactions(res.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Simulate NFC Tap for testing
  const simulateNfcTap = async () => {
    try {
      const newTransaction = {
        category: "Food",
        amount: 250,
        nfcId: "#A123",
      };
      await axios.post("http://localhost:5000/api/dashboard", newTransaction);
      fetchTransactions();
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

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
        {/* Quick Stats */}
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
            <p className="text-2xl font-bold text-yellow-700">{transactions.length}</p>
          </div>
          <div className="bg-yellow-100 p-5 rounded-2xl shadow text-center">
            <h2 className="text-lg font-semibold">Upcoming Bills</h2>
            <p className="text-2xl font-bold text-yellow-700">₹ 2,450</p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white border p-5 rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
            <button
              className="bg-yellow-500 text-white px-3 py-1 rounded mb-3"
              onClick={simulateNfcTap}
            >
              Simulate NFC Tap
            </button>
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
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="p-2">{tx.date}</td>
                    <td className="p-2">{tx.category}</td>
                    <td className="p-2 text-red-600">- ₹{tx.amount}</td>
                    <td className="p-2">{tx.nfcId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* AI Insights */}
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
