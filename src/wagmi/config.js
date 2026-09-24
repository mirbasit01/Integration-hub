import { createConfig, http } from "wagmi";
import { arbitrum, mainnet } from "wagmi/chains";
import { injected, metaMask, walletConnect } from "wagmi/connectors";
import { WALLETCONNECT_PROJECT_ID, RPC_URL } from "../utils/Environment";

export const config = createConfig({
  chains: [arbitrum, mainnet],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId: WALLETCONNECT_PROJECT_ID,
      showQrModal: true,
      metadata: {
        name: "Integration Hub",
        description: "Learn Web3 integrations",
        url: window.location.origin,
      },
    }),
  ],
  transports: {
    [arbitrum.id]: http(RPC_URL),
    [mainnet.id]: http(),
  },
});
