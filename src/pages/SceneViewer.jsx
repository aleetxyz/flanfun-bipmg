import { useEffect, useRef, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import classnames from "classnames/bind";

import { client } from "infra/wsmp/MultiplayerClient";
import SceneContext from "fractable-min/SceneContext";
import SceneLoader from "fractable-min/SceneLoader";
import SceneEnvironment from "fractable-min/SceneEnvironment";
import OrbitController from "fractable-min/OrbitController";
import PointerRaycaster from "fractable-min/raycaster/PointerRaycaster";
import ActionTransceiver from "infra/wsmp/ActionTransceiver";

import Bip39Overlay from "components/BIP39Overlay";
import InputTerminal from "assets/ingame/terminal/InputTerminal";
import terminals from "assets/ingame/terminal/terminals";

import useInstance from "../hooks/useInstance";
import { AmbientLight } from "three";

import style from "pages/minigames/bip39/bip39.module.scss";
import { generateUUID } from "three/src/math/MathUtils";

const { VITE_APP_STATIC_URL } = import.meta.env;
const c = classnames.bind(style);

const configuration = {
  camera: {
    cam: { near: 0.1, far: 10000 },
    xyz: [0, 2, 2],
    eye: [0, 2, 0],
    orbit: { minDst: 1, maxDst: 2.5 },
  },
  scene: {
    gltf: `${VITE_APP_STATIC_URL}/scenes/$flan_desk/draco.glb`,
    rgbe: `${VITE_APP_STATIC_URL}/hdri/royal_esplanade_1k.hdr`,
  },
  fonts: {
    primary: `${VITE_APP_STATIC_URL}/fonts/segment.ttf`,
  },
};

const euid = generateUUID();

export default function SceneViewer() {
  const canvas = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [screensApi, setScreens] = useState({});
  const { uuid } = useParams();

  /** @type {Web3} */
  //const web3 = useInstance(Web3, magic.rpcProvider);
  /** @type {SceneContext} */
  const context = useInstance(SceneContext, canvas);
  /** @type {SceneEnvironment} */
  const scenenv = useInstance(SceneEnvironment, context);
  /** @type {OrbitController} */
  const orbiter = useInstance(OrbitController, context);
  /** @type {PointerRaycaster} */
  const rcaster = useInstance(PointerRaycaster, context);
  /** @type {SceneLoader} */
  const loader = useInstance(SceneLoader);
  /** @type {PlayerTransceiver} */
  const txrx = useInstance(ActionTransceiver, client);

  const renderSceneMemoized = useCallback(async () => {
    await scenenv.stageEnvironment(configuration.scene);
    context.stageCamera(configuration.camera);

    const light = new AmbientLight(parseInt(0xffffff), 1.0);
    context.scene.add(light);

    const tfgl = await loader.loadAt(configuration.scene.gltf);
    context.scene.add(tfgl.scene);
    setLoaded(true);

    context.traverseScene();
    context.playScene();
    loader.dispose();

    window.addEventListener("resize", context.handleResize, false);
  }, [context, scenenv, loader]);

  useEffect(() => {
    context.initialize();
    if (loader.checkSupport(context)) {
      client.connect(uuid || euid);
      renderSceneMemoized();
    } else {
      return;
    }

    return () => {
      window.removeEventListener("resize", context.handleResize, true);
    };
  }, [renderSceneMemoized, context, orbiter, loader, uuid]);

  const { primaryWallet } = useDynamicContext();

  const unfocus = () => {
    const [cx, cy, cz] = configuration.camera.xyz;
    const [ex, ey, ez] = configuration.camera.eye;
    context.camera.position.set(cx, cy, cz);
    context.camera.lookAt(ex, ey, ez);
  };

  useEffect(() => {
    txrx.subscribe("players:riddle", setScreens);
    return () => txrx.unsubscribe("players:riddle", setScreens);
  }, [txrx, setScreens]);

  return (
    <>
      <div
        id="owo"
        ref={canvas}
        style={{ width: "100vw", height: "100vh", backgroundColor: " black" }}
      />
      {primaryWallet?.address && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            padding: "0.25rem",
            width: "10rem",
            backgroundColor: "white",
            margin: "1rem auto",
            border: "1px solid black",
          }}
        >
          <p
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineBreak: "anywhere",
              whiteSpace: "nowrap",
            }}
          >
            {primaryWallet?.address}
          </p>
        </div>
      )}
      {/* START GAME OVERLAY */}
      <Bip39Overlay transceiver={txrx} rcaster={rcaster} puid={uuid || euid} />
      {/* IFRAM GAME OVERLAY */}
      <div className={c("ifm-overlay")}>
        {loaded &&
          Object.keys(terminals).map((key) => (
            <InputTerminal
              key={key}
              context={context}
              scene={context.scene}
              screenId={key}
              screenData={terminals[key]}
              riddle={screensApi[key] || {}}
              rcaster={rcaster}
              transceiver={txrx}
              unfocus={unfocus}
            />
          ))}
      </div>
      <button
        className={c(
          "btn-unfocus",
          "begin-btn",
          "bg-white",
          "mt-4",
          "p-1",
          "w-[6rem]"
        )}
        onClick={unfocus}
      >
        unfocus (Esc)
      </button>
    </>
  );
}
