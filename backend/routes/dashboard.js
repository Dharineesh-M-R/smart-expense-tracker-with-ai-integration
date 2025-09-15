// backend/routes/expenses.js
import express from "express";
import { supabase } from "../supabase.js";

const router = express.Router();

// GET /api/expenses
router.get("/expenses", async (req, res) => {
  try {
    // Fetch data from Supabase table
    const { data, error } = await supabase
      .from("expenses")
      .select("*");

    if (error) throw error;

    res.json(data); // Send data to Next.js frontend
  } catch (err) {
    console.error("Error fetching expenses:", err.message);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

export default router;
