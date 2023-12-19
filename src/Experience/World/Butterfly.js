import * as THREE from "three";
import Experience from "../Experience.js";
import ButterflyVertexShader from "../../shaders/Butterfly/vertex.glsl";
import ButterflyFragmentShader from "../../shaders/Butterfly/fragment.glsl";
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
    //get butterfly texture
    this.butterflyTexture = this.resources.items.butterflyTexture;

    this.geometry = new THREE.PlaneGeometry(1, 1, 2, 1);

    // add attribute to geometry called ordinate, which is a float32array with 1 values

    // shadermaterial with butterfly textur

    this.material = new THREE.ShaderMaterial({
      vertexShader: ButterflyVertexShader,
      fragmentShader: ButterflyFragmentShader,
      transparent: true,
      // opacity: 0.5,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0.0 },
        texture1: { value: this.butterflyTexture },
      },
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    //rotate the mesh
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.position.y += 0.001;
    this.mesh.scale.set(0.1, 0.1, 0.1);

    this.scene.add(this.mesh);
  }
  update() {
    this.material.uniforms.uTime.value = this.experience.time.elapsed * 0.0001;
  }
}
