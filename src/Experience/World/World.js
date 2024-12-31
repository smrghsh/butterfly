import * as THREE from "three";
import Experience from "../Experience.js";
import Environment from "./Environment.js";
import Floor from "./Floor.js";
import Butterfly from "./Butterfly.js";
import Butterflies from "./Butterflies.js";
import ExampleButterfly from "./ExampleButterfly.js";
export default class World {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Wait for resources
    this.ready = false;
    this.resources.on("ready", () => {
      // Setup
      console.log("resources ready");
      this.floor = new Floor();

      this.butterflies = new Butterflies();
      this.butterfly = new Butterfly();
      this.example = new ExampleButterfly();

      this.environment = new Environment();
      this.ready = true;
    });
  }
  update() {
    if (this.ready) {
      this.butterflies.update();
      this.butterfly.update();
      this.example.update();
    }
  }
}
