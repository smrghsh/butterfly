import * as THREE from "three";
import Experience from "../Experience.js";

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.scene.background = new THREE.Color("AliceBlue");
    this.setSunLight();
    this.setAmbientLight();
    this.scene.fog = new THREE.Fog("#ffffff", 1, 15);
  }
  setAmbientLight() {
    this.ambientLight = new THREE.AmbientLight("#ffffff", 3.0);
    this.scene.add(this.ambientLight);
  }

  setSunLight() {
    this.sunLight = new THREE.DirectionalLight("#ffffff", 2);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(3.5, 2, 10.25);
    this.scene.add(this.sunLight);
  }
}
