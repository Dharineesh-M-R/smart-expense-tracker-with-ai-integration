import express from "express";
import {supabase} from "../supabaseClient.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const { data, error: insertError } = await supabase
      .from("users")
      .insert([{ name, email, password_hash: hashedPassword }]);
    if (insertError) {
      return res.status(400).json({ message: insertError.message });
    }
    res.status(200).json({ message: "User Registered Successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error!" });
  }
});

export default router;
