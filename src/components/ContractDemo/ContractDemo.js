import { useState } from "react";
import {
  useReadContract,
  useWriteContract,
  useAccount,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseUnits, formatUnits } from "viem";
import ERC20_ABI from "../../utils/abi/ERC20_ABI";
import { DEMO_CONTRACT_ADDRESS } from "../../utils/Environment";
import "../ApiDemo/ApiDemo.css";
import "./ContractDemo.css";

export default function ContractDemo() {
  const { address, isConnected } = useAccount();
  const [queryAddress, setQueryAddress] = useState(address || "");
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [txHash, setTxHash] = useState(null);

  // READ: token symbol
  const { data: symbol } = useReadContract({
    address: DEMO_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: "symbol",
  });

  // READ: decimals
  const { data: decimals } = useReadContract({
    address: DEMO_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: "decimals",
  });

  // READ: balance of queried address
  const { data: rawBalance, refetch: refetchBalance } = useReadContract({
    address: DEMO_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [queryAddress],
    enabled: !!queryAddress,
  });

  const formattedBalance =
    rawBalance && decimals ? formatUnits(rawBalance, decimals) : null;

  // WRITE: transfer tokens
  const { writeContract, isPending: writing } = useWriteContract({
    mutation: {
      onSuccess: (hash) => setTxHash(hash),
    },
  });

  // Wait for tx confirmation
  const { isLoading: confirming, isSuccess: confirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handleTransfer = () => {
    if (!transferTo || !transferAmount || !decimals) return;
    writeContract({
      address: DEMO_CONTRACT_ADDRESS,
      abi: ERC20_ABI,
      functionName: "transfer",
      args: [transferTo, parseUnits(transferAmount, decimals)],
    });
  };

  return (
    <div className="page-container">
      <h2 className="page-title">📜 Contract Integration</h2>
      <p className="page-desc">
        Using <code>wagmi</code>'s useReadContract and useWriteContract to interact with an ERC-20 contract.
        Contract: <code>{DEMO_CONTRACT_ADDRESS.slice(0, 10)}...</code> (USDC on Arbitrum)
      </p>

      {/* Contract Info */}
      <div className="section">
        <h3>Contract Info (Read)</h3>
        <div className="contract-info">
          <div className="info-row">
            <span className="label">Token Symbol</span>
            <span className="value">{symbol || "Loading..."}</span>
          </div>
          <div className="info-row">
            <span className="label">Decimals</span>
            <span className="value">{decimals?.toString() || "Loading..."}</span>
          </div>
          <div className="info-row">
            <span className="label">Contract</span>
            <span className="value mono">{DEMO_CONTRACT_ADDRESS}</span>
          </div>
        </div>
      </div>

      {/* Balance Check */}
      <div className="section">
        <h3>Check Balance (balanceOf)</h3>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input
            className="input"
            placeholder="Wallet address 0x..."
            value={queryAddress}
            onChange={(e) => setQueryAddress(e.target.value)}
            style={{ flex: 1 }}
          />
          <button className="btn-primary" onClick={() => refetchBalance()}>Check</button>
        </div>
        {formattedBalance !== null && (
          <div className="success-box">
            Balance: <strong>{parseFloat(formattedBalance).toFixed(4)} {symbol}</strong>
          </div>
        )}
      </div>

      {/* Transfer */}
      <div className="section">
        <h3>Transfer Tokens (Write)</h3>
        {!isConnected ? (
          <div className="info-box">⚠️ Connect your wallet to send transactions</div>
        ) : (
          <>
            <div className="form">
              <input
                className="input"
                placeholder="Recipient address 0x..."
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
              />
              <input
                className="input"
                placeholder={`Amount in ${symbol || "tokens"}`}
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
              />
              <button className="btn-primary" onClick={handleTransfer} disabled={writing || confirming}>
                {writing ? "Confirm in wallet..." : confirming ? "Confirming tx..." : `Transfer ${symbol}`}
              </button>
            </div>
            {txHash && (
              <div className={confirmed ? "success-box" : "info-box"} style={{ marginTop: 12, wordBreak: "break-all", fontSize: 12 }}>
                {confirmed ? "✅ Confirmed!" : "⏳ Pending..."} TX: {txHash}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
