// routes/signupRoute.js
import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

// POST /api/signup
router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // 1. Sign up user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,  // ✅ Fixed: use 'password'
    });

    if (authError) {
      return res.status(400).json({ message: authError.message });
    }

    // 2. Store extra user info in "users" table
    const { error: profileError } = await supabase.from("users").insert([
      {
        user_id: authData.user.id, // Same as Auth user ID
        name,
        email,
      },
    ]);

    if (profileError) {
      return res.status(400).json({ message: profileError.message });
    }

    return res.status(200).json({ message: "Signup successful!" });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
