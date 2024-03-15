import { Cache, REVISION } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module";

const THREE_PATH = `https://unpkg.com/three@0.${REVISION}.x`;
Cache.enabled = true;

/**
 * @description Loads a GLXX scene, compressed or uncompressed
 * (C) Fractable 2020-2022
 */
export default function SceneLoader() {
  const dracoLoader = new DRACOLoader();
  const ktx2Loader = new KTX2Loader();

  this.checkSupport = (context) => {
    dracoLoader.setDecoderPath(`${THREE_PATH}/examples/jsm/libs/draco/`);
    ktx2Loader.setTranscoderPath(`${THREE_PATH}/examples/js/libs/basis/`);
    const ktxIns = ktx2Loader.detectSupport(context?.renderer);
    return ktxIns ? true : false;
  };

  /** @returns Promise<THREE.Scene> scene */
  this.loadAt = (assetUrl, onProgress) => {
    const loader = new GLTFLoader();

    return new Promise((resolve, reject) => {
      loader.setCrossOrigin("anonymous");
      loader.setDRACOLoader(dracoLoader);
      loader.setKTX2Loader(ktx2Loader);
      loader.setMeshoptDecoder(MeshoptDecoder);
      loader.load(assetUrl, (gltf) => resolve(gltf), onProgress, reject);
    });
  };

  this.dispose = () => {
    dracoLoader.dispose();
    ktx2Loader.dispose();
  };
}
