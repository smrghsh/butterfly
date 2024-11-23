import * as THREE from "three";
import Experience from "./Experience";
import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory.js";
import { XRHandModelFactory } from "three/examples/jsm/webxr/XRHandModelFactory.js";
export default class Locomotion {
  constructor(controller, speedScalar = 10) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.anchorPoint = null;
    this.isSqueezing = false;
    this.speedScalar = speedScalar;
    this.lastTimeTeleported = Date.now();
    this.teleportDelay = 2000;
    // add horizontal planes of different colors to this.experience.scene at -4, -8, and -12

    this.debugMesh1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.025, 0.025, 0.025),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    this.scene.add(this.debugMesh1);
    this.debugMesh2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.025, 0.025, 0.025),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    this.scene.add(this.debugMesh2);
    this.controllers = controller;
  }

  update() {
    if(!this.controllers?.hand2 || !this.experience.renderer.instance.xr.isPresenting) {
      console.log("Not XR");
      return;
    }
    var thumbtipPosition;
    var ringtipPosition;
    // TODO: remove
    const thumbtip = this.controllers?.hand2?.joints["thumb-tip"];
    if(thumbtip) {
      thumbtipPosition = thumbtip.position.clone();
    }
    const ringtip = this.controllers?.hand2?.joints["ring-finger-tip"];
    if(ringtip) {
      ringtipPosition = ringtip.position.clone();
    }
    if(!this.controllers) {
      this.debugMesh1.material.color.setHex(0x000000);
      this.debugMesh2.material.color.setHex(0x000000);
    }
    if(thumbtipPosition && ringtipPosition) {
      this.debugMesh1.position.set(thumbtipPosition.x, thumbtipPosition.y, thumbtipPosition.z);
      this.debugMesh2.position.set(ringtipPosition.x, ringtipPosition.y, ringtipPosition.z);
    

    // TODO: this needs to be updated to use the hand
    // UNDER THIS IS CHARLES -----------------------------
    if (ringtipPosition.distanceTo(thumbtipPosition) < 0.02) {
      // Start locomotion by setting the anchor point
      this.anchorPoint = this.controllers.hand2.joints["thumb-tip"].position.clone();
      this.debugMesh1.material.color.setHex(0xffffff);
      this.debugMesh2.material.color.setHex(0xffffff);
      this.isSqueezing = true;
    }
    // BEFORE THIS IS CHARLES -----------------------------

    if (this.isSqueezing) {
      // Calculate the movement vector

      // TODO: this needs to be updated to use the hand
      const currentPosition = this.controllers.hand2.joints["thumb-tip"].position.clone();
      console.log("Current Position: ", currentPosition);
      console.log("Anchor Point: ", this.anchorPoint);
      const movementVector = currentPosition.sub(this.anchorPoint);
      // multiply movement vector by speed scalar
      movementVector.multiplyScalar(this.speedScalar);
      // Apply movement to the user's group in the experience scene
      console.log("Moving this fast: ", movementVector);
      this.experience.cameraGroup.position.sub(movementVector);

      // TODO: update to use hand
      // Update the anchor point to the new controller position
      this.anchorPoint = this.controllers.hand2.joints["thumb-tip"].position.clone();
    }

    // TODO: update to use the hand
    if (ringtipPosition.distanceTo(thumbtipPosition) >= 0.02 && this.isSqueezing) {
      console.log("YES! YES!")
      this.debugMesh1.material.color.setHex(0xfff000);
      this.debugMesh2.material.color.setHex(0x000fff);
      // End locomotion
      this.isSqueezing = false;
      this.anchorPoint = null;
    }
  }
  }
}
