const express = require('express');
const app = express();
app.use(express.json());

// POST endpoint to submit a price
app.post('/api/prices/submit', (req, res) => {
  const { productName, market, price } = req.body;
  res.json({
    message: 'Price submitted successfully',
    data: { productName, market, price }
  });
});

// Simple GET test
app.get('/api/prices', (req, res) => {
  res.json({ message: 'GET request working fine!' });
});

app.listen(4000, () => {
  console.log('✅ Server running on http://localhost:4000');
});
