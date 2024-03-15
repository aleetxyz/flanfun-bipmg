import { useEffect, useRef, useCallback, useState } from "react";
import classnames from "classnames/bind";

import SceneContext from "fractable-min/SceneContext";
import SceneLoader from "fractable-min/SceneLoader";
import SceneEnvironment from "fractable-min/SceneEnvironment";
import OrbitController from "fractable-min/OrbitController";
import PointerRaycaster from "fractable-min/raycaster/PointerRaycaster";

import InputTerminal from "assets/ingame/terminal/InputTerminal";
import terminals from "assets/ingame/terminal/terminals";

import useInstance from "../hooks/useInstance";
import { AmbientLight } from "three";

import style from "pages/minigames/bip39/bip39.module.scss";
const c = classnames.bind(style);

const configuration = {
  camera: {
    cam: { near: 0.1, far: 10000 },
    xyz: [0, 2, 2],
    eye: [0, 2, 0],
    orbit: { minDst: 1, maxDst: 2.5 },
  },
  scene: {
    gltf: "https://192.168.1.58:5443/scenes/$flan_desk/screens.glb",
    rgbe: "https://192.168.1.58:5443/hdri/royal_esplanade_1k.hdr",
  },
  fonts: {
    primary: "https://192.168.1.58:5443/fonts/segment.ttf",
  },
};

const screensApi = {
  Screen1: {
    number: 1024,
    answer: "kesito petit suiss",
  },
  Screen2: {
    number: 3072,
    answer: "el ticher",
  },
  Screen3: {
    number: 16384,
    answer: "hola",
  },
  Screen4: {
    number: 15072,
    answer: "jaguar yu",
  },
  Screen5: {
    number: 2048,
    answer: "ola",
  },
  Screen6: {
    number: 640,
    answer: "krayola",
  },
  Screen7: {
    number: 128,
    answer: "bonyu",
  },
  Screen8: {
    number: 5124,
    answer: "ECSDEE",
  },
  Screen9: {
    number: 22,
    answer: "eltacker",
  },
  Screen10: {
    number: 876,
    answer: "underteiker",
  },
};

export default function SceneViewer() {
  const canvas = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [focus, setFocus] = useState(false);

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

  const renderSceneMemoized = useCallback(async () => {
    await scenenv.stageEnvironment(configuration.scene);
    context.stageCamera(configuration.camera);

    const light = new AmbientLight(parseInt(0xffffff), 1.0);
    context.scene.add(light);

    const tfgl = await loader.loadAt(configuration.scene.gltf);
    context.scene.add(tfgl.scene);
    setLoaded(true);

    rcaster.capture();

    context.traverseScene();
    context.playScene();
    loader.dispose();

    window.addEventListener("resize", context.handleResize, false);
  }, [context, scenenv, loader, rcaster]);

  useEffect(() => {
    if (!context?.inited) {
      context.initialize();
      return;
    } else if (loader.checkSupport(context)) {
      renderSceneMemoized();
    } else {
      return;
    }

    return () => {
      window.removeEventListener("resize", context.handleResize, true);
    };
  }, [renderSceneMemoized, context, orbiter, loader]);

  const unfocus = () => {
    const [cx, cy, cz] = configuration.camera.xyz;
    const [ex, ey, ez] = configuration.camera.eye;
    context.camera.position.set(cx, cy, cz);
    context.camera.lookAt(ex, ey, ez);
    setFocus(false);
  };

  return (
    <>
      <div id="owo" ref={canvas} style={{ width: "100vw", height: "100vh" }} />
      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          display: "flex",
          flexWrap: "wrap",
          zIndex: -1,
        }}
      >
        {loaded &&
          Object.keys(terminals).map((key) => (
            <InputTerminal
              key={key}
              context={context}
              scene={context.scene}
              screenId={key}
              screenData={terminals[key]}
              riddle={screensApi[key]}
              rcaster={rcaster}
              setFocusing={setFocus}
            />
          ))}
      </div>
      {focus && (
        <button className={c("btn-unfocus")} onClick={unfocus}>
          RETURN
        </button>
      )}
    </>
  );
}
