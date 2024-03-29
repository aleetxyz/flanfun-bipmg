import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

import SceneViewer from "pages/SceneViewer";
import SessionCode from "pages/SessionCode";

import "./index.css";
import "styles/universal.scss";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SceneViewer />,
  },
  {
    path: "/:uuid",
    element: <SceneViewer />,
  },
  {
    path: "/session",
    element: <SessionCode />,
  },
]);

const evmNetworks = [
  {
    blockExplorerUrls: ["https://evm-sidechain.xrpl.org"],
    chainId: 1440002,
    chainName: "XRPL Testnet",
    iconUrls: ["https://cryptologos.cc/logos/xrp-xrp-logo.svg"],
    name: "XRPL Testnet",
    nativeCurrency: {
      decimals: 18,
      name: "Ripple",
      symbol: "XRP",
    },
    networkId: 1440002,
    rpcUrls: ["https://rpc-evm-sidechain.xrpl.org"],
    vanityName: "XRPL Testnet",
  },
];

ReactDOM.createRoot(document.getElementById("root")).render(
  <DynamicContextProvider
    settings={{
      environmentId: "307b51f3-049f-4a91-b606-af8c65c3321a",
      walletConnectors: [EthereumWalletConnectors],
      evmNetworks,
    }}
  >
    <RouterProvider router={router} />
  </DynamicContextProvider>
);
