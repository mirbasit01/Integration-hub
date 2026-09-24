# Architecture

## Overview

```
User Browser
    │
    ▼
React App (CRA)
    │
    ├── Wagmi + Viem ──────────────► Blockchain (Arbitrum)
    │       ├── useReadContract ──────► Contract Reads
    │       └── useWriteContract ─────► Contract Writes / Txns
    │
    ├── Axios ─────────────────────► REST API Backend
    ├── Socket.io-client ──────────► WebSocket Server (real-time)
    ├── GraphQL (axios) ───────────► The Graph Subgraph
    └── Recharts ──────────────────► Data Visualization
```

---

## Provider Stack (App.js)

```
<Provider store={store}>          ← Redux global state
  <Web3Provider>                  ← WagmiProvider + QueryClientProvider
    <Router>                      ← React Router
      <Header />                  ← Wallet connect UI
      <Routes>                    ← Page routing
```

---

## Data Flow

### API Integration
```
Component
  → axiosClient.get("/posts")
  → interceptor adds Bearer token from localStorage
  → response → setState → re-render
```

### Socket Integration
```
useSocket.js creates ONE socket singleton
  → socket.connect() / socket.disconnect() manually
  → useSocketEvents([{ eventName, handler }]) subscribes
  → cleanup on unmount: socket.off(eventName, handler)
  → socket.emit() sends events to server
```

### Wallet + Contract
```
wagmi/config.js defines chains + connectors
  → useAccount()           → address, isConnected
  → useReadContract()      → reads blockchain (no wallet needed)
  → useWriteContract()     → sends tx (user signs in wallet)
  → useWaitForTransactionReceipt() → waits for confirmation
```

### Subgraph (GraphQL)
```
graphService.js
  → axios.post(SUBGRAPH_URL, { query, variables })
  → returns data.data from GraphQL response
```

---

## State Management

| State Type       | Tool                  | Example              |
|------------------|-----------------------|----------------------|
| Server/API state | React useState + axios| posts list           |
| Blockchain state | wagmi hooks           | balance, contract    |
| Global app state | Redux                 | user info, prices    |
| Real-time state  | Socket.io + useState  | live messages        |

---

## File Naming Convention

```
components/FeatureName/FeatureName.js   ← component
components/FeatureName/FeatureName.css  ← styles
hooks/useFeatureName.js                 ← custom hook
utils/serviceName.js                    ← utility/service
utils/abi/CONTRACT_ABI.js               ← contract ABI
utils/services/apiService.js            ← API service
```
