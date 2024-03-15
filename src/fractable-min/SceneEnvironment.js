import { DataTexture } from "three";
import {
  EquirectangularReflectionMapping,
  LinearSRGBColorSpace,
  LinearFilter,
  HalfFloatType,
} from "three/src/constants";

import RGBEWorker from "./workers/RGBEWorker?worker";

/**
 * @typedef {Object} SceneAttributes
 * @prop {String} uuid - The scene UUID.
 * @prop {String} rgbe - URI of the background image to be used.
 */
export default function SceneEnvironment(context) {
  /**
   * Loads an equirectangular reflective Radiance HDR image.
   * @param {string} imageUrl - Texture URL.
   * @returns {Promise<[Texture, Texture]>} - The compiled textures.
   */
  const loadRGBE = async function (imageUrl) {
    // this worker is called mutiple time because of parent rerenders
    // so it better be called in here wince this is only one invocation
    const rgbeWorker = new RGBEWorker();
    return new Promise((resolve, reject) => {
      rgbeWorker.postMessage(imageUrl);
      rgbeWorker.onmessage = (msg) => {
        rgbeWorker.terminate();
        const RGBE = msg.data;
        const bg = new DataTexture(RGBE.data, RGBE.width, RGBE.height);
        bg.colorSpace = LinearSRGBColorSpace;
        bg.type = HalfFloatType;
        bg.magFilter = LinearFilter;
        bg.minFilter = LinearFilter;
        bg.mapping = EquirectangularReflectionMapping;
        bg.flipY = true;
        bg.needsUpdate = true;
        // impl-specific
        resolve(bg);
      };
    });
  };

  const dispatchMap = {
    rgbe: loadRGBE,
  };

  this.stageEnvironment = async (sceneAttrib = {}) => {
    const dispatchKeys = Object.keys(dispatchMap);
    const attributeKeys = Object.keys(sceneAttrib);
    const envType = dispatchKeys.filter((value) =>
      attributeKeys.includes(value)
    );
    if (envType) {
      const bg = await dispatchMap[envType](sceneAttrib[envType]);
      context.scene.background = bg;
      context.scene.environment = bg;
    }
  };
}
