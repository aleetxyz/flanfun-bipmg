/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import classnames from "classnames/bind";
import { useDynamicContext, DynamicWidget } from "@dynamic-labs/sdk-react-core";

import style from "./bip39.module.scss";

const c = classnames.bind(style);

export default function ClaimTokens(props) {
  const { winner, name } = props;

  const { primaryWallet } = useDynamicContext();
  const [provider, setProvider] = useState(null);
  const [address, setLoggedIn] = useState(false);
  const [minting, setMinting] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    setLoggedIn(primaryWallet?.address);
  }, [primaryWallet?.address]);

  /* LOOKUP FOR TOKEN BALANCES IF PROVIDER AND LOGGIN */
  useEffect(() => {
    const balance = async () => {
      const result = await axios.get(
        `https://api.flan.fun/api/balance/${address}`
      );
      if (result?.data?.balance > 0) {
        console.log("SETTING_BALANCE");
        setBalance(true);
      }
    };
    address && balance();
  }, [address]);

  /* AFTER MINTING IS DONE */
  useEffect(() => {
    const balance = async () => {
      const address = primaryWallet?.address;
      const result = await axios.get(
        `https://api.flan.fun/api/balance/${address}`
      );
      if (result.data.balance >= 1) {
        setMinting(0);
        setBalance(0);
      }
    };
    if (minting === 2) {
      balance();
    }
  });

  const startModal = async () => {
    if (primaryWallet?.address && balance === 0) {
      setMinting(1);
      axios
        .post(`https://api.flan.fun/api/mint`, {
          address: primaryWallet?.address,
        })
        .then(() => setMinting(2));
    } else if (primaryWallet?.address && balance > 0) {
      window.location.href = "/map";
    }
  };

  const kontinue = () => {
    window.location.href = "/";
  };

  return (
    winner && (
      <div className={c("sta-overlay")}>
        <div className={c("winner")} style={{ textShadow: "black 2px 2px" }}>
          <p
            className={c("font-pixelated", "text-neutral-50", "text-4xl")}
          >{`THE WINNER IS ${winner?.name}`}</p>
          {!address && name === winner?.name && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <DynamicWidget />
            </div>
          )}
          {name === winner?.name && address && (
            <button className={c("begin-btn")} onClick={startModal}>
              {address && balance < 1 && "CLAIM MY ACCESS TOKEN"}
              {address && balance > 0 && "YOU ALREADY HAVE A TOKEN, CONTINUE"}
            </button>
          )}
          {name !== winner?.name && (
            <button className={c("begin-btn")} onClick={kontinue}>
              RETRY
            </button>
          )}
          {minting === 1 && (
            <p className={c("font-pixelated", "text-neutral-50", "text-4xl")}>
              MINTING...
            </p>
          )}
        </div>
      </div>
    )
  );
}
