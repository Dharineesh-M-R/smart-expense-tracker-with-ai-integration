import express from "express";
import { supabase } from "../supabaseClient.js"; // adjust path if needed

const router = express.Router();

/**
 * 🧠 GET /api/wallet/:userId
 * Fetch all cards, categories, and limits for a specific user.
 * Calls the `get_user_wallet` SQL function in Supabase.
 */
router.get("/wallet/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // This RPC function internally handles fetching data
    // related to the p_user_id, which matches your users.id
    const { data, error } = await supabase.rpc("get_user_wallet", {
      p_user_id: userId,
    });

    if (error) {
      console.error("Supabase RPC error:", error.message);
      return res.status(500).json({ message: error.message });
    }

    // Convert snake_case → camelCase
    const formattedData = data.map((row) => ({
      ...row,
      totalLimit: row.total_limit,
      total_limit: undefined,
    }));

    res.json(formattedData);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

/**
 * 💰 PUT /api/wallet/limit
 * Update a category limit for a specific user and card.
 */
router.put("/wallet/limit", async (req, res) => {
  const { userId, cardId, categoryId, newLimit } = req.body;

  // 🧩 Validate input
  if (!userId || !cardId || !categoryId || newLimit === undefined) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const newLimitNum = Number(newLimit);
  if (isNaN(newLimitNum) || newLimitNum < 0) {
    return res.status(400).json({
      message: "Please enter a valid positive number.",
    });
  }

  try {
    // ⚙️ CASE-SENSITIVE TABLE: use "Limit" (quoted)
    const tableName = '"Limit"';

    // 1️⃣ Fetch the total card limit
    // This correctly queries card.user_id using the userId from the body
    const { data: cardData, error: cardError } = await supabase
      .from("card")
      .select("total_limit")
      .eq("user_id", userId) // Matches card.user_id
      .eq("card_id", cardId)
      .single();

    if (cardError || !cardData) {
      return res.status(404).json({ message: "Card not found." });
    }

    const totalLimit = Number(cardData.total_limit);

    // 2️⃣ Fetch all category limits for this card (to check total)
    // This correctly queries Limit.user_id
    const { data: existingLimits, error: fetchError } = await supabase
      .from(tableName)
      .select("category_id, limit")
      .eq("user_id", userId) // Matches Limit.user_id
      .eq("card_id", cardId);

    if (fetchError) throw fetchError;

    // Calculate total after updating
    const otherLimitsSum = existingLimits
      .filter((l) => l.category_id !== categoryId)
      .reduce((sum, l) => sum + Number(l.limit), 0);

    const totalAfterUpdate = otherLimitsSum + newLimitNum;
    if (totalAfterUpdate > totalLimit) {
      return res.status(400).json({
        message: `Total category limits (₹${totalAfterUpdate}) cannot exceed card total limit (₹${totalLimit}).`,
      });
    }

    // 3️⃣ Update the limit
    // This correctly updates the Limit table based on its user_id
    const { data: updatedData, error: updateError } = await supabase
      .from(tableName)
      .update({ limit: newLimitNum })
      .eq("user_id", userId) // Matches Limit.user_id
      .eq("card_id", cardId)
      .eq("category_id", categoryId)
      .select();

    if (updateError) throw updateError;

    if (!updatedData || updatedData.length === 0) {
      return res.status(404).json({ message: "Limit entry not found to update." });
    }

    res.json({
      message: "Limit updated successfully.",
      limit: updatedData[0],
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

export default router;