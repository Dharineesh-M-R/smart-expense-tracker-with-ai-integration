"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  // State for expenses
  const [expenses, setExpenses] = useState([
    { id: 1, amount: 200, category: "food", method: "upi", date: "2025-08-20" },
    { id: 2, amount: 500, category: "transport", method: "cash", date: "2025-08-21" },
  ]);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // Filters
  const [filterCategory, setFilterCategory] = useState("");
  const [filterMethod, setFilterMethod] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  // Handle Add Expense
  const handleAddExpense = () => {
    if (!amount || !category || !paymentMethod) return;
    const newExpense = {
      id: expenses.length + 1,
      amount: Number(amount),
      category,
      method: paymentMethod,
      date,
    };
    setExpenses([newExpense, ...expenses]);
    setAmount("");
    setCategory("");
    setPaymentMethod("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  // Apply Filters
  const filteredExpenses = expenses.filter((exp) => {
    const isCategoryOk = filterCategory ? exp.category === filterCategory : true;
    const isMethodOk = filterMethod ? exp.method === filterMethod : true;
    const isDateOk =
      (!filterFrom || new Date(exp.date) >= new Date(filterFrom)) &&
      (!filterTo || new Date(exp.date) <= new Date(filterTo));
    return isCategoryOk && isMethodOk && isDateOk;
  });

  // Charts Data
  const categoryData = Object.values(
    filteredExpenses.reduce((acc, exp) => {
      acc[exp.category] = acc[exp.category] || { name: exp.category, value: 0 };
      acc[exp.category].value += exp.amount;
      return acc;
    }, {} as Record<string, { name: string; value: number }>)
  );

  const methodData = Object.values(
    filteredExpenses.reduce((acc, exp) => {
      acc[exp.method] = acc[exp.method] || { name: exp.method, value: 0 };
      acc[exp.method].value += exp.amount;
      return acc;
    }, {} as Record<string, { name: string; value: number }>)
  );

  const COLORS = ["#FACC15", "#FDE68A", "#FBBF24", "#F59E0B", "#D97706"];

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-50 via-white to-yellow-100">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-yellow-300 bg-white/70 backdrop-blur-md sticky top-0 z-20">
        <h1 className="text-2xl font-bold text-yellow-600">💰 Smart Expense Tracker</h1>
        <nav className="flex gap-6 text-yellow-700 font-medium">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/add" className="hover:underline">Add Expense</Link>
          <Link href="/reports" className="hover:underline">Reports</Link>
          <Link href="/settings" className="hover:underline">Settings</Link>
        </nav>
        <Button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl shadow-md"
        >
          Logout
        </Button>
      </header>

      <main className="p-6 space-y-8">
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-2xl border-yellow-300 shadow-lg bg-white/90">
            <CardHeader><CardTitle>Total Expenses</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold text-yellow-600">
              ₹{filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)}
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-yellow-300 shadow-lg bg-white/90">
            <CardHeader><CardTitle>Top Category</CardTitle></CardHeader>
            <CardContent className="text-lg capitalize text-yellow-700">
              {categoryData.length > 0
                ? categoryData.reduce((a, b) => (a.value > b.value ? a : b)).name
                : "N/A"}
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-yellow-300 shadow-lg bg-white/90">
            <CardHeader><CardTitle>Average Daily Spend</CardTitle></CardHeader>
            <CardContent className="text-2xl font-semibold text-yellow-600">
              ₹
              {(
                filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0) /
                (new Set(filteredExpenses.map((exp) => exp.date)).size || 1)
              ).toFixed(2)}
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-2xl border-yellow-300 shadow-lg bg-white/90">
            <CardHeader><CardTitle>Expenses by Category</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={80} label>
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-yellow-300 shadow-lg bg-white/90">
            <CardHeader><CardTitle>Expenses by Payment Method</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={methodData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#FBBF24" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-yellow-300 shadow-lg bg-white/90">
            <CardHeader><CardTitle>Spending Trend</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={filteredExpenses}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#F59E0B" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Add Expense */}
        <Card className="rounded-2xl border-yellow-300 shadow-lg bg-white/90">
          <CardHeader><CardTitle>Add Expense (Simulated NFC)</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input type="number" placeholder="Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value)} />

            <Select onValueChange={setCategory} value={category}>
              <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="bills">Bills</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={setPaymentMethod} value={paymentMethod}>
              <SelectTrigger><SelectValue placeholder="Select Payment Method" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="wallet">Wallet</SelectItem>
              </SelectContent>
            </Select>

            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

            <Button onClick={handleAddExpense} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl shadow-md">
              Add Expense
            </Button>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="rounded-2xl border-yellow-300 shadow-lg bg-white/90">
          <CardHeader><CardTitle>Filters</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Input type="date" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} />
            <Input type="date" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} />
            <Select onValueChange={setFilterCategory} value={filterCategory}>
              <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="bills">Bills</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setFilterMethod} value={filterMethod}>
              <SelectTrigger><SelectValue placeholder="Payment Method" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="wallet">Wallet</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className="rounded-2xl border-yellow-300 shadow-lg bg-white/90">
          <CardHeader><CardTitle>Transactions</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full text-left border border-yellow-200 rounded-xl overflow-hidden">
              <thead className="bg-yellow-100 text-yellow-700">
                <tr>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Category</th>
                  <th className="p-2 border">Method</th>
                  <th className="p-2 border">Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-yellow-50 transition">
                    <td className="p-2 border">{exp.date}</td>
                    <td className="p-2 border capitalize">{exp.category}</td>
                    <td className="p-2 border capitalize">{exp.method}</td>
                    <td className="p-2 border font-semibold text-yellow-700">₹{exp.amount}</td>
                  </tr>
                ))}
                {filteredExpenses.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center p-3 text-gray-500">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
