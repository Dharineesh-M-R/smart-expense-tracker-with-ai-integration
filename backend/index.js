// index.js (Updated)

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import signup from "./routes/signup.js";
import login from "./routes/login.js";
import dashboard from "./routes/dashboard.js";
import transactions from "./routes/transactions.js"; // From previous step
import budget from "./routes/budget.js"; // ✅ Import the new budget route
import wallet from "./routes/wallet.js"; // ✅ Import the new budget route

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Routes
app.use("/api", signup);
app.use("/api", login);
app.use("/api", dashboard);
app.use("/api", transactions); // From previous step
app.use("/api", budget); // ✅ Use the new budget route
app.use("/api", wallet); // ✅ Use the new budget route

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});