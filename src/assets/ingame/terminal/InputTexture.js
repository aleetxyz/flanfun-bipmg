import { CanvasTexture, RepeatWrapping } from "three";

export default function InputTexture() {
  this.initialize = (canvas) => {
    if (!this.texture) {
      this.texture = new CanvasTexture(canvas);
      this.texture.wrapS = RepeatWrapping;
      this.texture.wrapT = RepeatWrapping;
      this.texture.flipY = true;
      this.texture.needsUpdate = true;
    }
  };
}
