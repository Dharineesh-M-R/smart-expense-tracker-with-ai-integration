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
  expense_id: string;
  created_at: string;
  amount: number;
  category_id: number;
  description: string;
}

type UserDetail = {
  name: string;
  email: string;
};

export default function Dashboard() {
  const [active, setActive] = useState("Dashboard");
  const [totalBalance, setTotalBalance] = useState<number | undefined>();
  const [name, setName] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [dateTime, setDateTime] = useState<string>(""); // ✅ for dynamic date & time
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  // Fetch user details on mount
  useEffect(() => {
    fetchUserdetail();
  }, []);

  // Live updating date and time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setDateTime(now.toLocaleString()); // e.g., 9/24/2025, 2:30:45 PM
    };

    updateTime(); // run once immediately
    const interval = setInterval(updateTime, 1000); // update every second

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  const fetchUserdetail = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/userdetail");
      setName(res.data.name);
      setEmail(res.data.email);
      setTotalBalance(res.data.balance);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  return (
    <div className="flex h-screen bg-white text-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-yellow-100 p-5 rounded-2xl shadow text-center">
            <h2 className="text-lg font-semibold">Total Balance</h2>
            <p className="text-2xl font-bold text-yellow-700">
              ₹ {totalBalance}
            </p>
          </div>
          <div className="bg-yellow-100 p-5 rounded-2xl shadow text-center">
            <h2 className="text-lg font-semibold">Spent This Month</h2>
            <p className="text-2xl font-bold text-yellow-700">
              ₹ this month Spent
            </p>
          </div>
          <div className="bg-yellow-100 p-5 rounded-2xl shadow text-center">
            <h2 className="text-lg font-semibold">Transactions</h2>
            <p className="text-2xl font-bold text-yellow-700">
              transaction count
            </p>
          </div>
        </div>

        {/* Account Dropdown */}
        <div className="absolute top-0 right-0 m-4">
          <div className="bg-yellow-100 p-3 rounded-2xl shadow text-center">
            <DropdownMenu>
              <DropdownMenuTrigger>Account</DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div>
                  <DropdownMenuItem>{name}</DropdownMenuItem>
                  <DropdownMenuItem>{email}</DropdownMenuItem>
                  <DropdownMenuItem>{dateTime}</DropdownMenuItem> {/* ✅ live time */}
                </div>
                <DropdownMenuItem>
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Recent Transactions */}
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
                <tr>
                  <td>...</td>
                  <td>...</td>
                  <td>...</td>
                  <td>...</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* AI Insights */}
          <div className="bg-yellow-100 p-5 rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-3">AI Insights</h2>
            <p className="text-gray-700">
              ⚠ You are overspending on Food by{" "}
              <span className="font-bold">15%</span> this month.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
