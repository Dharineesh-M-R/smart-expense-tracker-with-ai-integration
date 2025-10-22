// transactions/page.tsx (Updated)

"use client";

import { useState, useMemo, useEffect } from "react"; // ✅ Import useEffect
import { Filter, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Sidebar from "@/components/sidebar";
import axios from "axios"; // ✅ Import axios

// ✅ Updated Transaction type to match your database schema
type Transaction = {
  transaction_id: string;
  user_id: string;
  type: string;
  amount: number;
  category: string;
  description: string | null;
  payment_mod: string;
  created_at: string; // This was 'date'
};

// Define sortable keys for type safety
type SortKey = keyof Transaction;

export default function TransactionsPage() {
  // ✅ Initialize with an empty array
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  // ✅ Add loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({ date: "", category: "", amount: "" });
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "asc" | "desc";
    // ✅ Update default sort key to match new type
  }>({ key: "created_at", direction: "desc" });

  // ✅ Add useEffect to fetch data on mount
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setError("You must be logged in to view transactions.");
        setLoading(false);
        return;
      }

      try {
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await axios.get(`${API_URL}/api/transactions/${userId}`);
        setTransactions(res.data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []); // Empty dependency array means this runs once on mount

  // Memoized logic for filtering and sorting
  const processedTransactions = useMemo(() => {
    let filtered = transactions.filter(
      (t) =>
        // ✅ Filter by created_at (string includes)
        (!filters.date || t.created_at.includes(filters.date)) &&
        (!filters.category ||
          t.category.toLowerCase().includes(filters.category.toLowerCase())) &&
        (!filters.amount || t.amount.toString().includes(filters.amount))
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // Handle null values (for description, etc.)
        if (aValue === null) return 1;
        if (bValue === null) return -1;

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [transactions, filters, sortConfig]);

  const handleSort = (key: SortKey) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <Card className="shadow-lg border border-yellow-400">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-yellow-600">
              Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters and Sort */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <Input
                placeholder="Filter by date (YYYY-MM-DD)" // ✅ Updated placeholder
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                className="border-yellow-400 focus:ring-yellow-500 max-w-xs"
              />
              <Input
                placeholder="Filter by category"
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                className="border-yellow-400 focus:ring-yellow-500 max-w-xs"
              />
              <Input
                placeholder="Filter by amount"
                value={filters.amount}
                onChange={(e) =>
                  setFilters({ ...filters, amount: e.target.value })
                }
                className="border-yellow-400 focus:ring-yellow-500 max-w-xs"
              />
            </div>

            {/* ✅ Table with Loading/Error/No Data states */}
            {loading && <p className="text-center">Loading transactions...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {!loading &&
              !error &&
              processedTransactions.length === 0 && (
                <p className="text-center text-gray-500">
                  No transactions found.
                </p>
              )}

            {!loading && !error && processedTransactions.length > 0 && (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-yellow-100 text-yellow-700 text-left">
                    <th
                      className="p-2 border-b border-yellow-300 cursor-pointer"
                      onClick={() => handleSort("created_at")} // ✅ Sort by created_at
                    >
                      Date{" "}
                      {sortConfig.key === "created_at" && // ✅ Check created_at
                        (sortConfig.direction === "asc" ? (
                          <ArrowUp className="inline h-4 w-4" />
                        ) : (
                          <ArrowDown className="inline h-4 w-4" />
                        ))}
                    </th>
                    <th
                      className="p-2 border-b border-yellow-300 cursor-pointer"
                      onClick={() => handleSort("category")}
                    >
                      Category{" "}
                      {sortConfig.key === "category" &&
                        (sortConfig.direction === "asc" ? (
                          <ArrowUp className="inline h-4 w-4" />
                        ) : (
                          <ArrowDown className="inline h-4 w-4" />
                        ))}
                    </th>
                    <th
                      className="p-2 border-b border-yellow-300 cursor-pointer"
                      onClick={() => handleSort("amount")}
                    >
                      Amount{" "}
                      {sortConfig.key === "amount" &&
                        (sortConfig.direction === "asc" ? (
                          <ArrowUp className="inline h-4 w-4" />
                        ) : (
                          <ArrowDown className="inline h-4 w-4" />
                        ))}
                    </th>
                    {/* You can add more columns here if needed */}
                    {/*
                    <th className="p-2 border-b border-yellow-300">Description</th>
                    <th className="p-2 border-b border-yellow-300">Payment Method</th>
                    */}
                  </tr>
                </thead>
                <tbody>
                  {processedTransactions.map((t) => (
                    <tr
                      key={t.transaction_id} // ✅ Use transaction_id as key
                      className="hover:bg-yellow-50"
                    >
                      <td className="p-2 border-b">
                        {/* ✅ Format date for display */}
                        {new Date(t.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-2 border-b">{t.category}</td>
                      <td className="p-2 border-b">₹{t.amount.toFixed(2)}</td>
                      {/*
                      <td className="p-2 border-b">{t.description}</td>
                      <td className="p-2 border-b">{t.payment_mod}</td>
                      */}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}