import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

// POST /api/signup
router.post("/signup", async (req, res) => {
  const { email, password, name, initialBalance } = req.body;

  try {
    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error("Auth error:", authError);
      return res.status(400).json({ message: authError.message });
    }

    // 2. Insert extra profile info into your "users" table
    const { error: profileError } = await supabase.from("users").insert([
      {
        user_id: authData.user.id, // same as Supabase Auth user ID
        name,
        email,
        balance: initialBalance || 0.00, // start with provided balance or default to 0
        // nfc_uid will be assigned later by admin
      },
    ]);

    if (profileError) {
      console.error("Profile insert error:", profileError);
      return res.status(400).json({ message: profileError.message });
    }

    return res.status(200).json({
      message: "Signup successful! Please wait for admin to assign NFC card.",
      user_id: authData.user.id,
      balance: initialBalance || 0.00,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
