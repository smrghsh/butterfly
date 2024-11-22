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
    this.floors = [0, -5];
    // add horizontal planes of different colors to this.experience.scene at -4, -8, and -12
  }

  update() {
    const controller = this.experience.controller.pointerController;
    const padControls = controller.padControls;

    if (padControls.primarySqueeze.pressDown && !this.isSqueezing) {
      // Start locomotion by setting the anchor point
      this.anchorPoint = controller.position.clone();
      this.isSqueezing = true;
    }

    if (this.isSqueezing) {
      // Calculate the movement vector
      const currentPosition = controller.position.clone();
      const movementVector = currentPosition.sub(this.anchorPoint);
      // multiply movement vector by speed scalar
      movementVector.multiplyScalar(this.speedScalar);
      // Apply movement to the user's group in the experience scene
      this.experience.cameraGroup.position.sub(movementVector);

      // Update the anchor point to the new controller position
      this.anchorPoint = controller.position.clone();
    }

    if (padControls.primarySqueeze.pressUp && this.isSqueezing) {
      // End locomotion
      this.isSqueezing = false;
      this.anchorPoint = null;
    }
    if (padControls.buttons.bottom.pressDown) {
      if (Date.now() > this.lastTimeTeleported + this.teleportDelay) {
        console.log("teleport");

        // Determine the current floor based on the camera's y position
        const currentY = this.experience.cameraGroup.position.y;
        let currentFloorIndex = this.floors.findIndex(
          (floorY) => floorY === currentY
        );

        // If the current floor is not found (for example, if the position is slightly off)
        if (currentFloorIndex === -1) {
          // Find the closest floor (can improve this to handle small offsets)
          currentFloorIndex = this.floors.reduce((closestIndex, floorY, i) => {
            return Math.abs(currentY - floorY) <
              Math.abs(currentY - this.floors[closestIndex])
              ? i
              : closestIndex;
          }, 0);
        }

        // Calculate the next floor index
        let nextFloorIndex = (currentFloorIndex + 1) % this.floors.length;

        // Set the camera's position to the next floor
        this.experience.cameraGroup.position.set(
          0,
          this.floors[nextFloorIndex],
          0
        );

        // Update the last teleport time
        this.lastTimeTeleported = Date.now();
      } else {
        console.log("already teleported");
        return;
      }
    }
  }
}
