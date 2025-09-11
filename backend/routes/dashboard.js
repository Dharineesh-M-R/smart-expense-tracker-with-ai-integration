import express from "express";
const router = express.Router();

// Example Dashboard Data (replace with DB logic later)
const transactions = [
  { id: 1, date: "2025-09-11 10:30 AM", category: "Food", amount: 250, nfcId: "#A123" },
  { id: 2, date: "2025-09-11 11:00 AM", category: "Travel", amount: 600, nfcId: "#B981" },
];

// Get all transactions
router.get("/dashboard", (req, res) => {
  res.json(transactions);
});

// Add new transaction (from ESP32 or frontend)
router.post("/dashboard", (req, res) => {
  const { category, amount, nfcId } = req.body;
  const date = new Date().toLocaleString(); // Auto timestamp
  const newTransaction = {
    id: transactions.length + 1,
    date,
    category,
    amount,
    nfcId,
  };
  transactions.push(newTransaction);
  console.log("New Transaction:", newTransaction);
  res.json({ success: true, transaction: newTransaction });
});

export default router;
