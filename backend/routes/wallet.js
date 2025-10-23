import express from "express";
import { supabase } from "../supabaseClient.js"; // Ensure this path is correct

const router = express.Router();

/**
 * @route   GET /api/wallet
 * @desc    Get all wallet cards for a logged-in user
 * @access  Private (requires userId)
 */
router.get("/wallet", async (req, res) => {
  // Get the userId from the query parameters.
  // The frontend will send this from localStorage.
  const { userId } = req.query;

  if (!userId) {
    return res.status(401).json({ message: "User ID is required" });
  }

  try {
    // 1. Fetch all cards from the 'card' table that match the user_id
    const { data: cards, error: cardsError } = await supabase
      .from("card")
      .select("card_id, nfc_uid, total_limit") // Select only the fields you need
      .eq("user_id", userId);

    if (cardsError) throw cardsError;

    if (!cards || cards.length === 0) {
      return res.status(200).json([]); // No cards found, return an empty array
    }

    // 2. Map the data to match the frontend's 'NFCDevice' type
    //    - 'nfc_uid' from DB -> 'uid' in frontend
    //    - 'total_limit' from DB -> 'totalLimit' in frontend
    //
    // NOTE: Your 'card' table doesn't contain category information.
    // We are returning an empty 'categories' array for now.
    // Your frontend code will correctly render this as a card with no categories.
    // To add categories, you would need additional database tables.
    const walletData = cards.map((card) => ({
      card_id: card.card_id,
      uid: card.nfc_uid,
      totalLimit: card.total_limit,
      categories: [], // Sending empty array as category data isn't in 'card' table
    }));

    // 3. Send the formatted data back to the frontend
    res.status(200).json(walletData);

  } catch (error) {
    console.error("Error fetching wallet data:", error.message);
    res.status(500).json({ 
      message: "Error fetching wallet data", 
      error: error.message 
    });
  }
});

export default router;