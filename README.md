# Integration Hub

A beginner-friendly React project for learning how a frontend connects to REST APIs, real-time services, GraphQL subgraphs, crypto wallets, and smart contracts. Each topic has a working example in the app and a short guided explanation.

**Read the companion article:** [React Integration for Beginners: From API Calls to Smart Contracts](https://medium.com/@mirbasit01/react-integration-for-beginners-from-api-calls-to-smart-contracts-6aa70c9c20b4?postPublishedType=initial)<br>
**Repository:** [mirbasit01/Integration-hub on GitHub](https://github.com/mirbasit01/Integration-hub)

## Learning path

If you are new to integrations, start with the API demo. It introduces loading and error states, then shows how to keep HTTP requests in reusable service functions. Continue through the guide in this order:

1. **REST API** (`/api-demo`): Axios, service functions, and GET/POST/PUT/DELETE requests.
2. **Charts and shared state** (`/chart-demo`): Redux thunks and Recharts.
3. **Real-time updates** (`/socket-demo`): Socket.IO events and connection lifecycle.
4. **GraphQL** (`/graph-demo`): Query indexed blockchain data from a subgraph.
5. **Wallets** (`/wallet-demo`): Connect a wallet, inspect its account, and sign a message.
6. **Smart contracts** (`/contract-demo`): Read ERC-20 data and send a token transfer.

The article introduces the same core ideas from simpler examples; this repository lets you explore them in a larger React app. The `/guide` page links each concept to the relevant source file and demo.

## Run locally

### Requirements

- Node.js and npm
- A browser wallet such as MetaMask for wallet and transaction demos

### Setup

```bash
npm install
```

Create a `.env.local` file in the project root and add the settings you need. The API demo works with its default JSONPlaceholder endpoint; wallet, socket, and subgraph features may need credentials or a running service.

```env
REACT_APP_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
REACT_APP_API_URL=https://jsonplaceholder.typicode.com
REACT_APP_SOCKET_URL=https://your-socket-server.example
REACT_APP_SUBGRAPH_URL=your_subgraph_endpoint
REACT_APP_SUBGRAPH_API_KEY=your_subgraph_api_key
REACT_APP_RPC_URL=https://arb1.arbitrum.io/rpc
```

Start the development server:

```bash
npm start
```

Open the local URL printed in the terminal. Restart the development server after changing environment variables.

## How the code is organized

```text
src/
├── components/       Screens and interactive examples
├── hooks/            Reusable React hooks, including the Socket.IO hook
├── redux/            Store, reducers, and async actions
├── utils/
│   ├── abi/          ERC-20 contract interface
│   ├── services/     REST and GraphQL request functions
│   ├── axiosClient.js Shared Axios configuration
│   └── Environment.js Environment variable access
└── wagmi/            Wallet and blockchain provider configuration
```

For the REST API example, follow the request from the screen to the service function, then to the shared Axios client:

```text
ApiDemo component → posts service → Axios client → API
```

The component owns the screen state (such as posts and loading status). The service owns the HTTP request. This separation makes both easier to understand and reuse.

## Environment settings

| Variable | Used for | Example or source |
|---|---|---|
| `REACT_APP_API_URL` | REST API base URL | Defaults to JSONPlaceholder in the demo |
| `REACT_APP_WALLETCONNECT_PROJECT_ID` | WalletConnect sessions | Create a project at [WalletConnect Cloud](https://cloud.walletconnect.com) |
| `REACT_APP_RPC_URL` | Arbitrum blockchain reads | Public Arbitrum RPC URL |
| `REACT_APP_SOCKET_URL` | Socket.IO server | URL of a compatible Socket.IO server |
| `REACT_APP_SUBGRAPH_URL` | GraphQL subgraph requests | Your subgraph endpoint |
| `REACT_APP_SUBGRAPH_API_KEY` | Authenticated subgraph requests | Key from your subgraph provider |

## Safety note for the contract demo

The contract screen demonstrates a real ERC-20 transfer on Arbitrum. A write requires a connected wallet, wallet approval, and gas. Use an address and token amount you intend to send, and review the transaction in your wallet before approving it. Reading public contract data does not require a wallet connection.

## Useful documentation

- [React](https://react.dev/learn)
- [Axios](https://axios-http.com/docs/intro)
- [Wagmi](https://wagmi.sh)
- [Viem](https://viem.sh)
- [Socket.IO client](https://socket.io/docs/v4/client-api/)
- [The Graph](https://thegraph.com/docs)
- [Recharts](https://recharts.org)
