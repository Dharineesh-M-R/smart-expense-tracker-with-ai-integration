import express from "express";
import cors from "cors";
import signup from "./routes/signup.js";
import login from "./routes/login.js";

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Routes
app.use("/api", signup);
app.use("/api", login);

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
