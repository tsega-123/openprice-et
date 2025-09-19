import { useState, useEffect } from 'react';

function App() {
  const [productName, setProductName] = useState('');
  const [market, setMarket] = useState('');
  const [price, setPrice] = useState('');
  const [prices, setPrices] = useState([]);

  const submitPrice = async () => {
    const res = await fetch('http://localhost:4000/api/prices/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productName, market, price }),
    });
    const data = await res.json();
    alert(data.message);
    fetchPrices();
  };

  const fetchPrices = async () => {
    const res = await fetch('http://localhost:4000/api/prices');
    const data = await res.json();
    setPrices(data.prices || []);
  };
  useEffect(() => {
  fetch('http://localhost:4000/api/prices')
    .then(res => res.json())
    .then(data => console.log(data));
}, []);


  useEffect(() => {
    fetchPrices();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Local Price Tracker</h1>

      <h2>Submit Price</h2>
      <input placeholder="Product" value={productName} onChange={e => setProductName(e.target.value)} />
      <input placeholder="Market" value={market} onChange={e => setMarket(e.target.value)} />
      <input placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
      <button onClick={submitPrice}>Submit</button>

      <h2>Latest Prices</h2>
      <ul>
        {prices.map(p => (
          <li key={p._id}>
            {p.productName} - {p.market} - {p.price} {p.unit} ({p.status})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
