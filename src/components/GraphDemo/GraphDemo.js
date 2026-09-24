import { useState } from "react";
import {
  getRecentSwapsService,
  getTopPoolsService,
  runCustomQueryService,
} from "../../utils/services/graph.services";
import "../ApiDemo/ApiDemo.css";
import "./GraphDemo.css";

const CUSTOM_QUERY = `{
  pools(first: 3, orderBy: totalValueLockedUSD, orderDirection: desc) {
    id
    token0 { symbol }
    token1 { symbol }
    totalValueLockedUSD
    volumeUSD
  }
}`;

export default function GraphDemo() {
  const [swaps, setSwaps] = useState([]);
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customQuery, setCustomQuery] = useState(CUSTOM_QUERY);
  const [customResult, setCustomResult] = useState(null);

  const fetchSwaps = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRecentSwapsService(5);
      setSwaps(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPools = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTopPoolsService(3);
      setPools(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const runCustom = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await runCustomQueryService(customQuery);
      setCustomResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">🔗 Subgraph (GraphQL)</h2>
      <p className="page-desc">
        Service layer pattern: <code>graph.services.js</code> handles all subgraph queries.
        Set <code>REACT_APP_SUBGRAPH_URL</code> in <code>.env</code> to your subgraph endpoint.
      </p>

      <div className="pattern-box">
        <strong>Pattern:</strong>
        <code>Component → graph.services.js → axios → Subgraph GraphQL</code>
      </div>

      {error && <div className="error-box">❌ {error} — Check REACT_APP_SUBGRAPH_URL in .env</div>}

      {/* Recent Swaps */}
      <div className="section">
        <div className="section-header">
          <h3>Recent Swaps — <code>getRecentSwapsService()</code></h3>
          <button className="btn-primary" onClick={fetchSwaps} disabled={loading}>
            {loading ? "Fetching..." : "Fetch Swaps"}
          </button>
        </div>
        {swaps.length === 0 ? (
          <p style={{ color: "#888", fontSize: 14 }}>Click "Fetch Swaps" to query the subgraph</p>
        ) : (
          <div className="list">
            {swaps.map((swap) => (
              <div key={swap.id} className="list-item">
                <span className="badge">${parseFloat(swap.amountUSD).toFixed(2)}</span>
                <div>
                  <strong>{swap.token0?.symbol} → {swap.token1?.symbol}</strong>
                  <p>{new Date(swap.timestamp * 1000).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Pools */}
      <div className="section">
        <div className="section-header">
          <h3>Top Pools — <code>getTopPoolsService()</code></h3>
          <button className="btn-primary" onClick={fetchPools} disabled={loading}>
            {loading ? "Fetching..." : "Fetch Pools"}
          </button>
        </div>
        {pools.length === 0 ? (
          <p style={{ color: "#888", fontSize: 14 }}>Click "Fetch Pools" to load top liquidity pools</p>
        ) : (
          <div className="list">
            {pools.map((pool) => (
              <div key={pool.id} className="list-item">
                <span className="badge">{pool.token0?.symbol}/{pool.token1?.symbol}</span>
                <div>
                  <strong>TVL: ${parseFloat(pool.totalValueLockedUSD).toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
                  <p>Volume: ${parseFloat(pool.volumeUSD).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Query */}
      <div className="section">
        <div className="section-header">
          <h3>Custom Query — <code>runCustomQueryService()</code></h3>
          <button className="btn-primary" onClick={runCustom} disabled={loading}>Run</button>
        </div>
        <textarea
          className="input query-editor"
          value={customQuery}
          onChange={(e) => setCustomQuery(e.target.value)}
          rows={7}
        />
        {customResult && (
          <pre className="json-result">{JSON.stringify(customResult, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}
