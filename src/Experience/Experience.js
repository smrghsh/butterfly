import * as THREE from "three";
import Debug from "./Utils/Debug.js";
import Sizes from "./Utils/Sizes.js";
import Resources from "./Utils/Resources.js";
import Mouse from "./Utils/Mouse.js";
import Camera from "./Camera.js";
import Renderer from "./Renderer.js";
import World from "./World/World.js";
import sources from "./sources.js";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";
import Controllers from "./Controllers.js";
import EventEmitter from "./Utils/EventEmitter.js";
import StatsPanels from "./Utils/StatsPanels.js";

let instance = null;

export default class Experience {
  //if you are new to javascript, I understand how the following lines look like witchcraft
  constructor(canvas) {
    if (instance) {
      return instance;
    }
    instance = this;
    // Global access
    window.experience = this;
    this.canvas = canvas;
    this.emitter = new EventEmitter();
    this.sizes = new Sizes();
    this.scene = new THREE.Scene();
    this.resources = new Resources(sources);
    this.world = new World();
    this.cameraGroup = new THREE.Group();
    this.scene.add(this.cameraGroup);
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.mouse = new Mouse();
    this.debug = new Debug();
    this.statsPanels = new StatsPanels();

    /**
     * Clock
     */
    this.clock = new THREE.Clock();
    this.clock.start();

    this.renderer.instance.xr.enabled = true;

    const sessionInit = {
      optionalFeatures: ["hand-tracking"], //necessary to get the hands going
    };

    document.body.appendChild(
      VRButton.createButton(this.renderer.instance, sessionInit)
    );

    this.renderer.instance.setAnimationLoop(() => {
      this.statsPanels.begin();
      this.world.update();
      this.controllers?.update();
      this.renderer.instance.render(this.scene, this.camera.instance);
      this.statsPanels.end();
    });

    this.controllers = new Controllers();

    this.raycaster = new THREE.Raycaster();
    this.INTERSECTED = null;

    this.sizes.on("resize", () => {
      this.resize();
      this.camera.resize();
      this.renderer.resize();
    });
  }

  resize() {
    console.log("resized occured");
    this.camera.resize();
  }
  update() {}
  destroy() {
    // TBH I've never used this
    this.sizes.off("resize");
    this.time.off("tick");

    // Traverse the whole scene
    this.scene.traverse((child) => {
      // Test if it's a mesh
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();

        // Loop through the material properties
        for (const key in child.material) {
          const value = child.material[key];

          // Test if there is a dispose function
          if (value && typeof value.dispose === "function") {
            value.dispose();
          }
        }
      }
    });
    this.camera.controls.dispose();
    this.renderer.instance.dispose();
    if (this.debug.active) {
      this.debug.ui.destroy();
    }
  }
}
