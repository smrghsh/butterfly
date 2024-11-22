import * as THREE from "three";
import Experience from "../../Experience";
export default class Locomotion {
  constructor(speedScalar = 4) {
    this.experience = new Experience();
    this.anchorPoint = null;
    this.isSqueezing = false;
    this.speedScalar = speedScalar;
    this.lastTimeTeleported = Date.now();
    this.teleportDelay = 2000;
    // add horizontal planes of different colors to this.experience.scene at -4, -8, and -12
  }

  update() {
    const controller = this.experience.controller.pointerController;
    // TODO: remove
    const padControls = controller.padControls;

    // TODO: this needs to be updated to use the hand
    if (padControls.primarySqueeze.pressDown && !this.isSqueezing) {
      // Start locomotion by setting the anchor point
      this.anchorPoint = controller.position.clone();
      this.isSqueezing = true;
    }

    if (this.isSqueezing) {
      // Calculate the movement vector

      // TODO: this needs to be updated to use the hand
      const currentPosition = controller.position.clone();
      const movementVector = currentPosition.sub(this.anchorPoint);
      // multiply movement vector by speed scalar
      movementVector.multiplyScalar(this.speedScalar);
      // Apply movement to the user's group in the experience scene
      this.experience.cameraGroup.position.sub(movementVector);

      // TODO: update to use hand
      // Update the anchor point to the new controller position
      this.anchorPoint = controller.position.clone();
    }

    // TODO: update to use the hand
    if (padControls.primarySqueeze.pressUp && this.isSqueezing) {
      // End locomotion
      this.isSqueezing = false;
      this.anchorPoint = null;
    }
  }
}
