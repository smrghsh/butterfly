import * as THREE from "three";
import Experience from "./Experience.js";
import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory.js";
import { XRHandModelFactory } from "three/examples/jsm/webxr/XRHandModelFactory.js";
export default class Controllers {
  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    // this.scene = this.experience.scene;
    this.cameraGroup = this.experience.cameraGroup;
    this.renderer = this.experience.renderer;

    this.controller1 = this.renderer.instance.xr.getController(0);
    this.cameraGroup.add(this.controller1);

    this.controller2 = this.renderer.instance.xr.getController(1);
    this.cameraGroup.add(this.controller2);

    this.controllerModelFactory = new XRControllerModelFactory();
    this.handModelFactory = new XRHandModelFactory();

    this.controllerGrip1 = this.renderer.instance.xr.getControllerGrip(0);
    this.controllerGrip1.add(
      this.controllerModelFactory.createControllerModel(this.controllerGrip1)
    );
    this.cameraGroup.add(this.controllerGrip1);
    this.hand1 = this.renderer.instance.xr.getHand(0);
    this.hand1.add(this.handModelFactory.createHandModel(this.hand1, "mesh"));
    this.cameraGroup.add(this.hand1);

    this.controllerGrip2 = this.renderer.instance.xr.getControllerGrip(1);
    this.controllerGrip2.add(
      this.controllerModelFactory.createControllerModel(this.controllerGrip2)
    );
    this.cameraGroup.add(this.controllerGrip2);
    this.hand2 = this.renderer.instance.xr.getHand(1);
    this.hand2.add(this.handModelFactory.createHandModel(this.hand2, "mesh"));
    this.cameraGroup.add(this.hand2);

    this.debugBoxR = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    this.debugBoxR.visible = false;
    // this.scene.add(this.debugBoxR);

    this.still = false;
    this.emitter = this.experience.emitter;
    this.stillStartTime = 0;
    this.stillDuration = 0;

    this.previouslandingTarget = new THREE.Vector3();
  }
  update() {
    if (this.hand2.joints.hasOwnProperty("index-finger-phalanx-proximal")) {
      const joint = this.hand2?.joints["index-finger-phalanx-proximal"];
      if (joint) {
        const landingTarget = joint.position
          .clone()
          .add(new THREE.Vector3(0, joint.jointRadius, 0));

        if (this.previouslandingTarget.distanceTo(landingTarget) < 0.01) {
          if (!this.still) {
            this.still = true; // Set stillness state
            this.emitter.trigger("still"); // Emit only once
            this.debugBoxR.material.color.set(0x00ff00);
          }
        } else {
          if (this.still) {
            this.emitter.trigger("moved"); // Emit moved event
            this.debugBoxR.material.color.set(0xff0000);
          }
          this.still = false; // Reset stillness state
        }
        this.debugBoxR.position.copy(landingTarget); //addition to get to the surface of the hand
        this.debugBoxR.quaternion.copy(joint.quaternion);
        this.debugBoxR.scale.set(
          joint.jointRadius,
          joint.jointRadius,
          joint.jointRadius
        );
        this.debugBoxR.visible = true;

        this.previouslandingTarget.copy(landingTarget);
      } else {
        this.debugBoxR.visible = false;
      }
    }
  }
}
