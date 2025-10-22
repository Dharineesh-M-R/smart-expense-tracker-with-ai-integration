// routes/budget.js

import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

/**
 * Helper function to get the start of the week (Monday) for a given date.
 * This ensures transactions from the same week are grouped together.
 */
const getWeekStart = (dateStr) => {
  const date = new Date(dateStr);
  // getUTCDay() returns 0 for Sunday, 1 for Monday, etc.
  const day = date.getUTCDay();
  // Calculate difference to get to Monday
  // If it's Sunday (0), we subtract 6 days. If it's Monday (1), 0 days. If Tuesday (2), 1 day.
  const diff = date.getUTCDate() - day + (day === 0 ? -6 : 1);
  // Set the date to the Monday of that week
  const monday = new Date(date.setUTCDate(diff));
  // Return as a YYYY-MM-DD string
  return monday.toISOString().split("T")[0];
};

// GET budget insights for a specific user
router.get("/budget/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // 1. Fetch ALL 'expense' transactions for the user
    // We only select the columns we need
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("category, amount, created_at")
      .eq("user_id", userId)
      .eq("type", "expense"); // Only aggregate expenses

    if (error) {
      throw error;
    }

    if (!transactions || transactions.length === 0) {
      // Return empty arrays if no data
      return res.json({ categoryTotals: [], weeklyTotals: [] });
    }

    // 2. Process Category Totals (for all time)
    const categoryMap = new Map();
    for (const t of transactions) {
      const currentTotal = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, currentTotal + t.amount);
    }
    // Format for recharts: [{ name: 'Food', value: 2500 }]
    const categoryTotals = Array.from(categoryMap, ([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)), // Ensure value is a number
    }));

    // 3. Process Weekly Totals (for the last 4 weeks)
    const weeklyMap = new Map();
    // Get the date 4 weeks (28 days) ago
    const fourWeeksAgo = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000);

    for (const t of transactions) {
      const txDate = new Date(t.created_at);
      // Only include transactions from the last 4 weeks
      if (txDate >= fourWeeksAgo) {
        const weekStartDate = getWeekStart(t.created_at);
        const currentTotal = weeklyMap.get(weekStartDate) || 0;
        weeklyMap.set(weekStartDate, currentTotal + t.amount);
      }
    }

    // Sort the weekly data by date to get "Week 1", "Week 2", etc. in order
    const sortedWeeklyTotals = Array.from(weeklyMap.entries()).sort(
      (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
    );

    // Format for recharts: [{ week: 'Week 1', amount: 2200 }]
    const weeklyTotals = sortedWeeklyTotals.map(([_date, amount], index) => ({
      week: `Week ${index + 1}`, // Label as Week 1, Week 2...
      amount: parseFloat(amount.toFixed(2)),
    }));

    // 4. Send both data sets
    res.json({
      categoryTotals,
      weeklyTotals,
    });
  } catch (err) {
    console.error("Error fetching budget data:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
});

export default router;