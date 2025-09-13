import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

// POST /api/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Supabase Login Error:", error);
      return res.status(400).json({ message: error.message });
    }

    return res.status(200).json({
      message: "Login successful",
      user: data.user,        // Auth user object
      session: data.session,  // Contains access_token
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
