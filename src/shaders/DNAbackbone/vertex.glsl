
#define PI     3.14159265
#define TWO_PI 6.28318530

uniform float uTime;
uniform float offset;
uniform float speed;
uniform float amplitude;
varying vec3 vP;
varying vec3 vP2;

// varying vec2 vUv;
// varying vec4 vProjectedPosition;

void main() {
    vec3 p = vec3(position);
    float o = PI *offset;
    o += uTime;
    // p.z += o;

    p.y += amplitude * sin(p.z * speed +o);
    p.x += amplitude * cos(p.z *speed +o);
    vec4 modelPosition = modelMatrix * vec4(p, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    vP = p;
    vP2 = p.xyz;
    // vUv = uv;
    gl_PointSize =  4.0 + 1.2 * sin(p.z * speed +o);
    gl_Position = projectedPosition;

}