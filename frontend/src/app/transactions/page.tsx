"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Filter } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// ✅ Types
type Transaction = {
  id: number;
  date: string;
  category: string;
  amount: number;
};

type TransactionForm = {
  date: string;
  category: string;
  amount: string; // keep as string for input
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, date: "2025-09-01", category: "Food", amount: 250 },
    { id: 2, date: "2025-09-02", category: "Travel", amount: 100 },
    { id: 3, date: "2025-09-02", category: "Shopping", amount: 500 },
  ]);

  const [filters, setFilters] = useState({ date: "", category: "", amount: "" });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [form, setForm] = useState<TransactionForm>({
    date: "",
    category: "",
    amount: "",
  });

  // Filter logic
  const filtered = transactions.filter(
    (t) =>
      (!filters.date || t.date.includes(filters.date)) &&
      (!filters.category ||
        t.category.toLowerCase().includes(filters.category.toLowerCase())) &&
      (!filters.amount || t.amount.toString().includes(filters.amount))
  );

  // Add or edit transaction
  const saveTransaction = () => {
    if (editing) {
      setTransactions(
        transactions.map((t) =>
          t.id === editing.id
            ? { ...t, ...form, amount: Number(form.amount) }
            : t
        )
      );
    } else {
      setTransactions([
        ...transactions,
        { id: Date.now(), ...form, amount: Number(form.amount) },
      ]);
    }
    setForm({ date: "", category: "", amount: "" });
    setEditing(null);
    setOpen(false);
  };

  // Delete transaction
  const deleteTransaction = (id: number) =>
    setTransactions(transactions.filter((t) => t.id !== id));

  return (
    <div className="p-6 bg-white min-h-screen">
      <Card className="shadow-lg border border-yellow-400">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-yellow-600">
            Transactions
          </CardTitle>
          <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl"
            onClick={() => setOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Transaction
          </Button>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Filter by date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="border-yellow-400 focus:ring-yellow-500"
            />
            <Input
              placeholder="Filter by category"
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
              className="border-yellow-400 focus:ring-yellow-500"
            />
            <Input
              placeholder="Filter by amount"
              value={filters.amount}
              onChange={(e) => setFilters({ ...filters, amount: e.target.value })}
              className="border-yellow-400 focus:ring-yellow-500"
            />
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
              <Filter className="mr-2 h-4 w-4" /> Apply
            </Button>
          </div>

          {/* Table */}
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-yellow-100 text-yellow-700 text-left">
                <th className="p-2 border-b border-yellow-300">Date</th>
                <th className="p-2 border-b border-yellow-300">Category</th>
                <th className="p-2 border-b border-yellow-300">Amount</th>
                <th className="p-2 border-b border-yellow-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-yellow-50">
                  <td className="p-2 border-b">{t.date}</td>
                  <td className="p-2 border-b">{t.category}</td>
                  <td className="p-2 border-b">₹{t.amount}</td>
                  <td className="p-2 border-b flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-yellow-500 text-yellow-600 hover:bg-yellow-100"
                      onClick={() => {
                        setEditing(t);
                        setForm({
                          date: t.date,
                          category: t.category,
                          amount: t.amount.toString(),
                        });
                        setOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => deleteTransaction(t.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white rounded-xl border border-yellow-400">
          <DialogHeader>
            <DialogTitle className="text-yellow-600">
              {editing ? "Edit Transaction" : "Add Transaction"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="border-yellow-400"
            />
            <Input
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border-yellow-400"
            />
            <Input
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="border-yellow-400"
            />
          </div>
          <DialogFooter>
            <Button
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
              onClick={saveTransaction}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
