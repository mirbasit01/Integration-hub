import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Dashboard" },
    { path: "/guide", label: "📖 Guide" },
    { path: "/api-demo", label: "API" },
    { path: "/socket-demo", label: "Socket" },
    { path: "/chart-demo", label: "Charts" },
    { path: "/wallet-demo", label: "Wallet" },
    { path: "/contract-demo", label: "Contract" },
    { path: "/graph-demo", label: "Subgraph" },
  ];

  return (
    <header className="header">
      <div className="header-logo">⚡ Integration Hub</div>

      <nav className="header-nav">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`nav-link ${location.pathname === link.path ? "active" : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="header-wallet">
        {isConnected ? (
          <div className="wallet-info">
            <span className="wallet-address">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
            <button className="btn-disconnect" onClick={() => disconnect()}>
              Disconnect
            </button>
          </div>
        ) : (
          <div className="connect-buttons">
            {connectors.slice(0, 2).map((connector) => (
              <button
                key={connector.id}
                className="btn-connect"
                onClick={() => connect({ connector })}
              >
                {connector.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
