import express from 'express';
import cors from 'cors';
import {supabase} from '../supabaseClient.js';

const router = express.Router();
const app = express();

app.use(cors());
app.use(express.json());

router.get('/translogs',async(res,req)=>{
    const {data,error} = await supabase
    .from('transactions')
    .select('*');
})

export default router;