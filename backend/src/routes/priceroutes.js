import express from 'express';
import Price from '../models/Price.js';

const router = express.Router();

// Submit a new price
router.post('/submit', async (req, res) => {
  try {
    const { productName, market, price, unit, sourceType, submittedBy } = req.body;
    if (!productName || !market || price === undefined) {
      return res.status(400).json({ message: 'productName, market and price are required' });
    }
    const p = new Price({
      productName: productName.trim(),
      market: market.trim(),
      price: Number(price),
      unit: unit || 'birr/kg',
      sourceType: sourceType || 'user',
      submittedBy: submittedBy || 'anonymous'
    });
    await p.save();
    return res.status(201).json({ message: 'Price submitted', data: p });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error submitting price', error: err.message || err });
  }
});

// Get prices (optionally filter by productName and/or market)
router.get('/', async (req, res) => {
  try {
    const { productName, market, limit = 200 } = req.query;
    const filter = {};
    if (productName) filter.productName = productName;
    if (market) filter.market = market;
    const prices = await Price.find(filter).sort({ submittedAt: -1 }).limit(Number(limit));

    if (!prices.length) return res.json({ count: 0, average: 0, min: 0, max: 0, prices: [] });

    const values = prices.map(p => p.price);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    return res.json({
      count: prices.length,
      average: Number(avg.toFixed(2)),
      min,
      max,
      prices
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error fetching prices', error: err.message || err });
  }
});

export default router;
