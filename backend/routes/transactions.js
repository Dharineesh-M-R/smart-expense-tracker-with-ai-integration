// routes/transactions.js

import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

// GET transactions for a specific user
router.get("/transactions/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Fetch transactions from the 'transactions' table
    // where the 'user_id' column matches the provided userId
    // Order by 'created_at' to show the newest first
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    // If no transactions are found, data will be an empty array []
    // This is fine, the frontend can handle it.
    return res.json(transactions);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
});

export default router;
