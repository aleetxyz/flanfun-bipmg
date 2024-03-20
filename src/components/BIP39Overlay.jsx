/* eslint-disable react/prop-types */
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import classnames from "classnames/bind";

import PlayersTransceiver from "infra/wsmp/ActionTransceiver";

import style from "./bip39.module.scss";
import flanfun from "assets/flanfun/flanfun.png";
import bip39 from "assets/flanfun/bip39.png";

const c = classnames.bind(style);

export default function Bip39Overlay(props) {
  const txrx = props.transceiver;
  const rcaster = props.rcaster;
  const [players, setPlayers] = useState({ a: [], b: [] });
  const [winner, setWinner] = useState(null);
  const [name, setname] = useState(null);
  const text = useRef();

  const { uuid } = useParams();

  const [countdown, setcountdown] = useState(4);

  console.log("RERENDER", players);

  useEffect(() => {
    const onUpdate = (players) => setPlayers(players);
    txrx.subscribe(PlayersTransceiver.PlayersUpdate, onUpdate);
  }, [txrx]);

  const connecteds = useCallback(
    () => Number(players.a.length) + Number(players.b.length),
    [players]
  );

  useEffect(() => {
    if (connecteds() === 2 && countdown > 0) {
      const to = setTimeout(() => {
        setcountdown((c) => c - 1);
      }, 1000);
      return () => clearTimeout(to);
    }
  }, [connecteds, countdown]);

  useEffect(() => {
    if (countdown === 0) {
      rcaster.capture();
    }
  }, [countdown, rcaster]);

  const onUpdateState = useCallback((scores) => {
    setPlayers(scores);
  }, []);

  useEffect(() => {
    txrx.subscribe("player:scored", onUpdateState);
    return () => txrx.unsubscribe();
  }, [txrx, onUpdateState]);

  useEffect(() => {
    const wins = [...players.a, ...players.b].find((p) => p.score >= 50);
    if (wins) {
      rcaster.pause();
      setWinner(wins);
    }
  }, [rcaster, players]);

  const beginGame = () => {
    const content = text.current.value;
    txrx.initialize(content);
    setname(content);
  };

  return countdown > 0 ? (
    <div className={c("sta-overlay")}>
      {/** THIS WRAPPER IS PRE GAME */}
      <div className={c("wrapper")}>
        {/** THIS WRAPPER IS GAME COUNTDOWN */}
        <div
          className={c("flex", "items-center", "justify-center", "w-[32rem]")}
        >
          <img src={flanfun} className={c("h-[128px]")} draggable={false} />
          <img src={bip39} className={c("h-[128px]")} draggable={false} />
        </div>
        {countdown > 3 && (
          <>
            <div
              className={c(
                "flex",
                "flex-wrap",
                "justify-center",
                "items-center",
                "w-[32rem]"
              )}
            >
              <label
                style={{ textShadow: "black 2px 2px" }}
                className={c(
                  "font-pixelated",
                  "text-neutral-50",
                  "text-2xl",
                  "p-4"
                )}
              >
                YOUR NAME:
              </label>
              <input
                type="text"
                ref={text}
                className={c(
                  "text-input",
                  "font-pixelated",
                  "text-neutral-50",
                  "text-2xl",
                  "p-2"
                )}
              />
              <button
                className={c(
                  "font-pixelated",
                  "text-neutral-50",
                  "text-2xl",
                  "begin-btn"
                )}
                onClick={beginGame}
              >
                START
              </button>
            </div>
            <br />
            <p
              className={c("font-pixelated", "text-neutral-50", "text-2xl")}
              style={{ textShadow: "black 2px 2px" }}
            >
              {`CONNECTED PLAYERS <${connecteds()}>:`}
            </p>
            <div className={c("flex", "justify-center", "items-center", "p-4")}>
              <ul>
                {players?.a?.map((player, idx) => (
                  <li
                    key={idx}
                    style={{ textShadow: "black 2px 2px" }}
                    className={c(
                      "font-pixelated",
                      "text-neutral-50",
                      "text-2xl"
                    )}
                  >
                    {player.name}
                  </li>
                ))}
              </ul>
              <h3
                style={{ textShadow: "black 2px 2px" }}
                className={c(
                  "font-pixelated",
                  "text-neutral-50",
                  "text-2xl",
                  "p-4"
                )}
              >
                vs
              </h3>
              <ul>
                {players?.b?.map((player, idx) => (
                  <li
                    key={idx}
                    style={{ textShadow: "black 2px 2px" }}
                    className={c(
                      "font-pixelated",
                      "text-neutral-50",
                      "text-2xl"
                    )}
                  >
                    {player.name}
                  </li>
                ))}
              </ul>
            </div>
            {!uuid && (
              <>
                <p
                  className={c("font-pixelated", "text-neutral-50", "text-2xl")}
                >
                  INVITE SOMEONE
                </p>
                <p
                  className={c("font-pixelated", "text-neutral-50", "text-xl")}
                  style={{ userSelect: "text" }}
                >
                  {`${window.location.href}${props.puid}`}
                </p>
              </>
            )}
          </>
        )}
        {countdown <= 3 && (
          <div
            className={c("flex", "items-center", "justify-center", "w-[32rem]")}
          >
            <p className={c("font-pixelated", "text-neutral-50", "text-2xl")}>
              GAME STARTS IN: {countdown}
            </p>
          </div>
        )}
      </div>
    </div>
  ) : (
    <>
      <ul className={c("p-4")} style={{ position: "fixed", top: 0 }}>
        {[...players.a, ...players.b].map((player, idx) => (
          <li
            key={idx}
            className={c("font-pixelated", "text-neutral-50", "text-2xl")}
            style={{ textShadow: "black 2px 2px" }}
          >
            {player.name}: {player.score}
          </li>
        ))}
      </ul>
      {winner && (
        <div className={c("sta-overlay")}>
          <div className={c("winner")} style={{ textShadow: "black 2px 2px" }}>
            <p
              className={c("font-pixelated", "text-neutral-50", "text-4xl")}
            >{`THE WINNER IS ${winner.name}`}</p>
            {name === winner.name && (
              <button className={c("begin-btn")}>GET MY TOKENS</button>
            )}
            {name !== winner.name && (
              <button className={c("begin-btn")}>OK, SNIF SNIF</button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
