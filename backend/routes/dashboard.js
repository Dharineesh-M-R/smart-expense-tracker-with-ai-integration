import express from 'express';
import cors from 'cors';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

// ✅ Middleware
router.use(cors());
router.use(express.json());

// ✅ Route to get user details
router.get('/userdetail', async (req, res) => {
  try {
    // Fetch only the first user's details (modify if you want specific user logic)
    const { data, error } = await supabase
      .from('users')
      .select('name, email,balance')
      .single(); // get single row

    if (error) throw error;

    // Send data to frontend
    res.json(data);
  } catch (err) {
    console.error('Error fetching user details:', err.message);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

export default router;
