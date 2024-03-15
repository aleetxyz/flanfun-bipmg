import * as THREE from "three";

import { Font } from "three/addons/loaders/FontLoader.js";
import { TTFLoader } from "three/addons/loaders/TTFLoader.js";

export default function FontLoader() {}

/**
 * @param {string} resourceUrl
 * @returns {Promise<Font?>}
 */
FontLoader.load = async (resourceUrl) => {
  const loader = new TTFLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      resourceUrl,
      (font) => resolve(new Font(font)),
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      reject
    );
  });
};
