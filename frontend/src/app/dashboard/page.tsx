"use client";

import { useState } from "react";
import { Home, CreditCard, PiggyBank, Banknote, Wallet, Shield, BarChart3, ListTodo } from "lucide-react";

export default function Dashboard() {
  const [active, setActive] = useState("dashboard");

  const menu = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { id: "accounts", label: "Accounts", icon: <Banknote size={20} /> },
    { id: "deposits", label: "Deposits", icon: <PiggyBank size={20} /> },
    { id: "payments", label: "Payments", icon: <Wallet size={20} /> },
    { id: "loans", label: "Loans", icon: <CreditCard size={20} /> },
    { id: "investments", label: "Investments", icon: <BarChart3 size={20} /> },
    { id: "insurance", label: "Insurance", icon: <Shield size={20} /> },
    { id: "requests", label: "Track Requests", icon: <ListTodo size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-white text-gray-800">
      {/* Sidebar */}
      <div className="w-52 bg-gradient-to-b from-yellow-500 to-yellow-700 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-yellow-300">MyBank</div>
        <nav className="flex-1">
          {menu.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-yellow-600 transition 
                ${active === item.id ? "bg-yellow-800" : ""}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
          <div>
            <h1 className="text-xl font-semibold text-gray-700">Hi, Dharineesh</h1>
            <p className="text-sm text-gray-500">Last logged in: 25/08/2025 09:03 PM</p>
          </div>
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Search here..."
              className="border rounded-full px-4 py-1 text-sm outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-1 rounded-full">
              Logout
            </button>
          </div>
        </header>

        {/* Dashboard Cards */}
        <main className="p-6 grid grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 p-6 rounded-2xl shadow-md border">
            <h2 className="text-lg font-semibold text-yellow-800">ACCOUNTS</h2>
            <p className="text-sm text-gray-600 mt-1">Total Account Balance</p>
            <p className="text-2xl font-bold mt-3 text-gray-900">₹ 6,113.00</p>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-white p-6 rounded-2xl shadow-md border">
            <h2 className="text-lg font-semibold text-yellow-800">DEPOSITS</h2>
            <p className="text-sm text-gray-600 mt-1">Invest in safe and risk free FD</p>
            <button className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
              BOOK FD
            </button>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-white p-6 rounded-2xl shadow-md border">
            <h2 className="text-lg font-semibold text-yellow-800">CREDIT CARDS</h2>
            <p className="text-sm text-gray-600 mt-1">Apply for credit cards & benefits</p>
            <button className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
              APPLY NOW
            </button>
          </div>
        </main>

        {/* Pay Now Section */}
        <section className="p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">PAY NOW</h3>
          <div className="flex gap-6 items-center">
            <div className="flex flex-col items-center">
              <button className="w-14 h-14 rounded-full border-2 border-yellow-500 flex items-center justify-center text-yellow-600 text-2xl">
                +
              </button>
              <p className="text-sm mt-2 text-gray-700">Add New</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-yellow-200 flex items-center justify-center font-semibold text-gray-800">
                MA
              </div>
              <p className="text-sm mt-2 text-gray-700">Magudesh</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-yellow-200 flex items-center justify-center font-semibold text-gray-800">
                RG
              </div>
              <p className="text-sm mt-2 text-gray-700">Revathi</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
