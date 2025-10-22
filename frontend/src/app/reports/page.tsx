"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download } from "lucide-react";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Sidebar from "@/components/sidebar";
import axios from "axios";

// ------------------ Types ------------------
type Transaction = {
  transaction_id: string;
  user_id: string;
  type: string;
  amount: number;
  category: string;
  description: string | null;
  payment_mod: string;
  created_at: string;
};

export default function ReportsExportPage() {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ 1. Fetch all transactions on load and poll every second
  useEffect(() => {
    let isMounted = true;
    let timerId: NodeJS.Timeout;

    const fetchTransactions = async (isInitialLoad = false) => {
      // Only show the main "Loading..." message on the first load
      if (isInitialLoad) {
        setLoading(true);
        setError(null);
      }

      const userId = localStorage.getItem("userId");

      if (!userId) {
        if (isMounted) {
          setError("You must be logged in to view reports.");
          setLoading(false);
        }
        return; // Stop polling if user is logged out
      }

      try {
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await axios.get(`${API_URL}/api/transactions/${userId}`);
        
        if (isMounted) {
          setAllTransactions(res.data);
          // Clear any previous error on a successful refresh
          setError(null);
        }
      } catch (err: any) {
        console.error(err);
        if (isMounted) {
          setError(err.response?.data?.message || "Failed to fetch transactions");
        }
      } finally {
        if (isMounted) {
          if (isInitialLoad) {
            setLoading(false);
          }
          // ✅ Schedule the next fetch 1 second after this one completes
          timerId = setTimeout(() => fetchTransactions(false), 1000);
        }
      }
    };

    // Trigger the initial fetch
    fetchTransactions(true);

    // ✅ Cleanup function: runs when the component unmounts
    return () => {
      isMounted = false; // Prevent state updates on an unmounted component
      clearTimeout(timerId); // Stop the polling loop
    };
  }, []); // Empty dependency array means this runs once on mount

  // 2. Memoize calculations for expenses
  const expenses = useMemo(
    () => allTransactions.filter((t) => t.type === "expense"),
    [allTransactions]
  );

  const totalExpenses = useMemo(
    () => expenses.reduce((acc, e) => acc + e.amount, 0),
    [expenses]
  );

  const categorySummary = useMemo(
    () =>
      expenses.reduce<Record<string, number>>((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount;
        return acc;
      }, {}),
    [expenses]
  );

  // 3. Export functions now use the dynamic 'expenses' data
  const exportCSV = (): void => {
    const headers = ["Date,Category,Amount,Description"];
    const rows = expenses.map(
      (e) =>
        `${new Date(e.created_at).toLocaleDateString()},${e.category},${
          e.amount
        },${e.description || ""}`
    );
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "expense_report.csv");
  };

  const exportPDF = (): void => {
    const doc = new jsPDF();
    const formattedDate = new Date().toLocaleDateString();
    doc.setFontSize(16);
    doc.text("Expense Report", 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${formattedDate}`, 14, 25);

    autoTable(doc, {
      startY: 30,
      head: [["Date", "Category", "Amount", "Description"]],
      body: expenses.map((e) => [
        new Date(e.created_at).toLocaleDateString(),
        e.category,
        `₹${e.amount.toFixed(2)}`,
        e.description || "-",
      ]),
      foot: [
        [
          "Total",
          "",
          `₹${totalExpenses.toFixed(2)}`,
          "",
        ],
      ],
      footStyles: { fontStyle: "bold", fillColor: [255, 235, 153] }, // Yellow footer
    });

    doc.save("expense_report.pdf");
  };

  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;

  return (
    <div className="flex min-h-screen bg-white text-gray-800">
      <Sidebar />
      <main className="flex-1 p-6">
        {/* --- Optimized Page Header --- */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-yellow-600">
            📑 Reports & Export
          </h1>
          <div className="flex gap-4">
            <Button
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
              onClick={exportCSV}
              disabled={loading || expenses.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Download CSV
            </Button>
            <Button
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
              onClick={exportPDF}
              disabled={loading || expenses.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* --- Loading / Error / No Data States --- */}
        {loading && <p className="text-center">Loading reports...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && expenses.length === 0 && (
          <p className="text-center text-gray-500">
            No expense data found to generate a report.
          </p>
        )}

        {/* --- Optimized Grid Layout --- */}
        {!loading && !error && expenses.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card 1: Expense Log */}
            <Card className="border-yellow-600 shadow-md">
              <CardHeader>
                <CardTitle className="text-yellow-600">
                  📄 Expense Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((e) => (
                      <TableRow key={e.transaction_id}>
                        <TableCell>
                          {new Date(e.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{e.category}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(e.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={2} className="font-bold">
                        Total
                      </TableCell>
                      <TableCell className="text-right font-bold text-yellow-700">
                        {formatCurrency(totalExpenses)}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </CardContent>
            </Card>

            {/* Card 2: Category Summary */}
            <Card className="border-yellow-600 shadow-md">
              <CardHeader>
                <CardTitle className="text-yellow-600">
                  📊 Category-wise Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Total Spent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(categorySummary).map(([cat, amt]) => (
                      <TableRow key={cat}>
                        <TableCell>{cat}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(amt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell className="font-bold">Overall Spent</TableCell>
                      <TableCell className="text-right font-bold text-yellow-700">
                        {formatCurrency(totalExpenses)}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}