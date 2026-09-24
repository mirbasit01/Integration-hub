# ⚡ Integration Hub

A beginner-friendly React project covering all major Web3 integrations in one place.

## 🎯 What You'll Learn

| Page | Integration | Key Concepts |
|------|-------------|--------------|
| `/api-demo` | REST API | axios, service layer, GET/POST/PUT/DELETE |
| `/socket-demo` | Socket.io | real-time events, rooms, connect/disconnect |
| `/chart-demo` | Recharts | Line, Bar, Area charts, Redux-driven data |
| `/wallet-demo` | Wagmi | useAccount, useBalance, useSignMessage, useSwitchChain |
| `/contract-demo` | Smart Contract | useReadContract, useWriteContract, viem parseUnits |
| `/graph-demo` | The Graph | GraphQL queries, subgraph, custom query editor |

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env and fill in your values
cp .env .env.local

# 3. Start dev server
npm start
```

---

## ⚙️ Environment Variables

Edit `.env` with your actual values:

```env
REACT_APP_WALLETCONNECT_PROJECT_ID=   # Get from https://cloud.walletconnect.com
REACT_APP_API_URL=https://jsonplaceholder.typicode.com   # Works out of the box
REACT_APP_SOCKET_URL=https://your-socket-server.com
REACT_APP_SUBGRAPH_URL=https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3
REACT_APP_SUBGRAPH_API_KEY=           # Get from https://thegraph.com/studio
REACT_APP_RPC_URL=https://arb1.arbitrum.io/rpc
```

> **API Demo** works immediately with `jsonplaceholder.typicode.com` — no key needed.

---

## 📁 Folder Structure

```
src/
├── wagmi/
│   ├── config.js              # Wagmi chains + connectors setup
│   └── Provider.js            # WagmiProvider + QueryClientProvider wrapper
├── hooks/
│   └── useSocket.js           # Socket.io singleton + useSocketEvents hook
├── utils/
│   ├── Environment.js         # All env variables in one place
│   ├── axiosClient.js         # Axios instance with interceptors
│   ├── abi/
│   │   └── ERC20_ABI.js       # Minimal ERC-20 ABI
│   └── services/              # ← All API calls live here
│       ├── posts.services.js  # GET/POST/PUT/DELETE posts
│       ├── users.services.js  # GET users
│       └── graph.services.js  # Subgraph GraphQL queries
├── redux/
│   ├── action/actions.js      # Redux actions + thunks (call services)
│   ├── reducer/               # userReducer, priceReducer
│   └── store/                 # store.js + rootReducer.js
├── components/
│   ├── Header/                # Wallet connect button + navigation
│   ├── Dashboard/             # Overview cards
│   ├── ApiDemo/               # GET/POST/PUT/DELETE demo
│   ├── SocketDemo/            # Real-time socket events
│   ├── ChartDemo/             # Recharts Line/Bar/Area
│   ├── WalletDemo/            # Wagmi wallet hooks
│   ├── ContractDemo/          # ERC-20 read + write
│   └── GraphDemo/             # Subgraph GraphQL queries
├── App.js                     # Router + providers
└── index.js                   # Entry point
```

---

## 🔑 Key Patterns

### Service Layer (API)
```
Component → service function → axiosClient → API
```
```js
// utils/services/posts.services.js
export const getPostsService = async (limit = 5) => {
  const response = await axiosClient.get(`/posts?_limit=${limit}`);
  return response.data;
};

// Component — never calls axiosClient directly
const posts = await getPostsService(5);
```

### Wagmi Config
```js
// src/wagmi/config.js
export const config = createConfig({
  chains: [arbitrum],
  connectors: [injected(), metaMask(), walletConnect({ projectId })],
  transports: { [arbitrum.id]: http(RPC_URL) },
});
```

### Socket Singleton
```js
// src/hooks/useSocket.js
const socket = io(SOCKET_URL, { transports: ["websocket"], reconnection: true });

export const useSocketEvents = (events) => {
  useEffect(() => {
    events.forEach(({ eventName, handler }) => socket.on(eventName, handler));
    return () => events.forEach(({ eventName, handler }) => socket.off(eventName, handler));
  }, []);
};
```

### Contract Read
```js
const { data: balance } = useReadContract({
  address: CONTRACT_ADDRESS,
  abi: ERC20_ABI,
  functionName: "balanceOf",
  args: [userAddress],
});
```

### Contract Write
```js
const { writeContract } = useWriteContract();
writeContract({
  address: CONTRACT_ADDRESS,
  abi: ERC20_ABI,
  functionName: "transfer",
  args: [recipient, parseUnits(amount, decimals)],
});
```

### Subgraph Query
```js
// utils/services/graph.services.js
export const getRecentSwapsService = async (first = 5) => {
  const data = await sendQuery(`
    query GetSwaps($first: Int!) {
      swaps(first: $first, orderBy: timestamp, orderDirection: desc) {
        id amountUSD token0 { symbol } token1 { symbol }
      }
    }
  `, { first });
  return data.swaps;
};
```

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `wagmi` | Wallet connection, contract hooks |
| `viem` | Low-level Ethereum utilities |
| `socket.io-client` | Real-time WebSocket communication |
| `axios` | HTTP API requests |
| `recharts` | Charts and data visualization |
| `@tanstack/react-query` | Server state (required by wagmi) |
| `react-redux` + `redux-thunk` | Global state management |
| `react-router-dom` | Client-side routing |

---

## 🛠️ Troubleshooting

**Wallet not connecting?**
- Get a free WalletConnect Project ID at https://cloud.walletconnect.com
- Set `REACT_APP_WALLETCONNECT_PROJECT_ID` in `.env`

**Socket not connecting?**
- Socket uses `autoConnect: false` — click "Connect" in the UI
- Make sure your backend has CORS enabled

**Subgraph returning errors?**
- Get a free API key at https://thegraph.com/studio
- Set `REACT_APP_SUBGRAPH_URL` to your specific subgraph endpoint

**Contract reads returning undefined?**
- Make sure you're on Arbitrum network (chain ID 42161)
- Demo uses USDC contract on Arbitrum

---

## 📚 Resources

- [Wagmi Docs](https://wagmi.sh)
- [Viem Docs](https://viem.sh)
- [The Graph Docs](https://thegraph.com/docs)
- [Socket.io Docs](https://socket.io/docs)
- [Recharts Docs](https://recharts.org)
- [WalletConnect Cloud](https://cloud.walletconnect.com)
