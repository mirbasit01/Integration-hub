import { useState } from "react";
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useSignMessage,
  useSwitchChain,
  useChainId,
} from "wagmi";
import { arbitrum, mainnet } from "wagmi/chains";
import "../ApiDemo/ApiDemo.css";
import "./WalletDemo.css";

export default function WalletDemo() {
  const { address, isConnected, connector } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [signMsg, setSignMsg] = useState("Hello Web3!");
  const [signature, setSignature] = useState(null);

  const { data: balance } = useBalance({ address, enabled: !!address });

  const { signMessage, isPending: signing } = useSignMessage({
    mutation: {
      onSuccess: (sig) => setSignature(sig),
    },
  });

  return (
    <div className="page-container">
      <h2 className="page-title">👛 Wallet Integration (Wagmi)</h2>
      <p className="page-desc">
        Using <code>wagmi</code> hooks: useAccount, useConnect, useBalance, useSignMessage, useSwitchChain.
      </p>

      {/* Connect */}
      <div className="section">
        <h3>Connect Wallet</h3>
        {isConnected ? (
          <div className="wallet-connected">
            <div className="wallet-row">
              <span className="label">Address</span>
              <span className="value mono">{address}</span>
            </div>
            <div className="wallet-row">
              <span className="label">Connector</span>
              <span className="value">{connector?.name}</span>
            </div>
            <div className="wallet-row">
              <span className="label">Balance</span>
              <span className="value">
                {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : "Loading..."}
              </span>
            </div>
            <div className="wallet-row">
              <span className="label">Chain ID</span>
              <span className="value">{chainId}</span>
            </div>
            <button className="btn-secondary" onClick={() => disconnect()} style={{ marginTop: 12 }}>
              Disconnect
            </button>
          </div>
        ) : (
          <div className="connectors-list">
            {connectors.map((c) => (
              <button key={c.id} className="connector-btn" onClick={() => connect({ connector: c })}>
                <span>🔌</span> {c.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Switch Chain */}
      {isConnected && (
        <div className="section">
          <h3>Switch Chain</h3>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              className={`btn-primary ${chainId === arbitrum.id ? "active-chain" : ""}`}
              onClick={() => switchChain({ chainId: arbitrum.id })}
            >
              Arbitrum {chainId === arbitrum.id && "✓"}
            </button>
            <button
              className={`btn-primary ${chainId === mainnet.id ? "active-chain" : ""}`}
              onClick={() => switchChain({ chainId: mainnet.id })}
            >
              Ethereum {chainId === mainnet.id && "✓"}
            </button>
          </div>
        </div>
      )}

      {/* Sign Message */}
      {isConnected && (
        <div className="section">
          <h3>Sign Message</h3>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input
              className="input"
              value={signMsg}
              onChange={(e) => setSignMsg(e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              className="btn-primary"
              onClick={() => signMessage({ message: signMsg })}
              disabled={signing}
            >
              {signing ? "Signing..." : "Sign"}
            </button>
          </div>
          {signature && (
            <div className="success-box" style={{ wordBreak: "break-all", fontSize: 12 }}>
              ✅ Signature: {signature}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
