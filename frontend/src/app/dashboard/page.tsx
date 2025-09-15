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

interface Transaction {
  expense_id: string;
  created_at: string;
  amount: number;
  category_id: number;
  description: string;
}
  

export default function Dashboard() {
  const [active, setActive] = useState("Dashboard");
  const [totalBalance, setTotalBalance] = useState(0);
  const [spentThisMonth, setSpentThisMonth] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/dashboard");
      setTotalBalance(res.data.total_balance);
      setSpentThisMonth(res.data.spent_this_month);
      setTransactionCount(res.data.transaction_count);
      setTransactions(res.data.recent_transactions);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
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

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-yellow-100 p-5 rounded-2xl shadow text-center">
            <h2 className="text-lg font-semibold">Total Balance</h2>
            <p className="text-2xl font-bold text-yellow-700">₹ {totalBalance}</p>
          </div>
          <div className="bg-yellow-100 p-5 rounded-2xl shadow text-center">
            <h2 className="text-lg font-semibold">Spent This Month</h2>
            <p className="text-2xl font-bold text-yellow-700">₹ {spentThisMonth}</p>
          </div>
          <div className="bg-yellow-100 p-5 rounded-2xl shadow text-center">
            <h2 className="text-lg font-semibold">Transactions</h2>
            <p className="text-2xl font-bold text-yellow-700">{transactionCount}</p>
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
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Date</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Description</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.expense_id}>
                    <td className="p-2">{new Date(tx.created_at).toLocaleString()}</td>
                    <td className="p-2">{tx.category_id}</td>
                    <td className="p-2 text-red-600">- ₹{tx.amount}</td>
                    <td className="p-2">{tx.description || "-"}</td>
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
