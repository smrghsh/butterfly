import * as THREE from "three";
import Experience from "../Experience.js";
import SentientButterflyVertexShader from "../../shaders/Butterfly/sentientVertex.glsl";
import ButterflyFragmentShader from "../../shaders/Butterfly/fragment.glsl";
import Mouse from "../Utils/Mouse.js";

function rand(co) {
  return Math.fract(Math.sin(dot(co, [12.9898, 78.233])) * 43758.5453);
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}

Math.fract = function (x) {
  return x - Math.floor(x);
};

export default class Butterfly {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    //resources
    this.resources = this.experience.resources;
    this.mouse = this.experience.mouse;
    this.raycaster = new THREE.Raycaster();
    //get butterfly texture
    this.butterflyTexture = this.resources.items.butterflyTexture;

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
    //rotate the mesh
    // this.mesh.rotation.x = -Math.PI * 0.5;
    // this.mesh.rotation
    this.mesh.position.y += 0.001;
    this.mesh.scale.set(0.1, 0.1, 0.1);

    this.axesHelper = new THREE.AxesHelper(5);
    this.scene.add(this.axesHelper);
    this.scene.add(this.mesh);
  }
  update() {
    this.raycaster.setFromCamera(this.mouse, this.experience.camera.instance);

    let landingTarget = this.raycaster.ray.at(1);

    this.butterflyDirection = new THREE.Vector3();
    this.butterflyDirection.subVectors(
      landingTarget,
      this.experience.camera.instance.position
    );

    this.butterflyDirection.normalize();
    //cross butterflyDirection with camera.up
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
    this.material.uniforms.uTime.value = this.experience.time.elapsed;

    this.mesh.position.set(landingTarget.x, landingTarget.y, landingTarget.z);
    this.mesh.position.x -= this.butterflyDirection.x * 0.1;
    this.mesh.position.y -= this.butterflyDirection.y * 0.1;
    this.mesh.position.z -= this.butterflyDirection.z * 0.1;
  }
}
