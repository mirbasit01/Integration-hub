# Integrations Guide

## 1. API Integration (axios)

**File:** `src/utils/axiosClient.js`

```js
const axiosClient = axios.create({ baseURL: API_URL });

// Auto-attach token on every request
axiosClient.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

**Usage in component:**
```js
const res = await axiosClient.get("/posts?_limit=5");   // GET
const res = await axiosClient.post("/posts", { title }); // POST
```

---

## 2. Socket.io Integration

**File:** `src/hooks/useSocket.js`

```js
// Singleton — one socket for the whole app
const socket = io(SOCKET_URL, { transports: ["websocket"], reconnection: true });

// Hook to subscribe/unsubscribe cleanly
export const useSocketEvents = (events) => {
  useEffect(() => {
    events.forEach(({ eventName, handler }) => socket.on(eventName, handler));
    return () => events.forEach(({ eventName, handler }) => socket.off(eventName, handler));
  }, []);
};
```

**Usage in component:**
```js
useSocketEvents([
  { eventName: "message", handler: (data) => setMessages(prev => [data, ...prev]) },
  { eventName: "price_update", handler: (data) => setPrice(data) },
]);

socket.emit("joinRoom", { room: "general" });
```

---

## 3. Charts (Recharts)

**File:** `src/components/ChartDemo/ChartDemo.js`

```js
<ResponsiveContainer width="100%" height={250}>
  <LineChart data={data}>
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="price" stroke="#7c6af7" />
  </LineChart>
</ResponsiveContainer>
```

Chart types used: `LineChart`, `BarChart`, `AreaChart`

---

## 4. Wallet Integration (Wagmi)

**File:** `src/wagmi/config.js`

```js
export const config = createConfig({
  chains: [arbitrum, mainnet],
  connectors: [injected(), metaMask(), walletConnect({ projectId })],
  transports: { [arbitrum.id]: http(RPC_URL) },
});
```

**Hooks used:**
```js
useAccount()        → address, isConnected, connector
useConnect()        → connect({ connector })
useDisconnect()     → disconnect()
useBalance()        → data.formatted, data.symbol
useSignMessage()    → signMessage({ message })
useSwitchChain()    → switchChain({ chainId })
useChainId()        → current chain ID
```

---

## 5. Contract Integration

**File:** `src/components/ContractDemo/ContractDemo.js`

**Read (no wallet needed):**
```js
const { data } = useReadContract({
  address: CONTRACT_ADDRESS,
  abi: ERC20_ABI,
  functionName: "balanceOf",
  args: [userAddress],
});
```

**Write (wallet required):**
```js
const { writeContract } = useWriteContract();

writeContract({
  address: CONTRACT_ADDRESS,
  abi: ERC20_ABI,
  functionName: "transfer",
  args: [recipient, parseUnits(amount, decimals)],
});
```

**Wait for confirmation:**
```js
const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });
```

---

## 6. Subgraph / GraphQL

**File:** `src/utils/services/graphService.js`

```js
export const querySubgraph = async (query, variables = {}) => {
  const res = await graphClient.post("", { query, variables });
  if (res.data.errors) throw new Error(res.data.errors[0].message);
  return res.data.data;
};
```

**Usage:**
```js
const data = await querySubgraph(`
  query GetSwaps($first: Int!) {
    swaps(first: $first, orderBy: timestamp, orderDirection: desc) {
      id
      amountUSD
      token0 { symbol }
      token1 { symbol }
    }
  }
`, { first: 5 });
```

---

## Environment Variables Checklist

| Variable | Required For | Where to Get |
|----------|-------------|--------------|
| `REACT_APP_WALLETCONNECT_PROJECT_ID` | Wallet connect | https://cloud.walletconnect.com |
| `REACT_APP_API_URL` | API demo | Any REST API URL |
| `REACT_APP_SOCKET_URL` | Socket demo | Your backend URL |
| `REACT_APP_SUBGRAPH_URL` | Graph demo | https://thegraph.com/studio |
| `REACT_APP_SUBGRAPH_API_KEY` | Graph demo | https://thegraph.com/studio |
| `REACT_APP_RPC_URL` | Contract reads | https://arb1.arbitrum.io/rpc (free) |
