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

export default class Butterflies {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    //resources
    this.resources = this.experience.resources;
    //get butterfly texture
    this.butterflyTexture = this.resources.items.butterflyTexture;

    this.geometry = new THREE.PlaneGeometry(1, 1, 2, 1);
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

    this.butterflies = new THREE.Group();
    for (let i = 0; i < 100; i++) {
      let butterflyGeometry = this.geometry.clone(); // Clone geometry
      let displacement = new Float32Array(
        butterflyGeometry.attributes.position.count
      );
      for (let j = 0; j < displacement.length; j++) {
        displacement[j] = i;
      }

      let displacementAttribute = new THREE.BufferAttribute(displacement, 1);
      displacementAttribute.setUsage(THREE.DynamicDrawUsage); // Set to dynamic if needed
      butterflyGeometry.setAttribute("displacement", displacementAttribute);

      let butterfly = new THREE.Mesh(butterflyGeometry, this.material); // Use the cloned geometry
      //scale to 0.1
      butterfly.scale.set(0.1, 0.1, 0.1);
      //rotate
      butterfly.rotation.x = -Math.PI * 0.5;
      // slight variation in rotation
      butterfly.rotation.y = Math.random() * Math.PI * 0.1;
      butterfly.rotation.z = Math.random() * Math.PI;

      butterfly.position.x = (Math.random() - 0.5) * 5;
      butterfly.position.y = (Math.random() - 0.5) * 5;
      butterfly.position.z = (Math.random() - 0.5) * 5;
      this.butterflies.add(butterfly);
    }
    this.scene.add(this.butterflies);
  }
  update() {
    this.material.uniforms.uTime.value =
      this.experience.clock.getElapsedTime() * 0.2;
    // iterate through every butterfly with a forEach loop, increment the position vector of the butterfly by 0.01 in the orientation direciton
    this.butterflies.children.forEach((butterfly) => {
      // get the vector of the butterflies orientation
      let vector = new THREE.Vector3(0, 1, 0);
      vector.applyQuaternion(butterfly.quaternion);
      vector.normalize();
      // increment the position vector of the butterfly by 0.01 in the orientation direciton
      butterfly.position.add(
        vector.multiplyScalar(
          0.001 *
            (0.5 +
              1.0 *
                rand([
                  //butterfly attribute displacement
                  butterfly.geometry.attributes.displacement.array[0],
                  0.0,
                ]))
        )
      );
      // reset the position if the butterfly is too far away
      if (butterfly.position.x > 2.5) {
        butterfly.position.x = -2.5;
      }
      if (butterfly.position.x < -2.5) {
        butterfly.position.x = 2.5;
      }
      if (butterfly.position.y > 2.5) {
        butterfly.position.y = -2.5;
      }
      if (butterfly.position.y < -2.5) {
        butterfly.position.y = 2.5;
      }
      if (butterfly.position.z > 2.5) {
        butterfly.position.z = -2.5;
      }
      if (butterfly.position.z < -2.5) {
        butterfly.position.z = 2.5;
      }
      //   if (butterfly.position.x > 10) {
      //   butterfly.position.x += 0.01;
    });
  }
}
