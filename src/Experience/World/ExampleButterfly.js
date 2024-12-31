import * as THREE from "three";
import Experience from "../Experience.js";
import ButterflyVertexShader from "../../shaders/Butterfly/vertex.glsl";

import ButterflyFragmentShader from "../../shaders/Butterfly/fragment.glsl";

export default class ExampleButterfly {
  constructor() {
    this.experience = new Experience();
    this.world = this.experience.world;
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;
    this.resources = this.experience.resources;
    this.butterflyTextures = {
      Monarch: this.resources.items.butterflyTexture,
      Pink: this.resources.items.butterflyTexture2,
      Blue: this.resources.items.butterflyTexture3,
      Plane: this.resources.items.planeTexture,
    };
    this.speed = 0.2;
    this.geometry = new THREE.PlaneGeometry(1, 1, 2, 1);
    this.material = new THREE.ShaderMaterial({
      vertexShader: ButterflyVertexShader,
      fragmentShader: ButterflyFragmentShader,
      transparent: true,
      // opacity: 0.5,
      side: THREE.DoubleSide,
      //   wireframe: true,
      color: 0xffffff,
      uniforms: {
        uTime: { value: 0.0 },
        texture1: { value: this.butterflyTextures["Monarch"] },
      },
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.position.y += 0.001;
    this.mesh.scale.set(0.1, 0.1, 0.1);
    this.scene.add(this.mesh);
    this.mesh.visible = false;

    this.debug.ui
      .add(this.mesh, "visible")
      .name("Example Mode (click & drag after toggling)")
      .onChange((boolean) => {
        this.exampleMode(boolean);
      })
      .listen();
    this.exampleFolder = this.debug.ui.addFolder("Example Parameters");
    this.exampleFolder
      .add(this.material.uniforms.texture1, "value", this.butterflyTextures)
      .name("Butterfly Texture");
    this.exampleFolder.close();
  }
  update() {
    this.material.uniforms.uTime.value =
      this.experience.clock.getElapsedTime() * this.speed;
  }
  exampleMode(boolean) {
    if (boolean) {
      this.mesh.visible = true;
      this.world.floor.forestFloor.visible = false;
      this.world.butterflies.butterflies.visible = false;
      //   this.world.butterflies.depopulate();
      this.world.butterfly.mesh.visible = false;
      this.experience.camera.examplePosition();
      this.exampleFolder.open();
      this.debug.mainVisible = false;
      this.debug.toggleVisibility(false);
    } else {
      this.mesh.visible = false;
      this.experience.camera.defaultPosition();
      this.world.floor.forestFloor.visible = true;
      this.world.butterflies.butterflies.visible = true;
      this.world.butterfly.mesh.visible = true;
      this.exampleFolder.close();
      this.debug.mainVisible = true;
      this.debug.toggleVisibility(true);
    }
  }
}
