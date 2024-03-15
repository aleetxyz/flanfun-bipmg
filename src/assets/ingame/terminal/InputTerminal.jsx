/* eslint-disable react/prop-types */
import { useCallback, useEffect, useRef, useState } from "react";
import { Color, TextureLoader, Vector3 } from "three";
import gsap from "gsap";
import H2C from "html2canvas";
import classnames from "classnames/bind";

import { throttle } from "modules/delayers";
import { blob2b64 } from "modules/byteutils";

import useInstance from "hooks/useInstance";
import styles from "./terminal.module.scss";

const c = classnames.bind(styles);

/**
 * @param {Object} props
 * @param {CanvasTexture} props.texture
 * @param {string} props.aspect
 * @returns {JSX.Element}
 */
export default function InputTerminal(props) {
  const { rcaster, scene, context, screenId, screenData, riddle } = props;
  const { setFocusing } = props;

  const textureLoader = useInstance(TextureLoader);
  const canvas = useInstance(OffscreenCanvas, 320, 320);
  const [text, setText] = useState("");
  const screen = useRef(null);
  const focus = useRef(null);

  const focusOnTerminal = useCallback(() => {
    const offset = { delta: 0 };

    gsap.to(offset, {
      delta: 1,
      duration: 0.33,
      onUpdate: () => {
        if (context?.camera?.position) {
          const { x: px, y: py, z: pz } = context.camera.position;
          const [dx, dy, dz] = screenData.xyz;
          const rx = gsap.utils.interpolate(px, dx, offset.delta);
          const ry = gsap.utils.interpolate(py, dy, offset.delta);
          const rz = gsap.utils.interpolate(pz, dz, offset.delta);
          context.camera.position.set(rx, ry, rz);

          const lookat = context.camera.getWorldDirection(new Vector3());
          lookat.add(context.camera.position);
          const [tx, ty, tz] = screenData.eye;
          const wx = gsap.utils.interpolate(lookat.x, tx, offset.delta);
          const wy = gsap.utils.interpolate(lookat.y, ty, offset.delta);
          const wz = gsap.utils.interpolate(lookat.z, tz, offset.delta);
          context.camera.lookAt(wx, wy, wz);
        }
      },
    });
  }, [context.camera, screenData.xyz, screenData.eye]);

  useEffect(() => {
    rcaster.subscribe("raycast_result", (name) => {
      if (name === screenId) {
        focus.current.focus();
        focusOnTerminal();
        setFocusing(true);
      }
    });
  }, [rcaster, screenId, focusOnTerminal, setFocusing]);

  useEffect(() => {
    if (canvas) {
      H2C(screen.current, {
        width: 320,
        height: 320,
        scale: 1.0,
        logging: false,
      }).then(async (cvs) => {
        const context2d = canvas.getContext("2d");
        context2d.drawImage(cvs, 0, 0);

        const cblob = await canvas.convertToBlob();
        const image = await blob2b64(cblob);
        /** @type {THREE.Texture} texture */
        const texture = textureLoader.load(image);
        texture.flipY = false;

        const object3d = scene?.getObjectByName(screenId, true);
        object3d?.material?.emissiveMap?.dispose();
        object3d?.material?.map?.dispose();

        object3d.material.emissive = new Color(parseInt(0xffffff));
        object3d.material.color = new Color(parseInt(0xffffff));
        object3d.material.emissiveIntensity = 1.0;
        object3d.material.emissiveMap = texture;
        object3d.material.map = texture;
        object3d.material.needsUpdate = true;
      });
    }
  }, [text, canvas, scene, screenId, textureLoader]);

  const onChange = (evt) => setText(String(evt.target.value).toLowerCase());
  const debouncedOnChange = throttle(onChange, 100);

  const isOkay = () => text === String(riddle?.answer).toLowerCase();

  return (
    <div>
      <div
        ref={screen}
        id={screenId}
        className={c("screen-cont", "screen-square")}
      >
        <p className={c(isOkay() ? "oks" : "err")}>{riddle?.number}</p>
        <br />
        <p className={c(isOkay() ? "oks" : "err")}>{text}</p>
      </div>
      <input
        ref={focus}
        type="text"
        onFocus={focusOnTerminal}
        onChange={debouncedOnChange}
        maxLength={64}
      />
    </div>
  );
}
