import { Raycaster, Vector2 } from "three";
import AbstractObserver from "../AbstractObserver";

/**
 * @param {import("modules/v1/SceneContext").default} context
 */
export default function PointerRaycaster(context, dst = 10.0, first = true) {
  Object.assign(this, new AbstractObserver());

  const raycaster = new Raycaster();
  raycaster.firstHitOnly = first;
  const pointer = new Vector2();
  let isDragging = false;
  let paused = false;

  const disableDragging = () => {
    isDragging = false;
  };

  const enableDragging = () => {
    isDragging = true;
  };

  const castFromPointer = (e) => {
    /* Ignore if pointer is dragging or if capture is paused */
    if (!isDragging && !paused) {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, context.camera);
      for (const child of context.scene.children) {
        if (child.isGroup) {
          const [nearest] = raycaster.intersectObjects(child.children, true);
          if (nearest?.distance <= dst) {
            this.notify(PointerRaycaster.RESULT, nearest.object.name);
          }
        }
      }
    }
  };

  this.pause = () => (paused = true);

  this.getScene = () => {
    return context.scene;
  };

  /** Capture a mouse event. Given the event, raycast. */
  this.capture = () => {
    document.addEventListener("mousedown", disableDragging);
    document.addEventListener("mousemove", enableDragging);
    document.addEventListener("mouseup", castFromPointer);
  };

  /** Cleanup added events. */
  this.dispose = () => {
    document.removeEventListener("mousedown", disableDragging);
    document.removeEventListener("mousemove", enableDragging);
    document.removeEventListener("mouseup", castFromPointer);
  };
}

PointerRaycaster.RESULT = "raycast_result";
