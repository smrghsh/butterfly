import * as THREE from "three";
import Experience from "./Experience.js";
import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory.js";
import { XRHandModelFactory } from "three/examples/jsm/webxr/XRHandModelFactory.js";
export default class Controllers {
  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.renderer = this.experience.renderer;

    this.controller1 = this.renderer.instance.xr.getController(0);
    this.scene.add(this.controller1);

    this.controller2 = this.renderer.instance.xr.getController(1);
    this.scene.add(this.controller2);

    this.controllerModelFactory = new XRControllerModelFactory();
    this.handModelFactory = new XRHandModelFactory();

    this.controllerGrip1 = this.renderer.instance.xr.getControllerGrip(0);
    this.controllerGrip1.add(
      this.controllerModelFactory.createControllerModel(this.controllerGrip1)
    );
    this.scene.add(this.controllerGrip1);
    this.hand1 = this.renderer.instance.xr.getHand(0);
    this.hand1.add(this.handModelFactory.createHandModel(this.hand1, "mesh"));
    this.scene.add(this.hand1);

    this.controllerGrip2 = this.renderer.instance.xr.getControllerGrip(1);
    this.controllerGrip2.add(
      this.controllerModelFactory.createControllerModel(this.controllerGrip2)
    );
    this.scene.add(this.controllerGrip2);
    this.hand2 = this.renderer.instance.xr.getHand(1);
    this.hand2.add(this.handModelFactory.createHandModel(this.hand2, "mesh"));
    this.scene.add(this.hand2);
  }

  setInstance() {}

  resize() {}

  update() {}
}
