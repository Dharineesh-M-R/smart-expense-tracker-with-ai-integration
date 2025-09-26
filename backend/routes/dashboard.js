import express from 'express';
import cors from 'cors';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

router.use(cors());
router.use(express.json());

// GET user details using query parameter ?userId=...
router.get('/userdetail', async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required.' });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, balance')
      .eq('id', userId)
      .maybeSingle(); // returns null if no user found

    if (error) {
      console.error('Supabase Query Error:', error.message);
      return res.status(500).json({ error: 'Database query failed.', details: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: `User with ID "${userId}" not found.` });
    }

    res.json(data);

  } catch (err) {
    console.error('Unhandled Server Error fetching user details:', err.message);
    res.status(500).json({ error: 'An unexpected server error occurred.' });
  }
});

router.get('/transaction',async(req,res)=>{
  const userId = req.query.userId;
  const {data, error} = await supabase
  .from('transactions')
  .select('*')
  .eq('user_id',userId);
});

export default router;
