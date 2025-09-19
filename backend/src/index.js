import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db.js';
import priceRoutes from './routes/priceRoutes.js';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());

// routes (app declared before using routes)
app.use('/api/prices', priceRoutes);

app.get('/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;

const start = async () => {
  await connectDB(); // connect to MongoDB first
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start();
