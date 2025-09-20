import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function App() {
  const [productName, setProductName] = useState('');
  const [market, setMarket] = useState('');
  const [price, setPrice] = useState('');
  const [pricesData, setPricesData] = useState({ prices: [], count: 0, average: 0, min: 0, max: 0 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [filterProduct, setFilterProduct] = useState('');

  // Fetch prices (optionally filtered)
  const fetchPrices = async (product = '', marketQ = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (product) params.append('productName', product);
      if (marketQ) params.append('market', marketQ);
      const res = await fetch(`${API}/api/prices?${params.toString()}`);
      const data = await res.json();
      // backend returns { count, average, min, max, prices }
      setPricesData(data);
    } catch (err) {
      console.error('fetchPrices error', err);
      setMessage({ type: 'error', text: 'Could not fetch prices' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices(); // initial load (recent prices)
  }, []);

  const submitPrice = async () => {
    if (!productName.trim() || !market.trim() || price === '') {
      setMessage({ type: 'error', text: 'Product, market and price are required.' });
      return;
    }
    const numeric = Number(price);
    if (Number.isNaN(numeric) || numeric <= 0) {
      setMessage({ type: 'error', text: 'Price must be a positive number.' });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API}/api/prices/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName: productName.trim(), market: market.trim(), price: numeric })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Submit failed');
      setMessage({ type: 'success', text: data.message || 'Submitted' });
      // clear form
      setProductName('');
      setMarket('');
      setPrice('');
      // refresh list (optionally fetch filtered by product)
      fetchPrices(filterProduct || productName.trim() || '');
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Submission error' });
    } finally {
      setLoading(false);
      // remove message after 3s
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleFilter = () => fetchPrices(filterProduct.trim(), '');

  return (
    <div style={{ maxWidth: 820, margin: '20px auto', fontFamily: 'system-ui, Arial', padding: 16 }}>
      <h1 style={{ marginBottom: 4 }}>OpenPrice-ET — Local Price Tracker</h1>
      <p style={{ color: '#555', marginTop: 0 }}>
        Submit and view community prices. Backend: {API}
      </p>

      <section style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
        <div style={{ flex: 1, padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
          <h3>Submit Price</h3>
          <input value={productName} onChange={e => setProductName(e.target.value)} placeholder="Product (e.g., Tomato)" style={{ width: '100%', padding: 8, marginBottom: 8 }} />
          <input value={market} onChange={e => setMarket(e.target.value)} placeholder="Market (e.g., Merkato)" style={{ width: '100%', padding: 8, marginBottom: 8 }} />
          <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price (number)" style={{ width: '100%', padding: 8, marginBottom: 8 }} />
          <button onClick={submitPrice} disabled={loading} style={{ padding: '8px 12px' }}>Submit</button>
        </div>

        <div style={{ width: 300, padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
          <h3>Quick filter</h3>
          <input value={filterProduct} onChange={e => setFilterProduct(e.target.value)} placeholder="Product name to filter" style={{ width: '100%', padding: 8, marginBottom: 8 }} />
          <button onClick={handleFilter} disabled={loading} style={{ padding: '8px 12px' }}>Filter</button>
          <button onClick={() => { setFilterProduct(''); fetchPrices(); }} style={{ marginLeft: 8, padding: '8px 12px' }}>Reset</button>
          <div style={{ marginTop: 12 }}>
            <div><strong>Count:</strong> {pricesData.count ?? 0}</div>
            <div><strong>Avg:</strong> {pricesData.average ?? '-'} {pricesData.prices?.[0]?.unit ?? 'birr/kg'}</div>
            <div><strong>Min:</strong> {pricesData.min ?? '-'} </div>
            <div><strong>Max:</strong> {pricesData.max ?? '-'} </div>
          </div>
        </div>
      </section>

      {message && (
        <div style={{ marginBottom: 12, padding: 10, borderRadius: 6, background: message.type === 'error' ? '#ffe6e6' : '#e6ffe9', color: message.type === 'error' ? '#900' : '#060' }}>
          {message.text}
        </div>
      )}

      <section>
        <h3>Latest price submissions</h3>
        {loading ? <div>Loading...</div> : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {pricesData.prices && pricesData.prices.length ? pricesData.prices.map(p => (
              <li key={p._id} style={{ padding: 10, borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <strong>{p.productName}</strong> — {p.market}
                    <div style={{ color: '#666', fontSize: 12 }}>{new Date(p.submittedAt).toLocaleString()}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18 }}>{p.price} {p.unit}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>status: {p.status}</div>
                  </div>
                </div>
              </li>
            )) : <li style={{ color: '#666' }}>No prices yet</li>}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
