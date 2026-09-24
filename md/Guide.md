# Integration Guide

Kya seekhna chahte ho? Apna path chuno.

---

## 🌐 Web2 Path — Sirf API Integration Seekhna Chahte Ho?

Agar tumhe blockchain se koi matlab nahi, sirf React mein REST API integration seekhni hai — yeh steps follow karo.

### Step 1 — axiosClient setup karo
**File:** `src/utils/axiosClient.js`

```js
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  headers: { "Content-Type": "application/json" },
});

// Har request pe token auto-attach
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosClient;
```

---

### Step 2 — Service file banao
**File:** `src/utils/services/posts.services.js`

> Rule: Component directly `axiosClient` call nahi karta. Pehle service function banao, phir component us function ko call kare.

```js
import axiosClient from "../axiosClient";

export const getPostsService = async (limit = 5) => {
  try {
    const response = await axiosClient.get(`/posts?_limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("getPostsService error:", error);
  }
};

export const createPostService = async (title, body) => {
  try {
    const response = await axiosClient.post("/posts", { title, body });
    return response.data;
  } catch (error) {
    console.error("createPostService error:", error);
  }
};

export const updatePostService = async (id, title, body) => {
  try {
    const response = await axiosClient.put(`/posts/${id}`, { title, body });
    return response.data;
  } catch (error) {
    console.error("updatePostService error:", error);
  }
};

export const deletePostService = async (id) => {
  try {
    const response = await axiosClient.delete(`/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error("deletePostService error:", error);
  }
};
```

---

### Step 3 — Component mein service call karo
**File:** `src/components/ApiDemo/ApiDemo.js`

```js
import { useState, useEffect } from "react";
import { getPostsService, createPostService } from "../../utils/services/posts.services";

export default function ApiDemo() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadPosts = async () => {
    setLoading(true);
    const data = await getPostsService(5); // ← service call
    if (data) setPosts(data);
    setLoading(false);
  };

  useEffect(() => { loadPosts(); }, []);

  return (
    <div>
      {loading ? <p>Loading...</p> : posts.map(p => <p key={p.id}>{p.title}</p>)}
    </div>
  );
}
```

---

### Step 4 — Redux ke saath use karo (optional)
**File:** `src/redux/action/actions.js`

```js
import { getPostsService } from "../../utils/services/posts.services";

export const fetchPostsAction = () => async (dispatch) => {
  dispatch({ type: "PRICES_LOADING" });
  const posts = await getPostsService(10); // ← service call
  if (!posts) return;
  dispatch({ type: "SET_PRICES", payload: posts });
};
```

```js
// Component mein
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsAction } from "../../redux/action/actions";

const dispatch = useDispatch();
const { data } = useSelector((state) => state.prices);
useEffect(() => { dispatch(fetchPostsAction()); }, []);
```

**Web2 Pattern Summary:**
```
Component → service function → axiosClient → REST API
```

**Demo page:** `/api-demo`

---
---

## ⛓️ Web3 Path — Blockchain Integration Seekhna Chahte Ho?

Wallet connect, contract read/write, socket, subgraph — sab yahan hai.

---

### Step 1 — Wagmi config banao
**File:** `src/wagmi/config.js`

```js
import { createConfig, http } from "wagmi";
import { arbitrum } from "wagmi/chains";
import { injected, metaMask, walletConnect } from "wagmi/connectors";

export const config = createConfig({
  chains: [arbitrum],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId: "YOUR_PROJECT_ID", showQrModal: true }),
  ],
  transports: {
    [arbitrum.id]: http("https://arb1.arbitrum.io/rpc"),
  },
});
```

---

### Step 2 — Provider se app wrap karo
**File:** `src/wagmi/Provider.js`

```js
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "./config";

const queryClient = new QueryClient();

export function Web3Provider({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

---

### Step 3 — Wallet connect karo
**File:** `src/components/WalletDemo/WalletDemo.js`

```js
import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";

const { address, isConnected } = useAccount();
const { connect, connectors } = useConnect();
const { disconnect } = useDisconnect();
const { data: balance } = useBalance({ address });

// Connect
connectors.map(c => (
  <button onClick={() => connect({ connector: c })}>Connect {c.name}</button>
));

// Info
<p>{address}</p>
<p>{balance?.formatted} {balance?.symbol}</p>
```

**Demo page:** `/wallet-demo`

---

### Step 4 — Contract READ karo
**File:** `src/components/ContractDemo/ContractDemo.js`

> Wallet connect ki zaroorat nahi — sirf RPC URL chahiye.

```js
import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import ERC20_ABI from "../../utils/abi/ERC20_ABI";

const { data: symbol } = useReadContract({
  address: "0xContractAddress",
  abi: ERC20_ABI,
  functionName: "symbol",
});

const { data: rawBalance } = useReadContract({
  address: "0xContractAddress",
  abi: ERC20_ABI,
  functionName: "balanceOf",
  args: ["0xUserAddress"],
});

const balance = rawBalance ? formatUnits(rawBalance, 6) : "0";
```

---

### Step 5 — Contract WRITE karo
**File:** `src/components/ContractDemo/ContractDemo.js`

> Wallet connected hona chahiye — user wallet mein sign karega.

```js
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";

const { writeContract, data: txHash, isPending } = useWriteContract();
const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

writeContract({
  address: "0xContractAddress",
  abi: ERC20_ABI,
  functionName: "transfer",
  args: ["0xRecipient", parseUnits("1.0", 6)], // 1 USDC
});
```

**Demo page:** `/contract-demo`

---

### Step 6 — Socket real-time data
**File:** `src/hooks/useSocket.js`

```js
import socket, { useSocketEvents } from "../../hooks/useSocket";

useSocketEvents([
  {
    eventName: "message",
    handler: (data) => setMessages(prev => [data, ...prev]),
  },
  {
    eventName: "price_update",
    handler: (data) => setPrice(data),
  },
]);

// Event bhejo
socket.emit("message", { text: "Hello!", room: "general" });
```

**Demo page:** `/socket-demo`

---

### Step 7 — Subgraph (GraphQL) query karo
**File:** `src/utils/services/graph.services.js`

```js
// Service file mein query likhte hain
export const getRecentSwapsService = async (first = 5) => {
  const res = await graphClient.post("", {
    query: `query GetSwaps($first: Int!) {
      swaps(first: $first, orderBy: timestamp, orderDirection: desc) {
        id amountUSD token0 { symbol } token1 { symbol }
      }
    }`,
    variables: { first },
  });
  return res.data.data.swaps;
};

// Component mein
import { getRecentSwapsService } from "../../utils/services/graph.services";
const swaps = await getRecentSwapsService(5);
```

**Demo page:** `/graph-demo`

---

## 📁 Project Structure

```
src/
├── wagmi/
│   ├── config.js              ← chains + connectors (Web3)
│   └── Provider.js            ← app wrapper (Web3)
├── hooks/
│   └── useSocket.js           ← socket singleton + hook (Web3)
├── utils/
│   ├── Environment.js         ← sab env variables
│   ├── axiosClient.js         ← axios instance (Web2 + Web3)
│   ├── abi/ERC20_ABI.js       ← contract ABI (Web3)
│   └── services/
│       ├── posts.services.js  ← REST API calls (Web2)
│       ├── users.services.js  ← REST API calls (Web2)
│       └── graph.services.js  ← GraphQL queries (Web3)
├── redux/
│   ├── action/actions.js      ← thunks (service call karte hain)
│   └── reducer/               ← state reducers
└── components/
    ├── ApiDemo/               ← Web2 demo
    ├── SocketDemo/            ← Web3 real-time
    ├── ChartDemo/             ← charts
    ├── WalletDemo/            ← wallet hooks
    ├── ContractDemo/          ← read + write
    └── GraphDemo/             ← subgraph
```
