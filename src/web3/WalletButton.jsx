import { DynamicNav } from "@dynamic-labs/sdk-react-core";

export default function WalletButton() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        zIndex: 10,
        padding: "10px",
      }}
    >
      <DynamicNav />
    </div>
  );
}
