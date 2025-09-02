"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // <-- FIX ✅

// ------------------ Types ------------------
type Expense = {
  date: string;
  category: string;
  amount: number;
};

export default function ReportsExportPage() {
  const [expenses] = useState<Expense[]>([
    { date: "2025-09-01", category: "Food", amount: 250 },
    { date: "2025-09-02", category: "Travel", amount: 120 },
    { date: "2025-09-03", category: "Bills", amount: 800 },
    { date: "2025-09-04", category: "Shopping", amount: 400 },
    { date: "2025-09-05", category: "Food", amount: 300 },
  ]);

  const getTotal = (data: Expense[]): number =>
    data.reduce((acc, e) => acc + e.amount, 0);

  const exportCSV = (): void => {
    const headers = ["Date,Category,Amount"];
    const rows = expenses.map((e) => `${e.date},${e.category},${e.amount}`);
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "expense_report.csv");
  };

  const exportPDF = (): void => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Expense Report", 14, 20);

    // ✅ Correct usage
    autoTable(doc, {
      startY: 30,
      head: [["Date", "Category", "Amount"]],
      body: expenses.map((e) => [e.date, e.category, `₹${e.amount}`]),
    });

    doc.save("expense_report.pdf");
  };

  const categorySummary = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <h1 className="text-3xl font-bold mb-6 text-yellow-600">📑 Reports & Export</h1>

      <div className="flex gap-4 mb-6">
        <Button
          className="bg-yellow-600 hover:bg-yellow-700 text-white"
          onClick={exportCSV}
        >
          Download CSV
        </Button>
        <Button
          className="bg-yellow-600 hover:bg-yellow-700 text-white"
          onClick={exportPDF}
        >
          Download PDF
        </Button>
      </div>

      {/* Monthly Summary */}
      <Card className="mb-6 border-yellow-600 shadow-md">
        <CardHeader>
          <CardTitle className="text-yellow-600">📆 Monthly Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-yellow-600 text-white">
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2">{e.date}</td>
                  <td className="p-2">{e.category}</td>
                  <td className="p-2 text-yellow-700 font-semibold">₹{e.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 font-bold text-yellow-700">
            Total: ₹{getTotal(expenses)}
          </p>
        </CardContent>
      </Card>

      {/* Category Summary */}
      <Card className="border-yellow-600 shadow-md">
        <CardHeader>
          <CardTitle className="text-yellow-600">📊 Category-wise Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-yellow-600 text-white">
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(categorySummary).map(([cat, amt], i) => (
                <tr key={i} className="border-b">
                  <td className="p-2">{cat}</td>
                  <td className="p-2 text-yellow-700 font-semibold">₹{amt}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 font-bold text-yellow-700">
            Overall Spent: ₹{getTotal(expenses)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
