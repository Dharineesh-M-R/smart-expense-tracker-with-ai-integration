// routes/wallet.js

import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

// ✅ GET ALL WALLET DATA
router.get("/wallet", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const { data: cards, error } = await supabase
      .from("card")
      .select(
        "card_id, nfc_uid, total_limit, food_limit, travel_limit, shopping_limit"
      )
      .eq("user_id", userId)
      .eq("status", "active");

    if (error) {
      throw error;
    }

    // A full implementation would query the 'transactions' table to sum 'spent'
    // For now, we return 0 as a placeholder.
    const walletData = cards.map((card) => ({
      card_id: card.card_id,
      uid: card.nfc_uid,
      totalLimit: card.total_limit,
      categories: [
        {
          category_id: "food",
          name: "Food",
          limit: card.food_limit,
          spent: 0, // Placeholder
        },
        {
          category_id: "travel",
          name: "Travel",
          limit: card.travel_limit,
          spent: 0, // Placeholder
        },
        {
          category_id: "shopping",
          name: "Shopping",
          limit: card.shopping_limit,
          spent: 0, // Placeholder
        },
      ],
    }));

    res.status(200).json(walletData);

  } catch (err) {
    console.error("Error fetching wallet data:", err.message);
    res.status(500).json({ message: "Failed to retrieve wallet data." });
  }
});

// ✅ UPDATE TOTAL LIMIT (This is the route that was failing)
router.put("/wallet/total-limit", async (req, res) => {
  const { userId, cardId, newTotalLimit } = req.body;

  if (typeof newTotalLimit !== 'number' || newTotalLimit < 0) {
    return res.status(400).json({ message: "Invalid total limit amount." });
  }
  
  try {
    // We must also check that the new total limit is not less than the sum
    // of existing category limits.
    const { data: cardData, error: fetchError } = await supabase
      .from("card")
      .select("food_limit, travel_limit, shopping_limit")
      .eq("card_id", cardId)
      .eq("user_id", userId)
      .single(); // Get a single row

    if (fetchError || !cardData) {
      return res.status(404).json({ message: "Card not found or user mismatch." });
    }

    const totalAllocated = cardData.food_limit + cardData.travel_limit + cardData.shopping_limit;

    if (newTotalLimit < totalAllocated) {
      return res.status(400).json({
        message: `New total limit (₹${newTotalLimit}) cannot be less than already allocated (₹${totalAllocated}).`
      });
    }

    // If validation passes, update the card
    const { data, error } = await supabase
      .from("card")
      .update({ total_limit: newTotalLimit })
      .eq("card_id", cardId)
      .eq("user_id", userId) // Ensure user owns the card
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Card not found or user mismatch." });
    }

    res.status(200).json({ message: "Total limit updated successfully." });

  } catch (err) {
    console.error("Error updating total limit:", err.message);
    // This error message will now be shown on the frontend
    res.status(500).json({ message: "Failed to update total limit on the server." });
  }
});


// ✅ UPDATE CATEGORY LIMIT (You'll need this one too)
router.put("/wallet/limit", async (req, res) => {
  const { userId, cardId, categoryId, newLimit } = req.body;

  // Map frontend categoryId to the correct DB column
  const columnToUpdate = {
    food: "food_limit",
    travel: "travel_limit",
    shopping: "shopping_limit",
  }[categoryId];

  if (!columnToUpdate) {
    return res.status(400).json({ message: "Invalid category ID." });
  }
  
  if (typeof newLimit !== 'number' || newLimit < 0) {
    return res.status(400).json({ message: "Invalid limit amount." });
  }

  try {
    // Server-side validation
    const { data: cardData, error: fetchError } = await supabase
      .from("card")
      .select("total_limit, food_limit, travel_limit, shopping_limit")
      .eq("card_id", cardId)
      .eq("user_id", userId)
      .single();

    if (fetchError || !cardData) {
      return res.status(404).json({ message: "Card not found or user mismatch." });
    }
    
    // Calculate sum of *other* categories
    let otherLimits = 0;
    if (categoryId !== 'food') otherLimits += cardData.food_limit;
    if (categoryId !== 'travel') otherLimits += cardData.travel_limit;
    if (categoryId !== 'shopping') otherLimits += cardData.shopping_limit;

    const newTotalAllocated = otherLimits + newLimit;
    
    if (newTotalAllocated > cardData.total_limit) {
      return res.status(400).json({
        message: `Total category limits (₹${newTotalAllocated}) cannot exceed the card's total limit (₹${cardData.total_limit}).`
      });
    }
    
    // If validation passes, update the card
    const { data, error } = await supabase
      .from("card")
      .update({ [columnToUpdate]: newLimit })
      .eq("card_id", cardId)
      .eq("user_id", userId) // Security check
      .select();
      
    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Card not found or user mismatch." });
    }

    res.status(200).json({ message: "Category limit updated." });

  } catch (err) {
    console.error("Error updating category limit:", err.message);
    res.status(500).json({ message: "Failed to update category limit on the server." });
  }
});


export default router;