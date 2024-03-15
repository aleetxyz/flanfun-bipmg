import {
  WebGLRenderer,
  Scene,
  ACESFilmicToneMapping,
  LinearSRGBColorSpace,
  PerspectiveCamera,
  PCFSoftShadowMap,
} from "three";

import AbstractObserver from "./AbstractObserver.js";
import { SceneTraversal } from "./SceneEvents.js";
import isTouchDevice from "utils/DeviceTypeUtils.js";
const mobilePXRFactor = 1.375;

export default function SceneContext(canvas) {
  Object.assign(this, new AbstractObserver());

  const { devicePixelRatio } = window;
  const scaling = { height: 0, tanFOV: 0 };
  let animations = [];
  let captureCallback = false;

  this.inited = false;
  this.scene = new Scene();

  /** To be called after canvas wrapper has been initialized */
  this.initialize = (options = {}) => {
    const { clientWidth, clientHeight } = canvas.current;

    const renderer = new WebGLRenderer({
      antialias: true,
      powerPreference: isTouchDevice() ? "low-power" : "high-performance",
      preserveDrawingBuffer: false,
      stencil: false,
      alpha: false,
    });

    const PXRF = isTouchDevice() ? mobilePXRFactor : 1;
    renderer.setPixelRatio(devicePixelRatio / PXRF);
    renderer.setSize(clientWidth, clientHeight);
    renderer.useLegacyLights = false;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    renderer.outputColorSpace = LinearSRGBColorSpace;

    canvas.current.appendChild(renderer.domElement);
    this.renderer = renderer;
    this.inited = true;

    const { isWebGL2, drawBuffers } = renderer.capabilities;
    return isWebGL2 && drawBuffers;
  };

  /** responsive camera zoom (must receive from .json) **/
  const calcZoom = (width) => {
    if (width <= 576) {
      return 0.5;
    } else if (width > 576 && width <= 768) {
      return 0.625;
    } else if (width > 768 && width <= 1024) {
      return 0.75;
    }
    return 1;
  };

  /** Setup a camera, default is PerspectiveCamera */
  this.stageCamera = (cameraProps) => {
    const { width, height } = canvas.current.getBoundingClientRect();

    const args = { fov: 70, near: 0.01, far: 1000, ...cameraProps?.cam };
    const camera = new PerspectiveCamera(
      args.fov,
      width / height,
      args.near,
      args.far
    );

    camera.zoom = calcZoom(width);
    camera.updateProjectionMatrix();

    scaling.height = height;
    scaling.tanFOV = Math.tan(((Math.PI / 180) * args.fov) / 2);
    cameraProps?.xyz && camera.position.set(...cameraProps.xyz);
    cameraProps?.eye && camera.lookAt(...cameraProps.eye);
    this.scene.add(camera);

    this.camera = camera;
  };

  /** Captures last rendered data from canvas */
  this.capture = (callback) => {
    captureCallback = callback;
  };

  this.handleResize = () => {
    const { width, height } = canvas.current.getBoundingClientRect();
    this.camera.aspect = width / height;
    this.camera.fov =
      (360 / Math.PI) * Math.atan((scaling.tanFOV * height) / scaling.height);
    this.camera.zoom = calcZoom(width);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.render(this.scene, this.camera);
  };

  this.addToScene = (scene) => {
    this.scene.add(scene);
  };

  /** Adds a single Animatable instance into the current render loop array.
   * @param {Animatable} animatable
   */
  this.addAnimatable = (animatable) => {
    const anims = new Set([...animations, animatable]);
    animations = Array.from(anims);
  };

  /**
   * Adds animatable objects to the animation list.
   * @param {List<Animatable>} animatables
   */
  this.animateFor = (animatables) => {
    const anims = new Set([...animations, ...animatables]);
    animations = Array.from(anims);
  };

  /** Overridable. Another renderer may override this function. */
  this.render = () => {
    this.renderer.render(this.scene, this.camera);
  };

  /** Start the animation loop. */
  this.playScene = () => {
    for (let i = 0; i < animations.length; i++) {
      animations[i].animate();
    }
    if (this.scene && this.camera) {
      this.render();
      if (captureCallback) {
        this.renderer.domElement.toBlob(captureCallback);
        captureCallback = null;
      }
    }
    requestAnimationFrame(this.playScene);
  };

  /** traverse the scene and notify result to subscribers. */
  this.traverseScene = () => {
    this.scene.traverse((object) => {
      this.notify(SceneTraversal, object);
    });
  };
}

Object.defineProperty(SceneContext.prototype, "$domElement", {
  get: function () {
    return this.renderer.domElement;
  },
});
