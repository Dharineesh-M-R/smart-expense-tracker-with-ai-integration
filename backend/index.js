import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import signup from "./routes/signup.js";
import login from "./routes/login.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Routes
app.use("/api", signup);
app.use("/api", login);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
