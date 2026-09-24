import { useState } from "react";
import { Link } from "react-router-dom";
import "./Guide.css";

const web2Steps = [
  {
    step: 1,
    title: "Set up the Axios client",
    path: "/api-demo",
    file: "src/utils/axiosClient.js",
    desc: "Create one Axios instance with a base URL and optional interceptors. Reuse it across the app so request settings stay in one place.",
    code: `import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  headers: { "Content-Type": "application/json" },
});

// Add the token to each request when one is available.
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

export default axiosClient;`,
  },
  {
    step: 2,
    title: "Create a service file",
    path: "/api-demo",
    file: "src/utils/services/posts.services.js",
    desc: "Keep API requests in feature-specific service files. Components call service functions instead of making HTTP requests themselves.",
    code: `import axiosClient from "../axiosClient";

export const getPostsService = async (limit = 5) => {
  try {
    const response = await axiosClient.get(\`/posts?_limit=\${limit}\`);
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
};`,
  },
  {
    step: 3,
    title: "Call the service from a component",
    path: "/api-demo",
    file: "src/components/ApiDemo/ApiDemo.js",
    desc: "Import and call the service function from your component. This keeps request details out of the UI code.",
    code: `import { useState, useEffect } from "react";
import { getPostsService, createPostService } from "../../utils/services/posts.services";

export default function ApiDemo() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadPosts = async () => {
    setLoading(true);
    const data = await getPostsService(5); // service call
    if (data) setPosts(data);
    setLoading(false);
  };

  useEffect(() => { loadPosts(); }, []);

  return (
    <div>
      {loading ? <p>Loading...</p> : posts.map(p => <p key={p.id}>{p.title}</p>)}
    </div>
  );
}`,
  },
  {
    step: 4,
    title: "Use Redux (optional)",
    path: "/chart-demo",
    file: "src/redux/action/actions.js",
    desc: "When several components need the same data, a Redux thunk can call the service and store the result. The component dispatches the thunk; the thunk calls the service.",
    code: `import { getPostsService } from "../../utils/services/posts.services";

// Thunk action
export const fetchPostsAction = () => async (dispatch) => {
  dispatch({ type: "PRICES_LOADING" });
  const posts = await getPostsService(10); // service call
  if (!posts) return;
  dispatch({ type: "SET_PRICES", payload: posts });
};

// In a component
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsAction } from "../../redux/action/actions";

const dispatch = useDispatch();
const { data } = useSelector((state) => state.prices);
useEffect(() => { dispatch(fetchPostsAction()); }, []);`,
  },
];

const web3Steps = [
  {
    step: 1,
    title: "Create the Wagmi configuration",
    path: "/wallet-demo",
    file: "src/wagmi/config.js",
    desc: "Choose the supported chains, wallet connectors, and RPC transports in one configuration file.",
    code: `import { createConfig, http } from "wagmi";
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
});`,
  },
  {
    step: 2,
    title: "Wrap the app with providers",
    path: "/wallet-demo",
    file: "src/wagmi/Provider.js",
    desc: "Wrap the app with WagmiProvider and QueryClientProvider so wallet hooks can access their shared configuration.",
    code: `import { WagmiProvider } from "wagmi";
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

// In App.js:
// <Web3Provider> <App /> </Web3Provider>`,
  },
  {
    step: 3,
    title: "Connect a wallet",
    path: "/wallet-demo",
    file: "src/components/WalletDemo/WalletDemo.js",
    desc: "Use useConnect, useAccount, and useDisconnect to connect a wallet, read its address, and disconnect it.",
    code: `import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";

export default function WalletDemo() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });

  if (isConnected) return (
    <div>
      <p>Address: {address}</p>
      <p>Balance: {balance?.formatted} {balance?.symbol}</p>
      <button onClick={() => disconnect()}>Disconnect</button>
    </div>
  );

  return connectors.map(c => (
    <button key={c.id} onClick={() => connect({ connector: c })}>
      Connect {c.name}
    </button>
  ));
}`,
  },
  {
    step: 4,
    title: "Read from a contract",
    path: "/contract-demo",
    file: "src/components/ContractDemo/ContractDemo.js",
    desc: "useReadContract reads public blockchain data through an RPC connection. A user does not need to connect a wallet to perform a read.",
    code: `import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import ERC20_ABI from "../../utils/abi/ERC20_ABI";

const CONTRACT = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"; // USDC Arbitrum

export default function ReadContract() {
  const { data: symbol } = useReadContract({
    address: CONTRACT,
    abi: ERC20_ABI,
    functionName: "symbol",
  });

  const { data: rawBalance } = useReadContract({
    address: CONTRACT,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: ["0xYourAddress"],
  });

  return (
    <div>
      <p>Token: {symbol}</p>
      <p>Balance: {rawBalance ? formatUnits(rawBalance, 6) : "0"}</p>
    </div>
  );
}`,
  },
  {
    step: 5,
    title: "Write to a contract",
    path: "/contract-demo",
    file: "src/components/ContractDemo/ContractDemo.js",
    desc: "useWriteContract asks the connected wallet to approve and send a transaction. useWaitForTransactionReceipt lets the app show when it is confirmed.",
    code: `import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import ERC20_ABI from "../../utils/abi/ERC20_ABI";

const CONTRACT = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";

export default function WriteContract() {
  const { writeContract, data: txHash, isPending } = useWriteContract();

  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const handleTransfer = () => {
    writeContract({
      address: CONTRACT,
      abi: ERC20_ABI,
      functionName: "transfer",
      args: ["0xRecipientAddress", parseUnits("1.0", 6)], // 1 USDC
    });
  };

  return (
    <div>
      <button onClick={handleTransfer} disabled={isPending}>
        {isPending ? "Confirm in wallet..." : "Transfer 1 USDC"}
      </button>
      {isSuccess && <p>✅ Transaction confirmed!</p>}
    </div>
  );
}`,
  },
  {
    step: 6,
    title: "Socket real-time data",
    path: "/socket-demo",
    file: "src/hooks/useSocket.js",
    desc: "Listen for real-time events with Socket.IO. The useSocketEvents hook subscribes to events and removes its listeners when the component unmounts.",
    code: `import socket, { useSocketEvents } from "../../hooks/useSocket";

export default function SocketDemo() {
  const [messages, setMessages] = useState([]);

  // Subscribe to events; the hook removes the listeners during cleanup.
  useSocketEvents([
    {
      eventName: "message",
      handler: (data) => setMessages(prev => [data, ...prev]),
    },
    {
      eventName: "price_update",
      handler: (data) => console.log("New price:", data),
    },
  ]);

  const sendMessage = () => {
    socket.emit("message", { text: "Hello!", room: "general" });
  };

  return <button onClick={sendMessage}>Send</button>;
}`,
  },
  {
    step: 7,
    title: "Query a subgraph with GraphQL",
    path: "/graph-demo",
    file: "src/utils/services/graph.services.js",
    desc: "Fetch indexed on-chain data from The Graph. Keep the GraphQL query in a service file and call that service from the component.",
    code: `// graph.services.js
export const getRecentSwapsService = async (first = 5) => {
  const res = await graphClient.post("", {
    query: \`query GetSwaps($first: Int!) {
      swaps(first: $first, orderBy: timestamp, orderDirection: desc) {
        id
        amountUSD
        token0 { symbol }
        token1 { symbol }
      }
    }\`,
    variables: { first },
  });
  return res.data.data.swaps;
};

// In a component
import { getRecentSwapsService } from "../../utils/services/graph.services";

const swaps = await getRecentSwapsService(5);`,
  },
];

export default function Guide() {
  const [activeTab, setActiveTab] = useState("web2");
  const [openStep, setOpenStep] = useState(1);

  const steps = activeTab === "web2" ? web2Steps : web3Steps;

  return (
    <div className="guide-container">
      <div className="guide-hero">
        <h2 className="page-title">📖 Integration Guide</h2>
        <p className="guide-subtitle">
          Choose a learning path: Web2 APIs or Web3 blockchain integrations.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="tab-switcher">
        <button
          className={`tab-btn ${activeTab === "web2" ? "active" : ""}`}
          onClick={() => { setActiveTab("web2"); setOpenStep(1); }}
        >
          <span className="tab-icon">🌐</span>
          <div>
            <strong>Web2 — API Integration</strong>
            <p>Start here to learn REST APIs and the service layer pattern.</p>
          </div>
        </button>
        <button
          className={`tab-btn ${activeTab === "web3" ? "active" : ""}`}
          onClick={() => { setActiveTab("web3"); setOpenStep(1); }}
        >
          <span className="tab-icon">⛓️</span>
          <div>
            <strong>Web3 — Blockchain Integration</strong>
            <p>Explore wallets, smart contracts, real-time sockets, and subgraphs.</p>
          </div>
        </button>
      </div>

      {/* What's included */}
      <div className={`includes-box ${activeTab}`}>
        {activeTab === "web2" ? (
          <>
            <strong>What you will learn:</strong>
            <div className="tags">
              <span>axios setup</span>
              <span>Service layer pattern</span>
              <span>GET / POST / PUT / DELETE</span>
              <span>Redux + API</span>
              <span>Error handling</span>
            </div>
          </>
        ) : (
          <>
            <strong>What you will learn:</strong>
            <div className="tags">
              <span>Wagmi config</span>
              <span>Wallet connect</span>
              <span>Contract read</span>
              <span>Contract write</span>
              <span>Socket.io</span>
              <span>Subgraph GraphQL</span>
            </div>
          </>
        )}
      </div>

      {/* Steps */}
      <div className="steps-list">
        {steps.map((item) => (
          <div
            key={item.step}
            className={`step-card ${openStep === item.step ? "open" : ""}`}
          >
            <div className="step-header" onClick={() => setOpenStep(openStep === item.step ? null : item.step)}>
              <div className="step-left">
                <span className="step-number">{item.step}</span>
                <div>
                  <strong>{item.title}</strong>
                  <span className="step-file">{item.file}</span>
                </div>
              </div>
              <div className="step-right">
                <Link to={item.path} className="step-demo-link" onClick={(e) => e.stopPropagation()}>
                  Open demo →
                </Link>
                <span className="step-arrow">{openStep === item.step ? "▲" : "▼"}</span>
              </div>
            </div>

            {openStep === item.step && (
              <div className="step-body">
                <p className="step-desc">{item.desc}</p>
                <pre className="step-code"><code>{item.code}</code></pre>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="summary-box">
        <h3>📁 Project Structure (Quick Reference)</h3>
        <pre className="step-code">{`src/
├── wagmi/
│   ├── config.js              ← chains + connectors (Web3)
│   └── Provider.js            ← app wrapper (Web3)
├── hooks/
│   └── useSocket.js           ← socket singleton + hook (Web3)
├── utils/
│   ├── Environment.js         ← environment variables
│   ├── axiosClient.js         ← axios instance (Web2 + Web3)
│   ├── abi/ERC20_ABI.js       ← contract ABI (Web3)
│   └── services/
│       ├── posts.services.js  ← REST API calls (Web2)
│       ├── users.services.js  ← REST API calls (Web2)
│       └── graph.services.js  ← GraphQL queries (Web3)
├── redux/
│   ├── action/actions.js      ← thunks (call service functions)
│   └── reducer/               ← state reducers
└── components/
    ├── ApiDemo/               ← Web2 demo
    ├── SocketDemo/            ← Web3 real-time
    ├── ChartDemo/             ← charts
    ├── WalletDemo/            ← wallet hooks
    ├── ContractDemo/          ← read + write
    └── GraphDemo/             ← subgraph`}</pre>
      </div>
    </div>
  );
}
