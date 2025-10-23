// routes/wallet.js (WITH DEBUG LOGS)

import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

// ===================================================================
// ✅ GET ALL WALLET DATA
// ===================================================================
router.get("/wallet", async (req, res) => {
  console.log("\n=========================================");
  console.log("🚀 GET /api/wallet HIT 🚀");
  
  const { userId } = req.query;
  console.log("Query Params:", { userId });

  if (!userId) {
    console.log("🔴 Validation Failed: User ID is required.");
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    console.log("Attempting to fetch cards for user...");
    const { data: cards, error } = await supabase
      .from("card")
      .select(
        "card_id, nfc_uid, total_limit, food_limit, travel_limit, shopping_limit"
      )
      .eq("user_id", userId)
      .eq("status", "active");

    if (error) {
      console.error("🔴 SUPABASE FETCH ERROR (GET /wallet):", error);
      throw error;
    }

    console.log(`Found ${cards.length} cards for this user.`);

    const walletData = cards.map((card) => ({
      card_id: card.card_id,
      uid: card.nfc_uid,
      totalLimit: card.total_limit,
      categories: [
        { category_id: "food", name: "Food", limit: card.food_limit, spent: 0 },
        { category_id: "travel", name: "Travel", limit: card.travel_limit, spent: 0 },
        { category_id: "shopping", name: "Shopping", limit: card.shopping_limit, spent: 0 },
      ],
    }));

    console.log("✅ Successfully fetched wallet data.");
    res.status(200).json(walletData);

  } catch (err) {
    console.error("🔥 CATCH BLOCK ERROR (GET /wallet):", err.message);
    res.status(500).json({ message: "Failed to retrieve wallet data." });
  }
});

// ===================================================================
// ✅ UPDATE TOTAL LIMIT
// ===================================================================
router.put("/wallet/total-limit", async (req, res) => {
  console.log("\n=========================================");
  console.log("🚀 PUT /api/wallet/total-limit HIT 🚀");
  
  const { userId, cardId, newTotalLimit } = req.body;
  console.log("Request Body:", { userId, cardId, newTotalLimit });

  if (typeof newTotalLimit !== 'number' || newTotalLimit < 0) {
    console.log("🔴 Validation Failed: Invalid total limit amount.");
    return res.status(400).json({ message: "Invalid total limit amount." });
  }
  
  try {
    // --- QUERY 1: Check existing limits ---
    console.log("Query 1: Checking card ownership and existing limits...");
    const { data: cardData, error: fetchError } = await supabase
      .from("card")
      .select("food_limit, travel_limit, shopping_limit")
      .eq("card_id", cardId)
      .eq("user_id", userId)
      .single();

    if (fetchError || !cardData) {
      console.error("🔴 QUERY 1 FAILED: Card not found or user mismatch.", { 
        message: "Supabase error (if any) shown below:", 
        fetchError 
      });
      return res.status(404).json({ message: "Card not found or user mismatch." });
    }
    console.log("Query 1 Success. Found card:", cardData);

    const totalAllocated = cardData.food_limit + cardData.travel_limit + cardData.shopping_limit;
    console.log(`Validation: newTotalLimit (${newTotalLimit}) vs totalAllocated (${totalAllocated})`);

    if (newTotalLimit < totalAllocated) {
      console.log("🔴 Validation Failed: New limit is less than allocated.");
      return res.status(400).json({
        message: `New total limit (₹${newTotalLimit}) cannot be less than already allocated (₹${totalAllocated}).`
      });
    }

    // --- QUERY 2: Update the card ---
    const { error } = await supabase
  .from("card")
  .update({ total_limit: newTotalLimit })
  .eq("card_id", cardId)
  .eq("user_id", userId);

if (error) {
  console.error("🔴 QUERY 2 FAILED (UPDATE):", error);
  throw error;
}

console.log("✅ Successfully updated total limit.");
res.status(200).json({ message: "Total limit updated successfully." });


    console.log("✅ Successfully updated total limit.");
    res.status(200).json({ message: "Total limit updated successfully." });

  } catch (err) {
    console.error("🔥 CATCH BLOCK ERROR (PUT /total-limit):", err.message);
    res.status(500).json({ message: "Failed to update total limit on the server." });
  }
});

// ===================================================================
// ✅ UPDATE CATEGORY LIMIT
// ===================================================================
router.put("/wallet/limit", async (req, res) => {
  console.log("\n=========================================");
  console.log("🚀 PUT /api/wallet/limit HIT 🚀");
  
  const { userId, cardId, categoryId, newLimit } = req.body;
  console.log("Request Body:", { userId, cardId, categoryId, newLimit });

  const columnToUpdate = {
    food: "food_limit",
    travel: "travel_limit",
    shopping: "shopping_limit",
  }[categoryId];

  console.log("Mapped column to update:", columnToUpdate);

  if (!columnToUpdate) {
    console.log("🔴 Validation Failed: Invalid category ID.");
    return res.status(400).json({ message: "Invalid category ID." });
  }
  
  if (typeof newLimit !== 'number' || newLimit < 0) {
    console.log("🔴 Validation Failed: Invalid limit amount.");
    return res.status(400).json({ message: "Invalid limit amount." });
  }

  try {
    // --- QUERY 1: Check existing limits ---
    console.log("Query 1: Checking card ownership and existing limits...");
    const { data: cardData, error: fetchError } = await supabase
      .from("card")
      .select("total_limit, food_limit, travel_limit, shopping_limit")
      .eq("card_id", cardId)
      .eq("user_id", userId)
      .single();

    if (fetchError || !cardData) {
      console.error("🔴 QUERY 1 FAILED: Card not found or user mismatch.", {
        message: "Supabase error (if any) shown below:",
        fetchError
      });
      return res.status(404).json({ message: "Card not found or user mismatch." });
    }
    console.log("Query 1 Success. Found card:", cardData);

    let otherLimits = 0;
    if (categoryId !== 'food') otherLimits += cardData.food_limit;
    if (categoryId !== 'travel') otherLimits += cardData.travel_limit;
    if (categoryId !== 'shopping') otherLimits += cardData.shopping_limit;

    const newTotalAllocated = otherLimits + newLimit;
    console.log(`Validation: newTotalAllocated (${newTotalAllocated}) vs total_limit (${cardData.total_limit})`);

    if (newTotalAllocated > cardData.total_limit) {
      console.log("🔴 Validation Failed: New total allocated exceeds card total limit.");
      return res.status(400).json({
        message: `Total category limits (₹${newTotalAllocated}) cannot exceed the card's total limit (₹${cardData.total_limit}).`
      });
    }
    
    // --- QUERY 2: Update the card ---
    console.log(`Query 2: Attempting to update ${columnToUpdate}...`);
    const { data, error } = await supabase
      .from("card")
      .update({ [columnToUpdate]: newLimit })
      .eq("card_id", cardId)
      .eq("user_id", userId)
      .select();
      
    if (error) {
      console.error("🔴 QUERY 2 FAILED (UPDATE):", {
        message: "Supabase error (if any) shown below:",
        error
      });
      throw error;
    }

    if (!data || data.length === 0) {
      console.error("🔴 QUERY 2 FAILED: Update returned no data.");
      return res.status(404).json({ message: "Card not found or user mismatch." });
    }

    console.log("✅ Successfully updated category limit.");
    res.status(200).json({ message: "Category limit updated." });

  } catch (err) {
    console.error("🔥 CATCH BLOCK ERROR (PUT /limit):", err.message);
    res.status(500).json({ message: "Failed to update category limit on the server." });
  }
});


export default router;