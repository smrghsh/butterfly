import * as THREE from "three";
import Experience from "../Experience.js";
import SentientButterflyVertexShader from "../../shaders/Butterfly/sentientVertex.glsl";
import ButterflyFragmentShader from "../../shaders/Butterfly/fragment.glsl";

export default class Butterfly {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.mouse = this.experience.mouse;
    //resources
    this.resources = this.experience.resources;
    this.mouse = this.experience.mouse;
    this.raycaster = new THREE.Raycaster();
    //get butterfly texture
    this.butterflyTexture = this.resources.items.butterflyTexture;

    this.skittish = true;
    this.geometry = new THREE.PlaneGeometry(1, 1, 2, 1);
    this.geometry.rotateX(-Math.PI * 0.5);

    this.material = new THREE.ShaderMaterial({
      vertexShader: SentientButterflyVertexShader,
      fragmentShader: ButterflyFragmentShader,
      transparent: true,
      // opacity: 0.5,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0.0 },
        texture1: { value: this.butterflyTexture },
        stillness: { value: 0.1 },
      },
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.y += 0.001;
    this.mesh.scale.set(0.1, 0.1, 0.1);

    this.scene.add(this.mesh);
    console.log(this.mouse);
    this.mouse.emitter.on("still", () => {
      this.mesh.visible = true;
      this.skittish = false;
      // if xr active, set the position to one foot above the this.experience.controllers.previouslandingTarget.clone();
      // otherwise, set the position to one foot above the mouse position
      if (
        this.experience.renderer.instance.xr.isPresenting &&
        this.experience.controllers.hand2.joints.hasOwnProperty(
          "index-finger-phalanx-proximal"
        )
      ) {
        this.mesh.position.set(
          this.experience.controllers.previouslandingTarget.x + 0.5,
          this.experience.controllers.previouslandingTarget.y + 0.5,
          this.experience.controllers.previouslandingTarget.z + 0.2
        );
      } else {
        const departure = new THREE.Vector3();
        this.raycaster.ray.at(4, departure);
        departure.y += 0.5;
        departure.x += 0.5;
        this.mesh.position.set(departure.x, departure.y, departure.z);
      }
      // this.mesh.position.set(this.mouse.x, 1, this.mouse.y + 1);
    });

    this.mouse.emitter.on("moved", () => {
      this.mesh.visible = false;
      this.skittish = true;
    });
  }
  update() {
    //
    this.raycaster.setFromCamera(this.mouse, this.experience.camera.instance);

    let landingTarget = new THREE.Vector3();
    if (this.skittish) {
      return;
    }
    if (
      this.experience.renderer.instance.xr.isPresenting &&
      this.experience.controllers.hand2.joints.hasOwnProperty(
        "index-finger-phalanx-proximal"
      )
    ) {
      landingTarget = this.experience.controllers.previouslandingTarget.clone();
    } else {
      this.raycaster.ray.at(4, landingTarget);
    }

    this.butterflyDirection = new THREE.Vector3();
    this.butterflyDirection.subVectors(
      landingTarget,
      this.experience.camera.instance.position
    );
    this.butterflyDirection.normalize();
    this.butterflyDirection.crossVectors(
      this.butterflyDirection,
      this.experience.camera.instance.up
    );
    this.butterflyDirection.normalize();

    this.a = new THREE.Vector3();
    this.a.subVectors(landingTarget, this.experience.camera.instance.position);

    this.mesh.lookAt(
      landingTarget.x + this.butterflyDirection.x,
      landingTarget.y + this.butterflyDirection.y,
      landingTarget.z + this.butterflyDirection.z
    );
    this.material.uniforms.uTime.value =
      this.experience.clock.getElapsedTime() * 0.2;

    // vector3 that is part way between the current position and landing Target
    this.butterflyPosition = new THREE.Vector3();
    this.butterflyPosition.subVectors(landingTarget, this.mesh.position);
    this.butterflyPosition.multiplyScalar(0.01);
    this.mesh.position.add(this.butterflyPosition);
  }
}
