import * as THREE from "three";
import Experience from "../Experience.js";
import EventEmitter from "../Utils/EventEmitter.js";

export default class Mouse extends THREE.Vector2 {
  constructor() {
    super();
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.emitter = this.experience.emitter;

    this.lastPosition = new THREE.Vector2();
    this.lastMoveTime = 0;
    this.isStill = false; // Track stillness state

    window.addEventListener("mousemove", (event) => {
      const newX = (event.clientX / this.sizes.width) * 2 - 1;
      const newY = -(event.clientY / this.sizes.height) * 2 + 1;

      if (
        Math.abs(newX - this.lastPosition.x) > 0.01 ||
        Math.abs(newY - this.lastPosition.y) > 0.01
      ) {
        this.x = newX;
        this.y = newY;
        this.lastPosition.set(newX, newY);
        this.lastMoveTime = performance.now();

        if (this.isStill) {
          this.isStill = false; // Reset stillness state
          this.emitter.trigger("moved");
        }
      }
    });

    // Stillness check every frame
    setInterval(() => {
      if (performance.now() - this.lastMoveTime > 3000) {
        if (!this.isStill) {
          this.isStill = true; // Set stillness state
          this.emitter.trigger("still"); // Emit only once
        }
      }
    }, 100);
  }
}
