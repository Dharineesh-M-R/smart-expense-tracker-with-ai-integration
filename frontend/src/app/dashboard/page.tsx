"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";

interface Transaction {
  transaction_id: string;
  created_at: string;
  amount: number;
  category: string;
  description: string;
  type: 'expense' | 'income';
  payment_mod: string;
}

export default function Dashboard() {
  const [totalBalance, setTotalBalance] = useState<number | undefined>();
  const [name, setName] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [dateTime, setDateTime] = useState<string>("");
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState<number>(0);
  const [transactionCount, setTransactionCount] = useState<number>(0);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    router.push("/login");
  };

  const fetchUserdetail = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        router.push("/login");
        return;
      }
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await axios.get(`${API_URL}/api/userdetail?userId=${userId}`);
      setName(res.data.name);
      setEmail(res.data.email);
      setTotalBalance(res.data.balance);
    } catch (error: any) {
      console.error("Error fetching user details:", error.response?.data || error.message);
    }
  };

  const fetchtransaction = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await axios.get<Transaction[]>(`${API_URL}/api/transaction?userId=${userId}`);
      const transactions = res.data;
      const totalSpent = transactions.reduce((sum, transaction) => {
        if (transaction.type === 'expense') {
          return sum + transaction.amount;
        }
        return sum;
      }, 0);
      setCurrentMonthExpenses(totalSpent);
      setTransactionCount(transactions.length);
      setRecentTransactions(transactions.slice(0, 5));
    } catch (error: any) {
      console.error("Error fetching transactions:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchUserdetail();
    fetchtransaction();
    const interval = setInterval(() => {
      fetchUserdetail();
      fetchtransaction();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setDateTime(now.toLocaleString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500">Welcome back, {name || "..."}!</p>
          </div>
          <div className="bg-white p-2 rounded-full shadow-sm border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full">
                  Account
                  <span className="ml-2 text-xs">▼</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>{name || "Loading..."}</DropdownMenuItem>
                <DropdownMenuItem>{email || "Loading..."}</DropdownMenuItem>
                <DropdownMenuItem>{dateTime}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleLogout}>
                  <Button variant="outline" className="w-full">
                    Logout
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-5 rounded-xl shadow-md text-center border">
            <h2 className="text-lg font-semibold text-gray-600">Total Balance</h2>
            <p className="text-3xl font-bold text-blue-600 mt-1">₹{totalBalance?.toFixed(2) ?? '...'}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md text-center border">
            <h2 className="text-lg font-semibold text-gray-600">Spent This Month</h2>
            <p className="text-3xl font-bold text-red-500 mt-1">₹{currentMonthExpenses.toFixed(2)}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md text-center border">
            <h2 className="text-lg font-semibold text-gray-600">Transactions</h2>
            <p className="text-3xl font-bold text-gray-700 mt-1">{transactionCount}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border p-5 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="p-3 font-semibold text-sm">Date</th>
                    <th className="p-3 font-semibold text-sm">Time</th>
                    <th className="p-3 font-semibold text-sm">Category</th>
                    <th className="p-3 font-semibold text-sm">Amount</th>
                    <th className="p-3 font-semibold text-sm">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map((tx) => (
                      <tr key={tx.transaction_id} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="p-3">{new Date(tx.created_at).toLocaleDateString()}</td>
                        <td className="p-3">{new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                        <td className="p-3">{tx.category}</td>
                        <td className={`p-3 font-semibold ${tx.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                          {tx.type === 'expense' ? '-' : '+'}₹{tx.amount.toFixed(2)}
                        </td>
                        <td className="p-3 text-gray-600">{tx.description}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-gray-500">
                        No transactions this month.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-3 text-blue-800">AI Insights 💡</h2>
            <div className="bg-white/60 p-4 rounded-lg">
              <p className="text-gray-700">
                You are overspending on <span className="font-bold">Food</span> by{' '}
                <span className="font-bold text-red-600">15%</span> this month. Consider cooking at home to save more!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}