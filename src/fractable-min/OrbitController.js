import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Vector3 } from "three";

/**
 * @extends {CameraController}
 * @param {import("modules/v1/SceneContext").default} context
 */
export default function OrbitController(context) {
  /** @type {OrbitControls} controls */
  let controls;
  /** @type {Object} prevConfig - Holds previous config information */
  const prevConfig = {};
  const buffer = new Vector3();

  /** Initialize OrbitControls. Camera and Canvas DOM Element should exist within the context. */
  this.initialize = (cameraProps) => {
    controls = new OrbitControls(context.camera, context.$domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.dampingFactor = 0.07;
    controls.minPolarAngle = Math.PI / 6;
    controls.maxPolarAngle = Math.PI / 2;

    this.configure(cameraProps.orbit);
    this.positionate(cameraProps.xyz || [1, 0, 1]);
    this.focus(cameraProps.eye || [0, 0, 0]);
  };

  /** Configure orbital control values. */
  this.configure = (config) => {
    config.minDst && (controls.minDistance = config.minDst);
    config.maxDst && (controls.maxDistance = config.maxDst);
    config.minPol && (controls.minPolarAngle = config.minPol);
    config.maxPol && (controls.maxPolarAngle = config.maxPol);
    config.minAzi && (controls.minAzimuthAngle = config.minAzi);
    config.maxAzi && (controls.maxAzimuthAngle = config.maxAzi);
  };

  this.toggle = (config = {}) => {
    "damping" in config && (controls.enableDamping = config.damping);
    "pan" in config && (controls.enablePan = config.pan);
    "rotate" in config && (controls.autoRotate = config.rotate);
    "zoom" in config && (controls.enableZoom = config.zoom);
    controls.update();
  };

  /** Save current controls configuration and state. */
  this.saveState = () => {
    prevConfig.minDst = controls.minDistance;
    prevConfig.maxDst = controls.maxDistance;
    prevConfig.minPol = controls.minPolarAngle;
    prevConfig.maxPol = controls.maxPolarAngle;
    prevConfig.minAzi = controls.minAzimuthAngle;
    prevConfig.maxAzi = controls.maxAzimuthAngle;
    controls.saveState();
  };

  /** Recover last saved controls configuration and state. */
  this.recoverState = () => {
    this.configure(prevConfig);
    controls.reset();
  };

  /**
   * Sets a position vector to rotate around.
   * No reason to camera.lookAt, this already does that.
   * @param {Array<Number>|Vector3} position
   */
  this.focus = (position) => {
    if (position instanceof Vector3) {
      controls.target.copy(position);
    } else {
      buffer.set(...position);
      controls.target.copy(buffer);
    }
  };

  /**
   * Place the camera on the given position vector.
   * @param {Array<Number>|Vector3} position - The position vector.
   */
  this.positionate = (position) => {
    if (position instanceof Vector3) {
      context.camera.position.copy(position);
    } else {
      buffer.set(...position);
      context.camera.position.copy(buffer);
    }
  };

  this.getAttributes = () => {
    return {
      position: context.camera.position,
      target: controls.target,
      azimuth: controls.getAzimuthalAngle(),
      polar: controls.getPolarAngle(),
    };
  };

  Object.defineProperty(this, "animate", {
    enumerable: false,
    value: () => {
      controls.update();
    },
  });
}
