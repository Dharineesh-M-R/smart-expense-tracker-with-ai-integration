"use client";

import { useState, useMemo } from "react";
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

// ✅ Types
type Transaction = {
  id: number;
  date: string;
  category: string;
  amount: number;
};

// Define sortable keys for type safety
type SortKey = keyof Transaction;

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, date: "2025-09-01", category: "Food", amount: 250 },
    { id: 2, date: "2025-09-02", category: "Travel", amount: 100 },
    { id: 3, date: "2025-09-02", category: "Shopping", amount: 500 },
    { id: 4, date: "2025-08-25", category: "Bills", amount: 1200 },
    { id: 5, date: "2025-09-05", category: "Food", amount: 150 },
  ]);

  const [filters, setFilters] = useState({ date: "", category: "", amount: "" });
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "asc" | "desc";
  }>({ key: "date", direction: "desc" });

  // Memoized logic for filtering and sorting
  const processedTransactions = useMemo(() => {
    let filtered = transactions.filter(
      (t) =>
        (!filters.date || t.date.includes(filters.date)) &&
        (!filters.category ||
          t.category.toLowerCase().includes(filters.category.toLowerCase())) &&
        (!filters.amount || t.amount.toString().includes(filters.amount))
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

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
                placeholder="Filter by date"
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

            {/* Table */}
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-yellow-100 text-yellow-700 text-left">
                  <th
                    className="p-2 border-b border-yellow-300 cursor-pointer"
                    onClick={() => handleSort("date")}
                  >
                    Date{" "}
                    {sortConfig.key === "date" &&
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
                </tr>
              </thead>
              <tbody>
                {processedTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-yellow-50">
                    <td className="p-2 border-b">{t.date}</td>
                    <td className="p-2 border-b">{t.category}</td>
                    <td className="p-2 border-b">₹{t.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}