
#define PI     3.14159265
#define TWO_PI 6.28318530

uniform float uTime;
uniform float offset;
uniform float speed;
uniform float amplitude;
// varying vec2 vUv;
varying vec4 vP;

void main() {
    vec3 p = vec3(position);
    float o = PI *offset;
    o += uTime;
    // p.z += o;

    p.y = position.y * sin(p.z * speed +o);
    p.x += position.y * cos(p.z *speed +o);
    vec4 modelPosition = modelMatrix * vec4(p, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    // vP = p;
    gl_PointSize =  1.0;
    gl_Position = projectedPosition;

}