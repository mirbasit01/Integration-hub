import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import "./Dashboard.css";

const cards = [
  {
    path: "/api-demo",
    icon: "🌐",
    title: "API Integration",
    desc: "Axios + REST API calls with loading states and error handling",
    color: "#3b82f6",
  },
  {
    path: "/socket-demo",
    icon: "⚡",
    title: "Socket.io",
    desc: "Real-time bidirectional communication with socket events",
    color: "#10b981",
  },
  {
    path: "/chart-demo",
    icon: "📊",
    title: "Charts",
    desc: "Recharts — Line, Bar, Area charts with live data",
    color: "#f59e0b",
  },
  {
    path: "/wallet-demo",
    icon: "👛",
    title: "Wallet (Wagmi)",
    desc: "Connect MetaMask / WalletConnect, read balance, sign messages",
    color: "#8b5cf6",
  },
  {
    path: "/contract-demo",
    icon: "📜",
    title: "Contract Integration",
    desc: "Read & write ERC-20 contract using wagmi hooks + viem",
    color: "#ec4899",
  },
  {
    path: "/graph-demo",
    icon: "🔗",
    title: "Subgraph (GraphQL)",
    desc: "Query The Graph protocol for on-chain indexed data",
    color: "#06b6d4",
  },
];

export default function Dashboard() {
  const { address, isConnected } = useAccount();

  return (
    <div className="dashboard">
      <div className="dashboard-hero">
        <h1>Integration Hub</h1>
        <p>Beginner-friendly project covering all major integrations in one place</p>
        {isConnected && (
          <div className="connected-badge">
            ✅ Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>
        )}
      </div>

      <div className="cards-grid">
        {cards.map((card) => (
          <Link key={card.path} to={card.path} className="card" style={{ "--card-color": card.color }}>
            <div className="card-icon">{card.icon}</div>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
            <span className="card-arrow">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
