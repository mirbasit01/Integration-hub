// ─── All env variables in one place ─────────────
export const API_URL = process.env.REACT_APP_API_URL || "https://jsonplaceholder.typicode.com";
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "https://your-socket-server.com";
export const SUBGRAPH_URL = process.env.REACT_APP_SUBGRAPH_URL;
export const SUBGRAPH_API_KEY = process.env.REACT_APP_SUBGRAPH_API_KEY;
export const RPC_URL = process.env.REACT_APP_RPC_URL || "https://arb1.arbitrum.io/rpc";
export const WALLETCONNECT_PROJECT_ID = process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || "";

// Demo ERC-20 contract on Arbitrum (USDC)
export const DEMO_CONTRACT_ADDRESS = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";
export const chainId = 42161; // Arbitrum
