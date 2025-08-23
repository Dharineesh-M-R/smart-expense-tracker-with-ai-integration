import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ---------------- ROUTES ----------------

// 1. Mock NFC Scan
app.get("/nfc-scan", (req, res) => {
  res.json({
    tagId: "1234567890ABCDEF",
    message: "Mock NFC tag scanned successfully"
  });
});

// 2. Transactions (GET all)
app.get("/transactions", (req, res) => {
  // In real app, fetch from DB
  res.json([
    { id: 1, description: "Groceries", amount: 250, date: "2025-08-14" },
    { id: 2, description: "Petrol", amount: 500, date: "2025-08-13" }
  ]);
});

// 3. Transactions (POST new)
app.post("/transactions", (req, res) => {
  const { description, amount } = req.body;
  res.status(201).json({
    message: "Transaction added successfully",
    transaction: { id: Date.now(), description, amount, date: new Date().toISOString() }
  });
});

// 4. Budgets (POST new budget limit)
app.post("/budgets", (req, res) => {
  const { category, limit } = req.body;
  res.status(201).json({
    message: "Budget set successfully",
    budget: { category, limit }
  });
});

// 5. AI Suggestions (mock data for now)
app.get("/ai-suggestions", (req, res) => {
  res.json({
    suggestion: "You spent ₹2,000 on dining this month. Consider reducing dining expenses by 20%."
  });
});

// ---------------- SERVER ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
